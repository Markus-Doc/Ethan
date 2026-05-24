# HANDOVER.md
# Walker Book Works — Agent Handover Brief
# Working directory: C:\Users\marku\OneDrive\Documents\GitHub\Ethan
# Date: May 2026

---

## WHO YOU ARE AND WHAT YOU ARE DOING

You are a full-stack AI development agent with full permissions in this
repository. You are building an immersive scrollytelling website for
Walker Book Works (walkerbookworks.com.au) — a bespoke book repair,
binding, and workshop studio owned by Ethan Walker in Australia.

Your work is not complete until you have:
1. Built the site
2. Served it locally
3. Opened it in a browser and traversed it as a real user would
4. Fixed everything that is broken, ugly, or below standard
5. Confirmed it meets the MVP definition at the bottom of this file

---

## REPO STATE (what is already here)

```
C:\Users\marku\OneDrive\Documents\GitHub\Ethan\
  agent_build_rules.md      ← technology rulebook, stack decisions, phase order
  custom_binding-1.jpeg     ← THE book photo — primary design source of truth
  FULL_Brief.md             ← full project brief, prerequisites, CLI commands
  Intial_Website_Plan.md    ← scroll sequence, chapter structure, animations
```

Read ALL FOUR files in full before writing a single line of code.
The order to read them: `Intial_Website_Plan.md` → `agent_build_rules.md` → `FULL_Brief.md`
`custom_binding-1.jpeg` is your visual reference — open it and keep it open.

---

## STEP 1 — FIRE THE AGENT (run this in the repo root)

```bash
# Install Claude Code if not present
npm install -g @anthropic-ai/claude-code

# Install pnpm if not present
npm install -g pnpm

# Install all Claude Code design skills before starting
npx skills add https://github.com/emilkowalski/design-skill
npx skills add https://github.com/impeccable-design/skill
npx skills add https://github.com/leonxlnx/taste-skill
npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill

# Launch with full permissions
claude --dangerously-skip-permissions
```

When Claude Code is running, paste the /goal block below as your
first and only message. Do not send anything else first.

---

## STEP 2 — THE /goal PROMPT (paste this entire block)

