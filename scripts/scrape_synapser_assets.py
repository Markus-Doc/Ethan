from __future__ import annotations

import argparse
import hashlib
import json
import mimetypes
import os
import re
import time
import urllib.parse
import urllib.request
import urllib.robotparser
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Iterable

from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright


DEFAULT_START_URL = "https://www.synapserstudio.com/"
DEFAULT_OUTPUT_DIR = Path("assets/references/synapserstudio")
USER_AGENT = "EthanAssetInventory/1.0 (+local research; respects robots.txt)"

ASSET_EXTENSIONS = {
    ".avif",
    ".css",
    ".gif",
    ".glb",
    ".gltf",
    ".ico",
    ".jpeg",
    ".jpg",
    ".js",
    ".json",
    ".m4v",
    ".mov",
    ".mp4",
    ".ogg",
    ".otf",
    ".png",
    ".svg",
    ".ttf",
    ".webm",
    ".webp",
    ".woff",
    ".woff2",
}

MEDIA_CONTENT_TYPES = (
    "audio/",
    "font/",
    "image/",
    "model/",
    "text/css",
    "video/",
)

URL_IN_CSS_RE = re.compile(r"url\((['\"]?)(.*?)\1\)", re.IGNORECASE)


@dataclass(frozen=True)
class Asset:
    url: str
    kind: str
    source_page: str
    status: int | None = None
    content_type: str | None = None
    bytes: int | None = None
    local_path: str | None = None


def normalize_url(url: str, base_url: str) -> str | None:
    if not url:
        return None
    url = url.strip()
    if not url or url.startswith(("data:", "blob:", "mailto:", "tel:", "#")):
        return None
    joined = urllib.parse.urljoin(base_url, url)
    parsed = urllib.parse.urlparse(joined)
    if parsed.scheme not in {"http", "https"}:
        return None
    return urllib.parse.urlunparse(parsed._replace(fragment=""))


def same_origin(url: str, origin: str) -> bool:
    parsed = urllib.parse.urlparse(url)
    origin_parsed = urllib.parse.urlparse(origin)
    return (
        parsed.scheme in {"http", "https"}
        and parsed.netloc.lower().removeprefix("www.")
        == origin_parsed.netloc.lower().removeprefix("www.")
    )


def asset_kind(url: str, content_type: str | None = None) -> str | None:
    if content_type:
        content_type = content_type.split(";")[0].strip().lower()
        if content_type.startswith("image/"):
            return "image"
        if content_type.startswith("video/"):
            return "video"
        if content_type.startswith("audio/"):
            return "audio"
        if content_type.startswith("font/"):
            return "font"
        if content_type.startswith("model/"):
            return "model"
        if content_type == "text/css":
            return "stylesheet"
    ext = Path(urllib.parse.urlparse(url).path).suffix.lower()
    if ext in {".mp4", ".m4v", ".mov", ".webm"}:
        return "video"
    if ext in {".avif", ".gif", ".ico", ".jpeg", ".jpg", ".png", ".svg", ".webp"}:
        return "image"
    if ext in {".woff", ".woff2", ".ttf", ".otf"}:
        return "font"
    if ext in {".glb", ".gltf"}:
        return "model"
    if ext == ".css":
        return "stylesheet"
    if ext in {".js", ".json"}:
        return "runtime"
    return "asset" if ext in ASSET_EXTENSIONS else None


def parse_srcset(srcset: str, base_url: str) -> Iterable[str]:
    for candidate in srcset.split(","):
        url = candidate.strip().split(" ")[0]
        normalized = normalize_url(url, base_url)
        if normalized:
            yield normalized


def extract_dom_assets(html: str, page_url: str) -> set[str]:
    soup = BeautifulSoup(html, "html.parser")
    urls: set[str] = set()

    for tag in soup.find_all(True):
        for attr in ("src", "href", "poster", "data-src", "data-bg", "data-video"):
            value = tag.get(attr)
            if value:
                normalized = normalize_url(value, page_url)
                if normalized:
                    urls.add(normalized)
        srcset = tag.get("srcset")
        if srcset:
            urls.update(parse_srcset(srcset, page_url))
        style = tag.get("style")
        if style:
            for match in URL_IN_CSS_RE.finditer(style):
                normalized = normalize_url(match.group(2), page_url)
                if normalized:
                    urls.add(normalized)

    for style in soup.find_all("style"):
        css = style.string or ""
        for match in URL_IN_CSS_RE.finditer(css):
            normalized = normalize_url(match.group(2), page_url)
            if normalized:
                urls.add(normalized)

    return urls


def extract_links(html: str, page_url: str, origin: str) -> set[str]:
    soup = BeautifulSoup(html, "html.parser")
    links: set[str] = set()
    for anchor in soup.find_all("a", href=True):
        normalized = normalize_url(anchor["href"], page_url)
        if normalized and same_origin(normalized, origin):
            links.add(normalized)
    return links


def build_robot_parser(start_url: str) -> urllib.robotparser.RobotFileParser:
    parsed = urllib.parse.urlparse(start_url)
    robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"
    parser = urllib.robotparser.RobotFileParser(robots_url)
    parser.read()
    return parser


