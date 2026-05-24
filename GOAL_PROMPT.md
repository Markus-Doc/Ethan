/goal

Dir: C:\Users\marku\OneDrive\Documents\GitHub\Ethan
Stack: Next.js14, GSAP, Lenis, Three.js, pnpm

READ: CLAUDE.md, BUILD_LOG.md, HANDOVER.md, tokens.css, BookSceneLoader.tsx, Chapter0_Hero.tsx, docs/asset-pipeline/blender-book-asset-generation-instructions.md

SKILLS:
- /blender-storybook-assets before Blender work
- /engineering:debug on breakages
- /engineering:code-review after each phase

STATE:
Phases 0-7 complete. Lighthouse 92. Traversal clean. 7 chapters built. DO NOT REBUILD.

ASSETS:
assets/generations/walker_bookworks_all_frames_opening_turning_closing/ contains 9 lifecycle PNGs.
Active blend file: assets/source/blender/ethan-book-v001.blend

PHASE 8:
pnpm add sharp
Create scripts/build-sequence.mjs:
- Read/sort 9 PNGs
- Output desktop 1280x800 q88 WebP to public/sequences/book-hero/desktop/book_hero_000N.webp
- Output mobile 640x400 q82 WebP to public/sequences/book-hero/mobile/book_hero_000N.webp
- Create manifest.json with frameCount, paths, sections:
rotateReveal,coverOpen,firstPage,pageFlips,backCover,contactHold
with ranges + scrollStart/End 0-1
Add "build:sequence":"node scripts/build-sequence.mjs"
Run it. Desktop total <3MB.

PHASE 9:
Create ScrollSequence.tsx:
- props: manifestPath, scrollProgress, className
- preload all frames with new Image()
- mobile if innerWidth<768
- frameIndex=Math.round(progress*(frameCount-1))
- IMPORTANT: swap imgRef.current.src in rAF only, no React rerenders
- loading pulse bg var(--leather-dark)
- fallback BookSceneLoader on failure

Create useHeroScrollProgress.ts with IntersectionObserver on #chapter-hero.

Replace BookSceneLoader in Chapter0_Hero.tsx with ScrollSequence.
Keep tassel, wordmark, scrollHint.

PHASE 10:
Create SmoothScroll.tsx:
Lenis({lerp:0.08,smoothWheel:true})
gsap.ticker.add(t=>lenis.raf(t*1000))
lagSmoothing(0)
Desktop only.

Wrap layout.tsx main with SmoothScroll.

Ch1 use GSAP ScrollTrigger scrub:1.5 desktop only.
Ch4 horizontal pin+scrub desktop only.
Mobile stays vertical.

PHASE 11:
- Ch0 100svh
- Wordmark Cormorant Garamond 300 italic
- Ch1 cloth-dark→cloth-mid gradient, cover -165deg
- Ch2 drop cap Cormorant 600 italic 3.2em var(--leather)
- Ch3 shadow var(--shadow-leather), hover translateY(-8px)
- Ch5 animated radial-gradient bg, WaxSeal hover rotate+scale
- Ch6 embossed text-shadow, gold footer border
- Global focus-visible 2px solid var(--gold)
- All SVG strokes via CSS vars
- Tap targets >=44px

PHASE 12:
Create DustParticles.tsx:
28 desktop-only spans, 1-3px, var(--leather-pale), opacity .12-.32, random drift 6-14s, aria-hidden, pointer-events:none.
Mount after ScrollSequence.

PHASE 13:
Run:
- pnpm dev
- node scripts/traverse.mjs
- fix until 0 issues at 1440+390
- pnpm build with 0 TS errors
- lighthouse mobile >=88

Add immutable cache headers for /sequences/*
Commit public/sequences/
Append BUILD_LOG.md after every phase.

RULES:
- No Three.js mobile
- No GSAP pin mobile
- No hardcoded hex
- Use tokens.css vars only
- All CTAs via squarespace.ts
- No 390px overflow

DONE WHEN:
WebP sequences + manifest <3MB, rAF scrub works, desktop Lenis/GSAP works, polish complete, build clean, traversal clean, Lighthouse >=88, BUILD_LOG updated.

Begin Phase 8 now. No confirmation. Log blockers to BUILD_LOG.md.