```
/goal

You are building the Walker Book Works immersive scrollytelling website.
Working directory: C:\Users\marku\OneDrive\Documents\GitHub\Ethan

FIRST ACTION: Read these files completely before doing anything else:
1. Intial_Website_Plan.md
2. agent_build_rules.md
3. FULL_Brief.md
4. Open and study custom_binding-1.jpeg — this is your design bible

CONTEXT SUMMARY (expands on the files above):
- Site: walkerbookworks.com.au — book repair, binding, workshops (Australia)
- Owner: Ethan Walker
- Concept: The entire website IS a book. Users scroll through it like reading.
  The book spins, opens, pages turn, chapters reveal, a tassel swings.
- Visual system: derived entirely from custom_binding-1.jpeg
  Forest green linen cloth boards + cognac pebble-grain leather spine
  and corners + 5 raised spine bands + chamfered corner triangles
- Primary user: mobile phone (390px, touch scroll, mid-range Android)
- Commerce: Squarespace on shop.walkerbookworks.com.au (DO NOT BUILD OR
  TOUCH — just ensure all CTAs link there and the frontend is prepped
  for connection. Use placeholder links for now.)
- Hosting target: Vercel (but local dev server is the MVP gate)

YOUR COMPLETE TASK:

Install everything needed. Build everything needed. Serve it locally.
Open it in a browser. Traverse it as a user. Fix what is broken.
Repeat until MVP is met. You have full permissions. Use them.

---

PHASE 0 — SCAFFOLD + ASSETS
- Run: npx create-next-app@latest . --typescript --app --no-git
  (installs into current directory, TypeScript, App Router)
- Install all dependencies from agent_build_rules.md Section 3
- Create /src/styles/tokens.css with ALL colour tokens from the book photo:
    --leather: #C2813A
    --leather-dark: #8B5A24
    --leather-light: #D9A96E
    --cloth: #2C5040
    --cloth-mid: #3D6B54
    --cloth-light: #4E7D64
    --parchment: #F5EDD8
    --parchment-dark: #E8D9B8
    --ink: #1A1208
    --gold: #C9A84C
- Copy custom_binding-1.jpeg into /public/assets/book-reference.jpg
- Generate texture crops from the book photo programmatically where
  possible using sharp or canvas. If not possible, create high-fidelity
  CSS/SVG approximations of:
    leather-grain texture (cognac, pebble grain)
    cloth texture (dark forest green, fine linen weave)
    endpaper (marbled blue-green-gold)
- Create CLAUDE.md in repo root (see agent_build_rules.md Section 1.2)
- Create BUILD_LOG.md — append one line per phase on completion

PHASE 1 — STATIC BOOK
- Build BookScene.tsx: Three.js canvas, correct proportions from photo,
  leather + cloth textures, warm directional light, 0–15° idle rotation
- Build BookIllustration.tsx: CSS/SVG fallback (MOBILE DEFAULT)
- Build useDeviceCapability hook: returns 'high' | 'mid' | 'low'
  Routes high → Three.js, mid/low → CSS/SVG
- Book proportions: approximately square (the photo shows a thick,
  almost cubic book), spine is convex/rounded, corners are chamfered
  leather triangles, 5 raised horizontal bands on the spine

PHASE 2 — SCROLL ENGINE
- Install and configure Lenis:
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true })
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
- Wire GSAP ScrollTrigger
- Mobile/desktop split via ScrollTrigger.matchMedia:
    ≥768px: pin-based scenes enabled
    <768px: scroll-driven opacity/transform ONLY, no pins

PHASE 3 — COVER OPEN
- The front cover swings open (rotateY 0° → -160°) as user scrolls
- transform-origin: left center
- GSAP scrub: 1.5, pinned on desktop only
- Specular highlight sweeps the hinge crease as it opens
- Reveals: marbled endpaper + italic handwritten quote:
  "Every great book deserves a life well-bound."

PHASE 4 — TASSEL BOOKMARK
- SVG tassel: ribbon + knot + 12-thread bundle + fringe ends
- Physics: pendulum spring (damping 0.92, strength 0.04)
- Responds to scroll velocity — swings on fast scroll, sways on slow
- Idle: Perlin noise micro-drift when scroll is stopped
- Repositions between chapters like a real bookmark
- Must work and look good at 390px width

PHASE 5 — ALL 6 CHAPTERS
Build in this order. Test mobile after each one before proceeding.

Chapter 0 — HERO
  - Book in 3D (desktop) or SVG (mobile), idle rotating
  - Wordmark "Walker Book Works" fades in above
  - Tagline: "Binding. Repair. Craft."
  - Tassel hanging, swaying

Chapter 1 — COVER OPEN
  - Cover swings open (Phase 3 animation)
  - Endpaper revealed with marbled texture
  - Handwritten quote fades in
  - Ambient dust motes (desktop only, three.js particles)

Chapter 2 — ABOUT
  - First page turn (CSS rotateY from bottom-right corner)
  - Right page: heading "The Craft" + placeholder about copy for Ethan
    (bookbinding philosophy, handcraft, restoration)
  - Left page: decorative book-tools illustration (SVG)

Chapter 3 — SERVICES
  - Book stays pinned (desktop) / sticky (mobile)
  - 4 service cards stack onto the right page one by one:
      1. Book Repair — restore damaged, broken, aged books
      2. Book Binding — full custom binding, all materials
      3. Workshops — hands-on bookbinding classes
      4. General Enquiries — bespoke commissions
  - Cards: slight random rotation (±2°), stack like physical cards
  - Hover: card lifts, straightens, leather-shadow appears
  - Each card has a CTA → shop.walkerbookworks.com.au (placeholder)
  - Tassel sweeps between cards

Chapter 4 — PROCESS
  - Horizontal scroll (vertical scroll drives horizontal movement)
  - 4 illustrated pages:
      Assessment · Materials · Structure · Finishing
  - Each page: SVG illustration + step title + 2-line description
  - Illustrations: line-art style, cognac ink on parchment

Chapter 5 — WORKSHOPS
  - Left page: video or animated background (use a CSS cinematic loop
    if no video asset — dark leather texture with subtle motion)
  - Right page: workshop description + dates placeholder
  - CTA button styled as wax seal stamp — dark red, "W" monogram,
    pressed-wax texture via CSS box-shadow
  - CTA links to → shop.walkerbookworks.com.au/workshops (placeholder)

Chapter 6 — CONTACT
  - Book closes (cover swings back shut)
  - Contact details embossed on back cover:
      Walker Book Works
      Info@walkerbookworks.com.au
      0431 339 084
  - The word "Fin." in small italic serif fades in below
  - Footer: minimal, parchment background, ink text

PHASE 6 — MOBILE POLISH PASS
For every chapter:
- Test at 390px — fix any overflow, jank, or layout breaks
- Confirm all tap targets ≥ 44×44px
- Confirm text contrast ≥ 4.5:1 on all colour combinations
- Confirm Three.js never loads on mobile
- Confirm no GSAP pins on mobile
- Run: npx lighthouse http://localhost:3000 --view
  Mobile score must be ≥ 80 before proceeding to Phase 7
  If < 80: fix, re-run, repeat

PHASE 7 — LOCAL HOST + BROWSER TRAVERSAL (MVP GATE)
This is the done condition. Do not skip this.

1. Run the dev server:
   pnpm dev
   Confirm running at http://localhost:3000

2. Open http://localhost:3000 in a headless browser (use Playwright):
   Install: pnpm add -D playwright && npx playwright install chromium

3. Write and run a traversal script (save as scripts/traverse.ts):
   - Navigate to http://localhost:3000
   - Scroll from top to bottom at human speed (simulate touch scroll)
   - Screenshot every chapter section
   - Check for: console errors, layout overflow, broken images,
     invisible text, elements behind each other
   - Log all issues found to TRAVERSE_REPORT.md

4. Read TRAVERSE_REPORT.md
   Fix every issue found
   Re-run the traversal
   Repeat until traversal completes with zero critical issues

5. Run traversal at 390px viewport width (mobile simulation):
   Same process — fix everything, re-run until clean

6. Append to BUILD_LOG.md:
   "PHASE 7 COMPLETE — Traversal passed. Zero critical issues.
    Desktop: ✅ Mobile 390px: ✅ Lighthouse mobile: [score]"

---

HARD RULES — THESE CANNOT BE OVERRIDDEN:
1. No Three.js on mobile — CSS/SVG fallback always
2. No GSAP pin on mobile — scroll-driven opacity/transform only
3. All colours via tokens.css variables — no hardcoded hex
4. All proportions and textures validated against custom_binding-1.jpeg
5. Never touch shop.walkerbookworks.com.au — placeholder links only
6. Run /polish skill after completing each chapter
7. Pull Refero.design references before generating any new UI section
8. Performance budget: Lighthouse mobile ≥ 80, page weight < 1MB initial
9. Typography: Cormorant Garamond (headings) · EB Garamond (body) · Libre Baskerville (labels)
10. The aesthetic is: premium artisan bookbinding — NOT tech startup, NOT SaaS

---

SQUARESPACE READINESS (prep without connecting):
- All CTA buttons link to shop.walkerbookworks.com.au/* (placeholder OK)
- Create /src/config/squarespace.ts:
    export const SQUARESPACE_BASE = 'https://shop.walkerbookworks.com.au'
    export const ROUTES = {
      repair: SQUARESPACE_BASE + '/repair',
      binding: SQUARESPACE_BASE + '/binding',
      workshops: SQUARESPACE_BASE + '/workshops',
      contact: SQUARESPACE_BASE + '/contact',
      enquiry: SQUARESPACE_BASE + '/enquiry'
    }
- All CTAs import from this config file — easy swap when live
- Create /public/robots.txt and /public/sitemap.xml stubs
- Create vercel.json with correct headers and redirect rules

---

MVP DONE CONDITION — /goal is complete when ALL are true:

[ ] pnpm dev runs without errors
[ ] http://localhost:3000 loads in under 3 seconds
[ ] All 6 chapters visible and animated when scrolling
[ ] Book cover opens on scroll
[ ] Tassel swings with physics
[ ] 4 service cards stack correctly
[ ] Horizontal scroll process section works
[ ] Wax seal CTA button present on Workshop chapter
[ ] Book closes on Chapter 6 — contact details visible
[ ] Zero console errors in browser
[ ] Zero horizontal overflow at 390px viewport
[ ] Playwright traversal script passes on desktop viewport
[ ] Playwright traversal script passes on 390px mobile viewport
[ ] Lighthouse mobile score ≥ 80
[ ] BUILD_LOG.md has a completion entry for every phase
[ ] TRAVERSE_REPORT.md exists and shows zero critical issues
[ ] /src/config/squarespace.ts exists with all route placeholders
[ ] vercel.json exists and is deployment-ready
[ ] All colours use tokens.css variables — grep for hardcoded hex,
    find none

PREFERRED (shoot for this, not just MVP):
[ ] Lighthouse mobile score ≥ 90
[ ] Book 3D model is a genuine Three.js mesh, not just a flat card
[ ] Dust particle system on desktop hero
[ ] Page curl animation uses real CSS 3D perspective
[ ] Tassel has individual thread physics on each strand
[ ] Chapter transitions have cinematic crossfade timing
[ ] All SVG illustrations are hand-drawn style, not generic icons

Begin PHASE 0 now. Do not ask for confirmation. Do not stop between
phases unless a BLOCKING error occurs that cannot be self-resolved.
If blocked, write the blocker to BUILD_LOG.md and continue with the
next non-blocked phase.
```