def fetch_sitemap_urls(start_url: str, robots: urllib.robotparser.RobotFileParser) -> list[str]:
    parsed = urllib.parse.urlparse(start_url)
    sitemap_url = f"{parsed.scheme}://{parsed.netloc}/sitemap.xml"
    request = urllib.request.Request(sitemap_url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            xml = response.read().decode("utf-8", errors="replace")
    except Exception:
        return []
    soup = BeautifulSoup(xml, "xml")
    urls = [loc.get_text(strip=True) for loc in soup.find_all("loc")]
    return [url for url in urls if robots.can_fetch(USER_AGENT, url)]


def safe_download_path(output_dir: Path, url: str, content_type: str | None) -> Path:
    parsed = urllib.parse.urlparse(url)
    clean_path = parsed.path.strip("/").replace("/", "__")
    if not clean_path:
        clean_path = "index"
    suffix = Path(clean_path).suffix
    if not suffix and content_type:
        guessed = mimetypes.guess_extension(content_type.split(";")[0].strip())
        if guessed:
            clean_path += guessed
    digest = hashlib.sha256(url.encode("utf-8")).hexdigest()[:10]
    path = output_dir / "downloads" / f"{digest}__{clean_path}"
    path.parent.mkdir(parents=True, exist_ok=True)
    return path


def download_asset(asset: Asset, output_dir: Path) -> tuple[str | None, int | None]:
    request = urllib.request.Request(asset.url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(request, timeout=45) as response:
            target = safe_download_path(output_dir, asset.url, response.headers.get("content-type"))
            data = response.read()
            target.write_bytes(data)
            return str(target.as_posix()), len(data)
    except Exception:
        return None, None


def crawl(start_url: str, output_dir: Path, max_pages: int, download: bool) -> dict:
    robots = build_robot_parser(start_url)
    origin = start_url
    sitemap_urls = fetch_sitemap_urls(start_url, robots)
    pending = [start_url, *sitemap_urls]
    seen_pages: set[str] = set()
    assets_by_url: dict[str, Asset] = {}

    output_dir.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context(user_agent=USER_AGENT, viewport={"width": 1440, "height": 1200})

        while pending and len(seen_pages) < max_pages:
            page_url = pending.pop(0)
            if page_url in seen_pages or not robots.can_fetch(USER_AGENT, page_url):
                continue
            seen_pages.add(page_url)
            page = context.new_page()

            def on_response(response):
                url = response.url
                content_type = response.headers.get("content-type")
                kind = asset_kind(url, content_type)
                if kind and url not in assets_by_url:
                    assets_by_url[url] = Asset(
                        url=url,
                        kind=kind,
                        source_page=page_url,
                        status=response.status,
                        content_type=content_type,
                    )

            page.on("response", on_response)
            page.goto(page_url, wait_until="domcontentloaded", timeout=45000)
            page.wait_for_timeout(5000)
            html = page.content()

            for url in extract_dom_assets(html, page_url):
                kind = asset_kind(url)
                if kind and url not in assets_by_url:
                    assets_by_url[url] = Asset(url=url, kind=kind, source_page=page_url)

            for link in extract_links(html, page_url, origin):
                if link not in seen_pages and robots.can_fetch(USER_AGENT, link):
                    pending.append(link)

            page.close()
            time.sleep(0.5)

        browser.close()

    assets = list(assets_by_url.values())
    if download:
        downloaded: list[Asset] = []
        for asset in assets:
            local_path, size = download_asset(asset, output_dir)
            downloaded.append(
                Asset(
                    url=asset.url,
                    kind=asset.kind,
                    source_page=asset.source_page,
                    status=asset.status,
                    content_type=asset.content_type,
                    bytes=size,
                    local_path=local_path,
                )
            )
        assets = downloaded

    manifest = {
        "start_url": start_url,
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "robots_txt_respected": True,
        "downloaded": download,
        "pages_crawled": sorted(seen_pages),
        "asset_count": len(assets),
        "assets": [asdict(asset) for asset in sorted(assets, key=lambda item: (item.kind, item.url))],
        "scrapegraphai_status": check_scrapegraphai_status(),
    }
    manifest_path = output_dir / "manifest.json"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return manifest


def check_scrapegraphai_status() -> dict:
    status = {"scrapegraphai_installed": False, "scrapegraph_py_installed": False}
    try:
        import scrapegraphai  # noqa: F401

        status["scrapegraphai_installed"] = True
        try:
            from scrapegraphai.graphs import SmartScraperGraph  # noqa: F401

            status["smart_scraper_graph_available"] = True
        except Exception as exc:
            status["smart_scraper_graph_available"] = False
            status["smart_scraper_graph_error"] = f"{type(exc).__name__}: {exc}"
    except Exception as exc:
        status["scrapegraphai_error"] = f"{type(exc).__name__}: {exc}"

    try:
        import scrapegraph_py  # noqa: F401

        status["scrapegraph_py_installed"] = True
        status["sgai_api_key_present"] = bool(os.environ.get("SGAI_API_KEY"))
    except Exception as exc:
        status["scrapegraph_py_error"] = f"{type(exc).__name__}: {exc}"
    return status


def main() -> None:
    parser = argparse.ArgumentParser(description="Inventory public assets referenced by synapserstudio.com.")
    parser.add_argument("--url", default=DEFAULT_START_URL)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--max-pages", type=int, default=30)
    parser.add_argument(
        "--download",
        action="store_true",
        help="Download discovered assets. Only use this when you have permission to copy the files.",
    )
    args = parser.parse_args()

    manifest = crawl(args.url, args.output_dir, args.max_pages, args.download)
    print(f"Crawled {len(manifest['pages_crawled'])} pages")
    print(f"Found {manifest['asset_count']} assets")
    print(f"Wrote {args.output_dir / 'manifest.json'}")
    if not args.download:
        print("Discovery only. Re-run with --download only if you have permission to copy these assets.")


if __name__ == "__main__":
    main()
