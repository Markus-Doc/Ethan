# CLAUDE.md — Walker Book Works
# Project persistent memory. Read at the start of every session.

## Identity
- Project: Walker Book Works immersive scrollytelling website
- Client: Ethan Walker — book repair, binding, workshops (Australia)
- Domain: walkerbookworks.com.au
- Commerce subdomain: shop.walkerbookworks.com.au (Squarespace — NEVER MODIFY)
- Stack: Next.js 14 · GSAP-ready · Framer Motion · Three.js · Vercel

## The Single Source of Truth
/public/assets/book-reference.jpg is the design bible.
Every colour, texture, proportion, and material must trace to this image.

## Colour Tokens (ALWAYS use CSS variables — NEVER raw hex)
See /src/styles/tokens.css for all values.
Key values:
--leather: #C2813A  --cloth: #2C5040  --parchment: #F5EDD8  --ink: #1A1208  --gold: #C9A84C

## Typography
Headings: Cormorant Garamond (300/400/600 italic)
Body:     EB Garamond (400/500)
Labels:   Libre Baskerville (400)

## Immutable Constraints
1. MOBILE FIRST — 390px is the primary design surface
2. No Three.js on mobile — CSS/SVG fallback in BookIllustration.tsx always
3. No GSAP pin on mobile — scroll-driven opacity/transform only
4. All colours via tokens.css CSS variables only
5. Squarespace subdomain is untouched — never link internally, only via squarespace.ts
6. Performance budget: Lighthouse mobile >= 80
7. All CTA hrefs import from /src/config/squarespace.ts

## File Structure
/src/components/Book/         → 3D book + cover + spine + tassel + CSS fallback
/src/components/Chapters/     → Chapter0 through Chapter6
/src/components/UI/           → WaxSeal, GoldRule, PageEdge
/src/hooks/                   → useScrollScrub, useTasselPhysics, usePageCurl, useDeviceCapability
/src/styles/                  → tokens.css, book.css
/src/config/squarespace.ts    → all external CTA hrefs
/public/assets/               → book-reference.jpg

## Three.js Loading
BookScene.tsx is loaded via dynamic import with ssr:false — never SSR it.
Mobile always gets BookIllustration.tsx (CSS/SVG).
Gate with useIsMobile() from useDeviceCapability.ts.