---

## FALLBACK PROMPTS (use if agent stalls or produces wrong output)

**If colours look wrong:**
```
Stop. Open custom_binding-1.jpeg. The leather is warm cognac/tan —
NOT dark brown, NOT orange. The cloth is deep forest green — NOT
emerald, NOT teal, NOT olive. Open tokens.css and re-validate every
variable with an eyedropper against the photo. Fix and continue.
```

**If mobile is janking:**
```
Stop. Mobile has scroll jank. Audit every component:
Remove any GSAP pin on mobile. Replace with scroll-driven opacity.
Remove any Three.js canvas on mobile. Replace with BookIllustration.tsx.
Check will-change is on no more than 2 elements simultaneously.
Rerun Lighthouse mobile. Must be ≥ 80. Fix and continue.
```

**If traversal finds broken chapters:**
```
Stop. TRAVERSE_REPORT.md lists issues. Fix every CRITICAL item first,
then WARNINGS. Re-run scripts/traverse.ts. Repeat until clean. Continue.
```

**If the book looks generic (not like the reference photo):**
```
Stop. The 3D book does not match custom_binding-1.jpeg.
This is a quarter-bound book: leather ONLY on spine and four corner
triangles. Green linen cloth on the boards. Spine is convex/rounded,
not flat. Five raised horizontal bands on the spine. Corners have a
diagonal chamfer cut. Fix geometry and texture mapping. Continue.
```

