import sharp from 'sharp';
import { readdir, writeFile, mkdir } from 'fs/promises';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const SRC_DIR = join(ROOT, 'assets/generations/walker_bookworks_all_frames_opening_turning_closing');
const DESKTOP_OUT = join(ROOT, 'public/sequences/book-hero/desktop');
const MOBILE_OUT = join(ROOT, 'public/sequences/book-hero/mobile');
const MANIFEST_OUT = join(ROOT, 'public/sequences/book-hero/manifest.json');

await mkdir(DESKTOP_OUT, { recursive: true });
await mkdir(MOBILE_OUT, { recursive: true });

const files = (await readdir(SRC_DIR))
  .filter(f => f.toLowerCase().endsWith('.png'))
  .sort();

console.log(`Found ${files.length} frames:`, files);

const frameCount = files.length;

for (let i = 0; i < files.length; i++) {
  const src = join(SRC_DIR, files[i]);
  const idx = String(i + 1).padStart(4, '0');
  const desktopName = `book_hero_${idx}.webp`;
  const mobileName = `book_hero_${idx}.webp`;

  await sharp(src)
    .resize(1280, 800, { fit: 'cover', position: 'centre' })
    .webp({ quality: 88 })
    .toFile(join(DESKTOP_OUT, desktopName));

  await sharp(src)
    .resize(640, 400, { fit: 'cover', position: 'centre' })
    .webp({ quality: 82 })
    .toFile(join(MOBILE_OUT, mobileName));

  console.log(`  [${i + 1}/${frameCount}] ${files[i]} → desktop + mobile`);
}

// Build manifest with sections mapped across 9 frames
// sections: rotateReveal(0-1), coverOpen(2-3), firstPage(4), pageFlips(5-6), backCover(7), contactHold(8)
const sections = [
  { name: 'rotateReveal', frames: [0, 1], scrollStart: 0,    scrollEnd: 0.15 },
  { name: 'coverOpen',    frames: [2, 3], scrollStart: 0.15, scrollEnd: 0.35 },
  { name: 'firstPage',    frames: [4, 4], scrollStart: 0.35, scrollEnd: 0.50 },
  { name: 'pageFlips',    frames: [5, 6], scrollStart: 0.50, scrollEnd: 0.72 },
  { name: 'backCover',    frames: [7, 7], scrollStart: 0.72, scrollEnd: 0.88 },
  { name: 'contactHold',  frames: [8, 8], scrollStart: 0.88, scrollEnd: 1.00 },
];

const desktopPaths = files.map((_, i) => `/sequences/book-hero/desktop/book_hero_${String(i + 1).padStart(4, '0')}.webp`);
const mobilePaths  = files.map((_, i) => `/sequences/book-hero/mobile/book_hero_${String(i + 1).padStart(4, '0')}.webp`);

const manifest = {
  frameCount,
  desktop: desktopPaths,
  mobile: mobilePaths,
  sections: sections.map(s => ({
    name: s.name,
    frameStart: s.frames[0],
    frameEnd: s.frames[1],
    scrollStart: s.scrollStart,
    scrollEnd: s.scrollEnd,
  })),
};

await writeFile(MANIFEST_OUT, JSON.stringify(manifest, null, 2));
console.log(`\nManifest written → public/sequences/book-hero/manifest.json`);

// Check desktop total size
import { stat } from 'fs/promises';
let totalBytes = 0;
for (let i = 0; i < frameCount; i++) {
  const f = join(DESKTOP_OUT, `book_hero_${String(i + 1).padStart(4, '0')}.webp`);
  const s = await stat(f);
  totalBytes += s.size;
}
const totalMB = (totalBytes / 1024 / 1024).toFixed(2);
console.log(`Desktop total: ${totalMB} MB (budget: <3 MB)`);
if (totalBytes > 3 * 1024 * 1024) {
  console.warn('WARNING: Desktop sequence exceeds 3 MB budget!');
}