**If agent runs out of context mid-build:**
```
Read BUILD_LOG.md to find where you stopped.
Read agent_build_rules.md Section 4 for the phase you are on.
Continue from that phase. Do not restart from the beginning.
```

---

## FILE STRUCTURE EXPECTED ON COMPLETION

```
C:\Users\marku\OneDrive\Documents\GitHub\Ethan\
  ├── agent_build_rules.md
  ├── custom_binding-1.jpeg
  ├── FULL_Brief.md
  ├── Intial_Website_Plan.md
  ├── HANDOVER.md                      ← this file
  ├── BUILD_LOG.md                     ← agent writes this
  ├── TRAVERSE_REPORT.md               ← agent writes this
  ├── CLAUDE.md                        ← agent writes this
  ├── vercel.json                      ← agent writes this
  ├── package.json
  ├── next.config.ts
  ├── public/
  │   ├── assets/
  │   │   └── book-reference.jpg
  │   ├── robots.txt
  │   └── sitemap.xml
  └── src/
      ├── app/
      │   ├── layout.tsx
      │   └── page.tsx
      ├── components/
      │   ├── Book/
      │   │   ├── BookScene.tsx
      │   │   ├── BookCover.tsx
      │   │   ├── BookSpine.tsx
      │   │   ├── BookPage.tsx
      │   │   ├── TasselBookmark.tsx
      │   │   ├── BookIllustration.tsx
      │   │   └── DustParticles.tsx
      │   ├── Chapters/
      │   │   ├── Chapter0_Hero.tsx
      │   │   ├── Chapter1_Open.tsx
      │   │   ├── Chapter2_About.tsx
      │   │   ├── Chapter3_Services.tsx
      │   │   ├── Chapter4_Process.tsx
      │   │   ├── Chapter5_Workshops.tsx
      │   │   └── Chapter6_Contact.tsx
      │   └── UI/
      │       ├── WaxSeal.tsx
      │       ├── GoldRule.tsx
      │       └── PageEdge.tsx
      ├── config/
      │   └── squarespace.ts
      ├── hooks/
      │   ├── useScrollScrub.ts
      │   ├── useTasselPhysics.ts
      │   ├── usePageCurl.ts
      │   └── useDeviceCapability.ts
      └── styles/
          ├── tokens.css
          └── book.css
```

---

*End of HANDOVER.md*
*This document is self-contained. The agent requires no other briefing.*
*All technical detail lives in agent_build_rules.md and Intial_Website_Plan.md*