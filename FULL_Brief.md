Walker Book Works — Immersive Scrollytelling Website Brief

Site Audit Summary
The live site (walkerbookworks.com.au) is currently a Squarespace password-protected "coming soon" page. Owner: Ethan Walker. Services advertised: book repair, binding, workshops, general enquiries. Contact: Info@walkerbookworks.com.au / 0431 339 084. Launch target: Late June – Early July. The Squarespace infrastructure is paid and live — the goal is to build a custom-coded frontend that wraps over or lives adjacent to it.

The Book — Visual Design System
Looking carefully at the image, this is a classic quarter-bound book with a specific construction that defines the entire design language:
Colour Palette (extracted precisely from the book):
TokenHexUse--leather#C2813APrimary CTA, headings, tassel, spine highlight--leather-dark#8B5A24Hover states, deep shadow, borders--leather-light#D9A96ELeather grain texture overlay, shimmer--cloth#2C5040Background dark sections, nav, footer--cloth-mid#3D6B54Section dividers, card backgrounds--cloth-light#4E7D64Secondary surfaces--parchment#F5EDD8Page/paper backgrounds, body text areas--parchment-dark#E8D9B8Page edge shadows, aged paper feel--ink#1A1208Primary body text--gold#C9A84CGilded detail lines, raised bands, decorative rule
Construction details to animate:

Raised spine bands (5 horizontal ridges on the leather spine)
Diagonal corner leather triangles on all 4 board corners
The spine is slightly convex/rounded — critical for 3D model feel
Cloth boards are a finely woven linen-textured green
The leather has visible pebble grain — use a normal map texture


The Full Scrollytelling Concept
Think of the entire website as a single book being read. The user is not scrolling a website — they are turning through the book. Every section is a chapter. The book itself is the UI.

SCROLL SEQUENCE: Beat-by-Beat
SCENE 0 — The Cover (Page Load, 0 scroll)
The book enters from darkness. It sits in 3D space, slightly angled (the exact perspective from your photo — showing both the front board and the spine simultaneously). A single warm light source from above-left casts shadows in the right-hand corner leather pieces.

The book slowly rotates on its vertical axis (a gentle 0–15° auto-idle rotate, like it's sitting on a velvet surface)
Ambient particles: tiny golden dust motes floating (three.js particle system, very subtle)
Wordmark "Walker Book Works" fades in above in a serif font, letter-spacing wide
Tagline beneath: "Binding. Repair. Craft."
The tassel bookmark hangs from the top of the book, swaying gently with a physics-based pendulum (Matter.js or CSS spring)

js// Auto-idle rotation on hero
gsap.to(book3D.rotation, {
  y: Math.PI * 0.08,
  duration: 4,
  ease: "sine.inOut",
  yoyo: true,
  repeat: -1
})

SCENE 1 — The Opening (Scroll 0–20%)
As the user begins scrolling, the book spins to face front (rotateY to 0°), then the front cover swings open — the left board peels back with a CSS/Three.js perspective transform that reveals the inside cover (deep forest green with a marbled endpaper pattern).

The spine stays in position; only the front board opens
The hinge crease catches light as it opens (specular highlight sweeps across it)
The opening reveals: an aged parchment endpaper with a hand-drawn map-style illustration of the workshop
Overlaid in ink handwriting: "Every great book deserves a life well-bound."

Implementation: CSS perspective + rotateY on a flat card div, OR a Three.js mesh with a bone/joint rig on the cover plane. CSS is simpler and sufficient here.
css.book-cover {
  transform-origin: left center;
  transform: perspective(1200px) rotateY(0deg);
  transition: transform 0s; /* driven by GSAP ScrollTrigger */
}
jsScrollTrigger.create({
  trigger: "#scene-open",
  start: "top top",
  end: "+=800",
  scrub: 1.5,
  onUpdate: (self) => {
    cover.style.transform = 
      `perspective(1200px) rotateY(${-self.progress * 160}deg)`;
  }
})

SCENE 2 — Chapter One: About (Scroll 20–35%)
The first page turns — a CSS page-curl from bottom-right corner, revealing the About section on the "right-hand page." The left-hand page shows a watercolour illustration of hands binding a book.
Page content (right page):

Heading: "The Craft"
Body: Ethan's story — who Walker Book Works is, where they're based, the philosophy of hand-bound books
A worn leather-corner decorative element in the bottom right

Page turn animation:
js// Page curl using pseudo-3D CSS transform
gsap.timeline({
  scrollTrigger: {
    trigger: "#chapter-about",
    start: "top top",
    end: "+=600",
    scrub: true,
    pin: true
  }
})
.to(".page-1-front", { 
  rotateY: -180, 
  transformOrigin: "right center",
  ease: "none" 
})
.from(".page-1-back", { opacity: 0 }, "<")

SCENE 3 — Chapter Two: Services (Scroll 35–60%)
This is the most theatrical section. The book stays pinned and open while four service "cards" appear as if being placed onto the right-hand page, one by one, in sequence — like index cards being laid onto a desk.
Services (from the coming-soon page):

Book Repair — restore damaged, broken, or aged books
Book Binding — full custom binding from materials and cloth to leather
Workshops — hands-on bookbinding classes
General Enquiries — bespoke commissions, unusual projects

Each card slides in from the right at a slight angle, in a slightly imperfect stack (like real cards on a desk), rotated 1–3° randomly. On hover, the card lifts and straightens — a subtle translateY(-8px) rotate(0deg) with a leather-texture drop shadow.
The tassel bookmark moves between cards as each is pinned — it physically sweeps from card to card, its silken thread catching the light.

SCENE 4 — Chapter Three: Process (Scroll 60–75%)
Horizontal scroll chapter — the open book now has pages that scroll left-to-right rather than top-to-bottom, revealing a step-by-step process like illustrated pages in an old manual:

Page 1: Assessment — inspect the damage (illustration: hands examining spine)
Page 2: Materials — leather, cloth, thread, paste (illustration: flat lay of tools)
Page 3: Structure — sewing, pressing, casing-in
Page 4: Finishing — gold tooling, pressing, delivery

Each "page" uses overflow-x: hidden with a scrollLeft driven by vertical scroll progress via GSAP ScrollTrigger's containerAnimation.

SCENE 5 — Chapter Four: Workshops (Scroll 75–85%)
A video panel appears embedded in the left page — treated to look like a moving photograph in an old book, with a slight sepia/warm grade and a torn-paper frame mask. The right page has workshop details, dates, and a CTA button styled as a wax seal stamp (the "W" of Walker Book Works pressed in deep red wax).

SCENE 6 — Chapter Five: Contact (Scroll 85–100%)
The book closes slowly — the cover swings back shut. As it does, the contact details appear to be revealed on the back cover, embossed in the green cloth:
Walker Book Works
Info@walkerbookworks.com.au
0431 339 084
The tassel bookmark hangs from the now-closed book, softly swaying. Below the book, the word "Fin." in italic serif fades in, very small.

THE TASSEL BOOKMARK — Full Animation Detail
This is your signature flourish. The tassel is a CSS/SVG element with a physics simulation:
js// Tassel physics — spring pendulum
class Tassel {
  constructor() {
    this.angle = 0;
    this.angularVelocity = 0;
    this.damping = 0.92;
    this.springStrength = 0.04;
  }
  
  update(scrollVelocity) {
    // Scroll velocity drives the swing force
    const force = scrollVelocity * 0.3;
    this.angularVelocity += (-this.angle * this.springStrength) + force;
    this.angularVelocity *= this.damping;
    this.angle += this.angularVelocity;
    return this.angle;
  }
}
The tassel has four parts:

The ribbon — a 4px wide silk ribbon emerging from the top of the spine
The knot — a small circular div with a radial gradient
The thread bundle — 8–12 individual SVG <line> elements, each offset slightly in a different direction
The fringe ends — each thread has a tiny teardrop cap that catches light

On rapid scroll, the tassel swings wide. On slow scroll, it sways gently. When stationary, it hangs perfectly still with only micro-drift from a Perlin noise idle animation.

SQUARESPACE INTEGRATION STRATEGY
This is the most important technical constraint. The client has paid for Squarespace — that infrastructure must be respected and preserved.
Recommended approach: Custom Domain + Subdomain Split
walkerbookworks.com.au          → Custom React/Next.js frontend (this scrollytelling site)
shop.walkerbookworks.com.au     → Squarespace (products, booking, checkout, payments)
The scrollytelling homepage CTAs (e.g. "Book a Workshop", "Commission a Binding") link through to the Squarespace subdomain for transactions. This keeps Squarespace as the commerce and admin layer while giving complete creative freedom on the front.
Alternative: Squarespace Code Injection (simpler, more limited)
If keeping everything on one domain is required, Squarespace's </head> code injection can load a React bundle and a custom CSS overlay. This is more constrained but avoids subdomain confusion. The Squarespace pages become hidden utility pages; the injected JS renders the immersive experience on top. This approach works but you lose GSAP pin behaviour on mobile due to Squarespace's scroll container wrapper.
Recommended choice: subdomain split. It is cleaner, more performant, and Ethan already has Squarespace paid — nothing changes for him on the commerce side.

TECH STACK
Frontend Framework:   Next.js 14 (App Router)
3D Engine:            Three.js + @react-three/fiber + @react-three/drei
Scroll Engine:        GSAP + ScrollTrigger (the industry standard for this)
Micro-animations:     Framer Motion (entrance, hover, card interactions)
Physics:              Custom spring/pendulum for tassel (no library needed)
Page Curl:            CSS 3D transforms driven by GSAP scrub
Textures:             Real leather + cloth image maps (extract from the photo)
Shaders:              ShaderGradient (ruucm/shadergradient) for cinematic bg
Fonts:                Cormorant Garamond (headings) + EB Garamond (body) — both free, Google Fonts
Hosting:              Vercel (frontend) + Squarespace (commerce)

FILE/COMPONENT ARCHITECTURE
/src
  /components
    /Book
      BookScene.tsx         ← Three.js canvas, 3D book model, camera
      BookCover.tsx         ← Cover open/close animation rig
      BookSpine.tsx         ← Spine detail, raised bands, leather grain
      BookPage.tsx          ← Individual page component with curl
      TasselBookmark.tsx    ← Physics tassel, all 4 parts
      DustParticles.tsx     ← Ambient gold dust motes
    /Chapters
      Chapter0_Hero.tsx     ← Spinning book, title, idle state
      Chapter1_Open.tsx     ← Cover reveal, endpaper, handwriting
      Chapter2_About.tsx    ← First page turn, about content
      Chapter3_Services.tsx ← Pinned book, service cards stacking
      Chapter4_Process.tsx  ← Horizontal scroll process pages
      Chapter5_Workshops.tsx← Video panel, wax seal CTA
      Chapter6_Contact.tsx  ← Book closes, back cover contact
    /UI
      WaxSeal.tsx           ← SVG wax stamp button component
      GoldRule.tsx          ← Decorative horizontal divider
      PageEdge.tsx          ← Aged paper edge texture component
  /hooks
    useScrollScrub.ts       ← GSAP ScrollTrigger wrapper
    useTasselPhysics.ts     ← Pendulum spring physics hook
    usePageCurl.ts          ← Page turn state machine
  /assets
    /textures
      leather-grain.jpg     ← Extracted from your book photo
      cloth-weave.jpg       ← Green cloth texture
      parchment.jpg         ← Aged paper background
      endpaper-marble.jpg   ← Marbled inside cover
  /styles
    tokens.css              ← All colour/font tokens
    book.css                ← Book-specific 3D CSS rules

TYPOGRAPHY
css/* Heading — classic letterpress feel */
font-family: 'Cormorant Garamond', serif;
font-weight: 300;
letter-spacing: 0.08em;
color: var(--leather);

/* Body — warm, readable, old printing press */
font-family: 'EB Garamond', serif;
font-size: 1.125rem;
line-height: 1.75;
color: var(--ink);

/* Labels / Nav / Captions */
font-family: 'Libre Baskerville', serif;
font-size: 0.75rem;
letter-spacing: 0.2em;
text-transform: uppercase;
color: var(--cloth);

IMMEDIATE NEXT STEPS (Ordered)

Extract and clean the book textures — run the book photo through an AI upscaler (Magnific or Topaz), then crop individual patches of leather grain and green cloth to use as Three.js texture maps
Build the static book in Three.js — a flat-shaded box geometry with the correct proportions, then map the extracted textures. Get the idle rotation working first before any scroll logic
Install Claude Code skills (from your saved videos): Emil Kowalski's motion skill + Impeccable Design skill — these ensure all easing and spacing are correct from the start
Wire GSAP ScrollTrigger to the cover-open animation first — this is the hero moment that sells the whole concept
Build the tassel component in isolation — it's the detail that makes people gasp and share
Set up the Squarespace subdomain — this unblocks Ethan's commerce needs independently of the frontend build
Add Framer Motion to all cards and page-content entrance animations last — polish layer only once structure works


The entire concept is unified by one metaphor: you are not browsing a website, you are reading Ethan's book. Every interaction — the creak of the cover, the flutter of a page, the swing of the tassel — communicates the same thing his physical craft communicates: that books are alive, tactile, and worth caring for.Your last response is now saved in the root directory as "initial_website_plan.md"I will upload that image of the custom book in the projects /assets/ folder in this root too
But: Quick note, I am concerned about:Very accurate to the single example image of the book we have; extrapolating that out into the assets we need for this type of website while preserving accuracy.CRITICAL: Mobile browsing cross compatibility. The assumption that main traffic is from phones is baked in from the start.Acknowledge this for this session.Next: I want to entertain the idea of instructing an agent with  control of my live Instagram browser session to view the top selections of AI web design AND AI design agent skills/tools/harness/frameworks that I should employ here 
-- <reasoning> Instagram continues to be a secret source of cutting edge information IF you can find it..1 step1 stepAcknowledged — Two Critical Constraints Locked In
1. Book Image Accuracy
The single photo is the source of truth. Everything extrapolated from it — textures, colours, proportions, construction details — must trace back faithfully to that specific object. No generic "leather book" assets. The green is that specific forest-teal linen cloth. The leather is that specific warm cognac pebble-grain. The spine bands, the corner chamfer angle, the slight convexity of the spine — all must be derived from the one image we have. Any asset generation (texture crops, AI upscaling, normal maps, 3D model proportions) is validated against the photo before it ships.
2. Mobile-First is the Default Reality
This is not a "desktop site that also works on mobile." It is a mobile experience that optionally enhances on desktop. Every scroll animation, pinned section, 3D element, and tassel physics simulation is designed for a 390px viewport and touch-scroll first. GSAP ScrollTrigger has known friction with mobile scroll containers (especially inside Squarespace's wrapper), Three.js has GPU budget constraints on mid-range Android phones, and CSS perspective transforms can trigger compositor jank on iOS Safari. All of these are flagged constraints, not afterthoughts. The 3D book on desktop may become a high-fidelity CSS/SVG illustration on mobile — same drama, zero GPU cost.
Both constraints are baked into every decision from this point forward.

On the Instagram Research Idea
This is genuinely smart — Instagram's algorithm surfaces practitioner-level content (not blog-post-level) that often predates any written documentation by weeks. The saved collection you already have proves the signal is real.
However, I want to be transparent about one practical note before we go: Instagram's search for non-hashtag conceptual queries (like "AI design agent framework") is weaker than its hashtag and creator-follow graph. The best results will come from searching specific hashtags and known creator handles rather than freeform queries.
My suggested search targets for your live session:
Hashtags to sweep:
#vibecoding #claudecode #aiwebdesign #gsap #scrolltelling #threejs #framermotion #webanimation #uidesign #aiagent
Creator handles already in your orbit (from your saved collection) to check their full profiles for related posts: neuwebstudio, nateherkai, fifbuilds, santiago.dreams, valeridoesai
New creators worth finding: anyone posting Three.js + mobile workflows, GSAP ScrollTrigger tutorials, or AI-to-code pipeline demos.
Ready to execute — navigate me to your Instagram search and I'll start sweeping. Should I begin with the hashtag approach or jump straight to the explore/search tab?You now have full permissions of t he current browser session pre-authed to me with the search open. Proceed to use logic like the /goal feature to create perferm this task. ## Goal - you will provide a .md instructions file  that an agent would accuratley be able to use as rules  to effectively pick the top tools/stack/technologies/skills/repos/etc to ROADMAP the complete build path to this site.53 steps53 stepsHere is the complete agent-ready .md file. Save this as agent_build_rules.md in your root directory alongside initial_website_plan.md.

markdown# agent_build_rules.md
# Walker Book Works — Agent Build Rules & Technology Roadmap
# Version: 1.0 | Researched: May 2026 | Source: Instagram intelligence sweep + initial_website_plan.md

---

## AGENT DIRECTIVE

You are building an immersive scrollytelling website for Walker Book Works
(walkerbookworks.com.au) — a bespoke book repair, binding, and workshop
studio run by Ethan Walker in Australia.

You have ONE primary visual asset: a photograph of a hand-crafted
quarter-bound book (forest green linen boards, cognac/tan pebble-grain
leather spine and corner pieces, 5 raised spine bands). Every design
decision must trace back to this image. If you cannot justify a colour,
texture, or proportion from the book photo, do not use it.

Read `initial_website_plan.md` for the full scroll sequence, chapter
structure, colour tokens, and animation beat-sheet. This file governs
HOW you pick and use the technology to execute that plan.

---

## CONSTRAINT 0 — IMMUTABLE RULES (read before everything else)

These two constraints override all other decisions. If any tool,
library, effect, or technique conflicts with either constraint, you
REJECT it and find an alternative.

### C0.1 — MOBILE-FIRST IS THE DEFAULT REALITY
- Design target: 390px viewport, touch-scroll, 60fps on mid-range Android
- Desktop is an enhancement layer, not the primary design surface
- Every animation is budgeted for mobile GPU first
- Three.js / WebGL scenes must have a CSS/SVG fallback for mobile
- GSAP ScrollTrigger `pin: true` is DISABLED on mobile by default
  (use `pin: false` + scroll-driven opacity/transform instead)
- No parallax effects that trigger jank on iOS Safari scroll momentum
- Test benchmark: Samsung Galaxy A-series (mid-range), iOS Safari 17
- Performance budget: < 3s first contentful paint on 4G, < 100kb
  critical CSS+JS, < 200kb total above-the-fold

### C0.2 — BOOK IMAGE ACCURACY IS NON-NEGOTIABLE
- Colour palette is extracted ONLY from the provided book photograph
- Do not use generic "leather brown" or "forest green" approximations
- The exact hex values in initial_website_plan.md are the law
- All 3D model proportions must match the book's actual aspect ratio
  (approx. 1:1 square-ish, thick spine, bevelled corners)
- Textures must be derived from or faithful to the actual photo:
  cognac pebble-grain leather, fine-weave linen cloth, 5 raised bands
- Any asset generated by AI (image, texture, SVG) must be reviewed
  against the reference photo before it is committed

---

## CONSTRAINT 1 — SQUARESPACE INTEGRATION RULES

The client has a paid Squarespace plan. This cannot be replaced.

### Architecture Decision (MANDATORY)
Use the SUBDOMAIN SPLIT architecture:

  walkerbookworks.com.au       → Custom Next.js frontend (this build)
  shop.walkerbookworks.com.au  → Squarespace (products, booking, payments)

DO NOT attempt to inject a full React app into Squarespace via code
injection. The Squarespace scroll container wrapper breaks GSAP pin
behaviour on mobile and limits z-index stacking. The subdomain split
is the clean boundary.

### Squarespace Rules
- Never modify the Squarespace site structure or settings
- All CTAs on the custom frontend link to the Squarespace subdomain
- Squarespace handles: product listings, workshop bookings, contact
  forms, payment processing, Ethan's admin dashboard
- The custom frontend handles: brand experience, discovery, trust-building
- DNS: point root domain to Vercel, subdomain to Squarespace

---

## SECTION 1 — AGENT HARNESS (Claude Code Setup)

Source: codewithbrij (Instagram), santiago.dreams (Instagram)

### 1.1 — Claude Code 4-Layer System (MANDATORY SETUP)

Before writing a single line of project code, configure Claude Code
with all four layers. Missing any layer means ~70% capability loss.
Layer 1: CLAUDE.md        → project persistent memory + rules
Layer 2: Skills           → knowledge packs (auto-invoke on trigger)
Layer 3: Hooks            → 100% enforced safety gates
Layer 4: Agents           → subagents with own context windows

**Day 1 Setup Sequence:**
```bash
# 1. Initialise project
claude /init

# 2. Install design skills (in order)
npx skills add https://github.com/emilkowalski/design-skill
# → Teaches proper easing, motion curves, animation timing
# → Prevents robotic linear animations
# → Critical for the tassel physics and page-turn feel

npx skills add https://github.com/impeccable-design/skill
# → 20+ design commands: typography, contrast, spacing, layout
# → Run /polish after every section to auto-fix visual debt
# → Prevents the "AI-generated flat" look

npx skills add https://github.com/leonxlnx/taste-skill
# → When prompted, SELECT ONLY these sub-skills:
#   ✅ High-end Visual Design
#   ✅ Design Taste Front-end
#   ✅ Minimalist UI
#   ❌ Skip all others (out of scope)

npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
# → Clean layout rules for Claude
# → Used by valeridoesai to generate $10K-quality sites
```

### 1.2 — CLAUDE.md Required Contents

Your CLAUDE.md MUST include all of the following sections.
Claude Code skips ~30% of CLAUDE.md instructions — use Hooks for
anything that is truly non-negotiable (see 1.3).

```markdown
# CLAUDE.md — Walker Book Works

## Project Identity
- Site: walkerbookworks.com.au
- Owner: Ethan Walker (book repair, binding, workshops — Australia)
- This is an immersive scrollytelling experience, not a standard site
- The book photo in /assets/ is the single source of design truth

## Non-Negotiable Design Rules
- Colour palette: use ONLY tokens from /src/styles/tokens.css
- No generic stock textures — all textures derived from book photo
- All animations must feel like physical paper, leather, cloth — not digital
- Mobile-first: every component designed for 390px before 1440px

## Architecture
- Frontend: Next.js 14 App Router on Vercel
- Commerce: Squarespace on shop.walkerbookworks.com.au (DO NOT TOUCH)
- No components that require Squarespace code injection

## Scroll Engine Rules
- Use GSAP ScrollTrigger for all scrub animations
- Use Framer Motion for entrance + hover micro-interactions
- Pin sections: desktop only (disable on mobile via matchMedia)
- Page curl: CSS 3D transforms driven by GSAP (not canvas)

## Performance Budget
- Mobile FCP < 3 seconds on 4G
- Three.js scenes: fallback to CSS illustration on mobile
- No autoplay video above the fold on mobile
- Lazy-load all textures below the fold

## Book Accuracy Checklist (run before committing any visual)
- [ ] Colour matches tokens.css (no hardcoded hex)
- [ ] Proportions match reference photo aspect ratio
- [ ] Texture grain direction matches photo
- [ ] Leather = cognac pebble grain (not smooth, not dark brown)
- [ ] Cloth = fine weave, dark forest green (not emerald, not olive)
```

### 1.3 — Hooks Configuration (settings.json)

Hooks are 100% enforced. Use them for rules that CANNOT drift.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [{
          "type": "command",
          "command": "echo 'COLOUR CHECK: Only tokens.css values permitted'"
        }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [{
          "type": "command",
          "command": "node scripts/validate-tokens.js"
        }]
      }
    ]
  }
}
```

### 1.4 — MCP vs CLI Decision

Source: agentic.james (Instagram)

**Rule: Use CLI tools over MCP servers wherever possible.**
- MCP servers consume context window and add latency
- CLI tools execute faster and leave more context for actual work
- Only use an MCP if no CLI equivalent exists for the task
- For this project: no MCPs required in the base stack

**Exception:** Higgsfield MCP is permitted ONLY for generating
scroll animation video frames as source material.
Source: ibraviz.ai (Instagram) — built scroll animation in 30min
using Higgsfield MCP + Claude Code with no animation library.

---

## SECTION 2 — CORE TECHNOLOGY STACK

### 2.1 — Decision Matrix

Every tool was evaluated against three criteria:
  A = Mobile-first compatible (no jank, degrades gracefully)
  B = Serves the book/scrollytelling use case directly
  C = Instagram community validation (actively used by practitioners)

| Tool | A | B | C | Decision |
|------|---|---|---|----------|
| Next.js 14 App Router | ✅ | ✅ | ✅ | INCLUDE |
| GSAP + ScrollTrigger | ✅* | ✅ | ✅ | INCLUDE (pin: mobile-off) |
| Framer Motion | ✅ | ✅ | ✅ | INCLUDE |
| Three.js / R3F | ⚠️ | ✅ | ✅ | INCLUDE with CSS fallback |
| ShaderGradient | ✅ | ✅ | ✅ | INCLUDE |
| liquid-glass-js | ⚠️ | ✅ | ✅ | DESKTOP ONLY |
| react-three-fiber | ⚠️ | ✅ | ✅ | INCLUDE with fallback |
| Framer (no-code) | ✅ | ❌ | ✅ | EXCLUDE (custom code needed) |
| Webflow | ✅ | ❌ | ✅ | EXCLUDE (conflicts Squarespace) |
| Runable | ✅ | ❌ | ✅ | EXCLUDE (not enough control) |
| Durable | ✅ | ❌ | ❌ | EXCLUDE |
| Higgsfield MCP | ⚠️ | ✅ | ✅ | ASSET GENERATION ONLY |
| 21st.dev | ✅ | ✅ | ✅ | INCLUDE (component source) |
| Refero.design | N/A | ✅ | ✅ | INCLUDE (design reference tool) |
| html-in-canvas | ❌ | ⚠️ | ✅ | EXCLUDE (experimental, mobile risk) |
| Vercel | ✅ | ✅ | ✅ | INCLUDE (hosting) |

*GSAP ScrollTrigger: desktop pin enabled, mobile pin disabled via
`ScrollTrigger.matchMedia()`

### 2.2 — Final Stack Declaration
PRODUCTION STACK
Framework:        Next.js 14 (App Router, RSC where applicable)
Hosting:          Vercel (root domain, automatic CI/CD from GitHub)
Commerce:         Squarespace (subdomain, untouched)
ANIMATION ENGINES
Scroll-driven:    GSAP 3 + ScrollTrigger (scrub, timelines, snap)
Micro-animation:  Framer Motion (entrance, hover, tap, spring)
Page physics:     Custom hook (useTasselPhysics — pendulum spring, no lib)
3D / VISUAL EFFECTS
3D engine:        Three.js via @react-three/fiber
3D helpers:       @react-three/drei (OrbitControls, useTexture, etc.)
Post-processing:  @react-three/postprocessing (bloom, DoF, chromatic)
Gradients:        shadergradient (github.com/ruucm/shadergradient)
Liquid effects:   liquid-logo (github.com/paper-design/liquid-logo)
liquid-glass-js (DESKTOP ONLY)
COMPONENT SOURCING
UI components:    21st.dev (hero sections, cards, layout primitives)
Design refs:      refero.design (pull before generating any new UI page)
TYPOGRAPHY (Google Fonts — free, no licensing risk)
Display/headings: Cormorant Garamond (300, 400, 600 italic)
Body:             EB Garamond (400, 500)
Labels/UI:        Libre Baskerville (400, small caps)
AI AGENT HARNESS
Code agent:       Claude Code (4-layer: CLAUDE.md + Skills + Hooks + Agents)
Skills installed: emilkowalski/design-skill
impeccable-design/skill
leonxlnx/taste-skill (High-end Visual + Design Taste + Minimalist)
nextlevelbuilder/ui-ux-pro-max-skill
Asset generation: Higgsfield MCP (scroll animation frames only)
Design validation: Refero.design (before every new page/section)
DEVELOPMENT TOOLING
Version control:  Git + GitHub
Package manager:  pnpm (faster than npm, better for monorepos)
Linting:          ESLint + Prettier
CSS approach:     CSS Modules + global tokens.css (no Tailwind — conflicts with
fine-grained animation token control)

---

## SECTION 3 — GITHUB REPOS (install in order)

```bash
# Core framework
npx create-next-app@latest walker-book-works --typescript --app

# Animation
pnpm add gsap @gsap/react
pnpm add framer-motion

# 3D
pnpm add three @react-three/fiber @react-three/drei
pnpm add @react-three/postprocessing

# Shader/visual effects
pnpm add shadergradient
pnpm add @paper-design/liquid-logo

# Utility
pnpm add lenis          # smooth scroll — mobile-safe, replaces locomotive
pnpm add @studio-freight/lenis  # (if lenis v2 API differs)

# Dev
pnpm add -D @types/three
```

**GitHub repos to clone/reference (do not npm install these — use as
texture/asset sources and code reference only):**
github.com/ruucm/shadergradient          → Cinematic bg gradients
github.com/paper-design/liquid-logo      → Liquid logo reveal
github.com/dashersw/liquid-glass-js      → Glass morphing (desktop)
github.com/pmndrs/react-three-fiber      → 3D canvas in React
github.com/fimbox/html-in-canvas         → REFERENCE ONLY (experimental)
github.com/leonxlnx/taste-skill          → Claude design skill
github.com/nextlevelbuilder/ui-ux-pro-max-skill → Claude layout skill

---

## SECTION 4 — BUILD SEQUENCE (Ordered Phases)

The agent must execute phases IN ORDER. Do not skip ahead.
Each phase has a DONE CONDITION that must be met before proceeding.

### PHASE 0 — Asset Extraction (Before any code)

**Goal:** Derive all visual assets from the book photo with maximum fidelity.

Steps:
1. Upscale book photo using Magnific AI or Topaz Gigapixel (4x minimum)
2. Crop these exact regions as separate files into `/assets/textures/`:
   - `leather-grain.jpg`     → spine + corner close-up crop
   - `cloth-weave.jpg`       → front board centre crop
   - `spine-bands.jpg`       → spine profile showing the 5 raised ribs
   - `corner-detail.jpg`     → one corner showing chamfer angle
3. Run each crop through a normal map generator
   (NormalMap Online: cpetry.github.io/NormalMap-Online/) → save as
   `leather-normal.jpg`, `cloth-normal.jpg`
4. Extract hex values from photo using eyedropper on the upscaled image
   and confirm they match tokens.css within ±5 lightness points
5. Write `/src/styles/tokens.css` with ALL colour + spacing + font tokens
   BEFORE any component is written

**DONE CONDITION:** All texture files in /assets/textures/, tokens.css
written, all hex values validated against the reference photo.

---

### PHASE 1 — Static Book Model (No scroll yet)

**Goal:** A correct 3D book sitting in a scene, idle rotation only.

Steps:
1. Create `BookScene.tsx` — Three.js canvas with:
   - Correct book proportions from reference photo
   - Leather grain texture mapped to spine + corner pieces
   - Cloth texture mapped to front and back boards
   - Single warm directional light (upper-left, warm colour temp)
   - Ambient occlusion in the corner recesses
   - Idle auto-rotate: 0–15° Y-axis, sine.inOut, 4s, yoyo repeat
2. CSS fallback `BookIllustration.tsx` — SVG flat representation of
   the book (same colours, same proportions, no 3D required)
   This is the mobile default.
3. Implement `useDeviceCapability` hook:
```typescript
   // Returns 'high' | 'mid' | 'low' based on:
   // - navigator.hardwareConcurrency
   // - deviceMemory
   // - connection.effectiveType
   // - window.innerWidth
```
   High → Three.js scene
   Mid/Low → CSS/SVG illustration

**DONE CONDITION:** Book renders correctly in both 3D and SVG modes.
Texture matches reference photo. Idle rotation is smooth. Zero console
errors on mobile Safari.

---

### PHASE 2 — Scroll Engine Wiring

**Goal:** GSAP ScrollTrigger wired to the canvas scene, Lenis smooth
scroll installed, mobile/desktop modes confirmed.

Steps:
1. Install and configure Lenis (replaces native scroll, mobile-safe):
```typescript
   // In layout.tsx
   const lenis = new Lenis({ lerp: 0.08, smoothWheel: true })
   // Connect to GSAP ticker
   gsap.ticker.add((time) => lenis.raf(time * 1000))
   gsap.ticker.lagSmoothing(0)
```
2. Create `useScrollScrub.ts` hook wrapping ScrollTrigger
3. Implement desktop/mobile ScrollTrigger split:
```typescript
   ScrollTrigger.matchMedia({
     "(min-width: 768px)": function() {
       // Pin-based scenes — desktop only
       createPinnedSections()
     },
     "(max-width: 767px)": function() {
       // Scroll-driven opacity/transform only — no pins
       createMobileScrollScene()
     }
   })
```

**DONE CONDITION:** Lenis scroll feels silky. ScrollTrigger fires
correctly at test breakpoints. Mobile has zero layout shift from pins.

---

### PHASE 3 — Cover Open Animation (Hero moment)

**Goal:** The book cover swings open on scroll. This is the single most
important animation — get it right before building anything else.

Steps:
1. CSS 3D transform approach (preferred over Three.js mesh bone):
```css
   .book-cover {
     transform-origin: left center;
     will-change: transform;
     backface-visibility: hidden;
   }
```
2. GSAP ScrollTrigger drives the rotateY from 0° to -160°:
```typescript
   gsap.to(".book-cover", {
     rotateY: -160,
     ease: "none",
     scrollTrigger: {
       trigger: "#hero-section",
       start: "top top",
       end: "+=800",
       scrub: 1.5,
       // pin: true  ← DESKTOP ONLY
     }
   })
```
3. Specular highlight sweeps across the hinge as it opens:
   Use a CSS radial gradient that translates across the cover
   in sync with the rotation value
4. Endpaper reveal: inside cover shows marbled parchment with
   handwritten-style quote (CSS `font-family: 'Caveat', cursive` or
   SVG path text)

**DONE CONDITION:** Cover opens smoothly on desktop with pin. On mobile,
cover fades in with a 30° tilt (no full pin, no jank). The hinge
highlight fires correctly.

---

### PHASE 4 — Tassel Bookmark (Signature detail)

**Goal:** Physics-accurate tassel that responds to scroll velocity.

Steps:
1. Build `useTasselPhysics.ts`:
```typescript
   class TasselSpring {
     angle = 0
     velocity = 0
     damping = 0.92
     strength = 0.04
     
     tick(scrollDelta: number) {
       const force = scrollDelta * 0.25
       this.velocity += (-this.angle * this.strength) + force
       this.velocity *= this.damping
       this.angle += this.velocity
       return this.angle
     }
   }
```
2. `TasselBookmark.tsx` SVG structure:
   - Ribbon (4px CSS line with silk gradient)
   - Knot (SVG circle with radial gradient)
   - Thread bundle (12 SVG lines, each offset 0–3px randomly)
   - Fringe ends (tiny SVG teardrops)
3. Idle micro-drift: Perlin noise applied to angle when scrollDelta ≈ 0
4. Tassel moves between chapters as bookmark (re-positions on section change)

**DONE CONDITION:** Tassel swings naturally on fast scroll, sways on
slow scroll, hangs still with micro-drift at rest. No library required.
Renders correctly at 390px mobile width.

---

### PHASE 5 — Chapter Assembly

Assemble chapters IN ORDER using `initial_website_plan.md` as the
content and beat reference. For each chapter:

1. Pull component starting points from 21st.dev
2. Run /polish skill after building each chapter
3. Cross-reference Refero.design for any UI pattern you're unsure about
4. Validate all colours against tokens.css (Hooks will enforce this)
5. Test on mobile after EACH chapter before proceeding

Chapter order:
  Chapter 0: Hero (book idle + title)
  Chapter 1: Cover Open (endpaper reveal)
  Chapter 2: About (first page turn + about content)
  Chapter 3: Services (pinned book + stacking cards)
  Chapter 4: Process (horizontal scroll pages)
  Chapter 5: Workshops (video panel + wax seal CTA)
  Chapter 6: Contact (book closes + back cover)

---

### PHASE 6 — Mobile Polish Pass

**This phase is NOT optional and NOT a "nice to have".**

For each chapter:
1. Test on 390px viewport in Chrome DevTools mobile emulation
2. Test on actual Safari iOS (use BrowserStack if no physical device)
3. For any Three.js scene: confirm CSS/SVG fallback renders correctly
4. Check: no horizontal scroll overflow
5. Check: tap targets ≥ 44×44px (WCAG 2.5.5)
6. Check: text contrast ratio ≥ 4.5:1 (WCAG 1.4.3) — leather on
   parchment background must be tested specifically
7. Run Lighthouse mobile audit — score must be ≥ 85 performance
8. Fix all issues before proceeding to Phase 7

---

### PHASE 7 — Squarespace Handoff

Steps:
1. Configure Vercel project for root domain
2. Set up Squarespace on shop subdomain
3. Audit all CTA links point to shop.walkerbookworks.com.au
4. Test full purchase flow on Squarespace subdomain independently
5. Set up Vercel Analytics (free tier) for traffic monitoring
6. Write a `HANDOFF.md` for Ethan explaining:
   - How to update Squarespace (normal, unchanged)
   - How to update site copy (which files to edit)
   - Contact for frontend changes

---

## SECTION 5 — DESIGN REFERENCE WORKFLOW

Before generating ANY new page, section, or component:

1. Open refero.design
2. Search for the most similar existing high-end site pattern
3. Screenshot 2–3 references
4. Include them in your Claude Code context window with the prompt:
   "Build [component] with this visual quality and interaction density.
   Apply Walker Book Works colour tokens and typography. Book-craft
   aesthetic, not tech startup aesthetic."

This eliminates the generic AI-generated look.
Source: gannon.meyer (Instagram) — confirmed by santiago.dreams

---

## SECTION 6 — PERFORMANCE RULES (Mobile Contract)

These are enforced behaviours, not suggestions:
RULE P1: No Three.js on mobile. Use CSS/SVG fallback always.
RULE P2: No autoplay video above the fold on mobile.
RULE P3: All images: next/image with WebP, lazy below fold.
RULE P4: No GSAP pin on mobile. Scroll-driven opacity/transform only.
RULE P5: Lenis lerp value: 0.08 desktop, 0 (native) on mobile.
RULE P6: Font loading: font-display: swap on all Google Fonts.
RULE P7: Texture files: compress to < 200kb each (WebP format).
RULE P8: Code-split Three.js: dynamic import with Suspense boundary.
RULE P9: Total page weight: < 1MB on initial load (deferred content excluded).
RULE P10: Scroll listener debounce: 16ms (one frame) minimum.

---

## SECTION 7 — WHAT TO EXCLUDE (and why)

| Tool | Why Excluded |
|------|-------------|
| Locomotive Scroll | Replaced by Lenis (lighter, better GSAP integration) |
| Webflow | Cannot coexist cleanly with Squarespace on same domain |
| Framer (no-code) | Insufficient control for custom book physics |
| Runable | Good for fast prototypes, not production custom builds |
| Durable | Fully automated, no custom code — wrong tool entirely |
| html-in-canvas | Experimental Chrome API, breaks on Firefox/Safari/mobile |
| MCP servers (general) | Consume context window; CLI tools preferred (agentic.james) |
| Tailwind CSS | Conflicts with fine-grained animation token system |
| Bootstrap / MUI | Wrong aesthetic register for handcraft bookbinding site |
| Any SaaS website builder | Client paid for Squarespace — no parallel SaaS tools |

---

## SECTION 8 — CREATOR INTELLIGENCE SOURCES

These Instagram accounts are active practitioners whose content
informed this document. Follow for ongoing updates:

| Creator | Handle | Expertise |
|---------|--------|-----------|
| Neu Web Studio | @neuwebstudio | Cinematic web animation, Figma |
| Serena TC | @serenainux | GSAP + Claude Code scroll builds |
| Seb Intel | @sebintel | 3D scroll sites, Claude + Framer Motion |
| Ibra AI | @ibraviz.ai | Higgsfield MCP + Claude Code animations |
| CodeWithBrij | @codewithbrij | Claude Code 4-layer architecture |
| Santiago Dreams | @santiago.dreams | Claude Code design skills |
| Viktor Oddy | @viktoroddy | Animated AI hero sections |
| Agentic James | @agentic.james | CLI > MCP insight, agent architecture |
| DesignByShiv | @designbyshiv._ | Awwwards-level animation patterns |
| Marc Kaz | @marc.kaz | WebGL / Three.js experimental |
| FifBuilds | @fifbuilds | GitHub design asset repos |
| Valeridoesai | @valeridoesai | Stack: Claude + 21st.dev + Framer Motion |

---

## SECTION 9 — DONE DEFINITION

The build is DONE when ALL of the following are true:

- [ ] Book 3D model matches reference photo proportions and textures
- [ ] Cover opens on scroll — desktop pin, mobile fade
- [ ] Tassel physics work on both mobile and desktop
- [ ] All 6 chapters render and animate correctly
- [ ] All CTA links route to Squarespace subdomain
- [ ] Lighthouse mobile performance score ≥ 85
- [ ] Zero horizontal scroll overflow on 390px viewport
- [ ] All text contrast ratios pass WCAG AA
- [ ] No console errors on iOS Safari
- [ ] HANDOFF.md written and reviewed by Ethan
- [ ] DNS configured: root → Vercel, shop → Squarespace
- [ ] Soft launch password removed from Squarespace (Ethan's action)

---

*End of agent_build_rules.md*
*Cross-reference: initial_website_plan.md, /assets/book-reference.jpg*

That's the complete rules file. The key additions beyond the initial plan that came directly from the Instagram research sweep are: the CLI over MCP performance rule (agentic.james), Lenis replacing Locomotive Scroll, Higgsfield MCP for asset generation, the 4-layer Claude Code harness architecture (codewithbrij), the Refero.design workflow integrated into the build loop, and the useDeviceCapability hook gating Three.js vs CSS/SVG fallback. Every tool recommendation now has a real-world practitioner behind it./plan with that document saved in the root folder as "FULL_brief.md", provide the prompt I give to the full spec AI agent that works without restriction | IMPORTANT if there are ANY prerequisites that a skill or plugin can't handle ( Assume Anthropic Claude's CLI tool being used first) like maybe Asset and model generations, then you NEED top instruct so now. Otherwise, as soon as possible, give the full CLI command assuming ful perms in the repo root is given. This includes --dangerously-skip-permissions intentionally and being able to install any reputiable skill or tool.1 step1 stepSave the following as FULL_brief.md in your repo root.

markdown# FULL_brief.md
# Walker Book Works — Complete Agent Brief
# Cross-references: initial_website_plan.md · agent_build_rules.md
# The human reads Section A. The agent receives Section B onward.

---

## SECTION A — HUMAN PREREQUISITES (DO THESE FIRST)
## The agent cannot do these. They require your hands, accounts, or money.

---

### A1. ASSET GENERATION — Book Textures (BLOCKING — agent cannot start Phase 1 without these)

The 3D book model requires real textures extracted from the book photo.
The agent cannot generate faithful textures from scratch. You must produce these files
and place them in `/assets/textures/` before the agent runs Phase 1.

**Step 1 — Upscale the book photo**
- Go to: https://magnific.ai OR https://topazlabs.com/gigapixel-ai
- Upload: your book photo (the cognac + forest green quarter-bound)
- Settings: 4× upscale, "Enhance Details", preserve texture grain
- Export as: `book-reference-4x.jpg` → place in `/assets/`

**Step 2 — Crop texture patches from the upscaled image**
Open the upscaled image in Photoshop / Affinity Photo / GIMP and crop:

| Filename | Crop Region | Notes |
|----------|-------------|-------|
| `leather-grain.jpg` | Spine centre — 512×512px | Must show pebble grain clearly |
| `leather-corner.jpg` | Any corner piece — 512×512px | Show chamfer edge |
| `cloth-weave.jpg` | Front board centre — 512×512px | Fine linen weave |
| `spine-bands.jpg` | Full spine height — 256×1024px | All 5 raised bands visible |
| `endpaper-marble.jpg` | Not from photo — generate below | Inside cover surface |

**Step 3 — Generate the endpaper texture (not in the photo)**
- Go to: https://app.midjourney.com OR https://firefly.adobe.com
- Prompt: `traditional bookbinding marbled endpaper, blue-green-gold swirl pattern,
  aged paper, top-down flat lay, high resolution texture, no shadows, seamless tile`
- Export 1024×1024px → save as `/assets/textures/endpaper-marble.jpg`

**Step 4 — Generate normal maps from texture crops**
- Go to: https://cpetry.github.io/NormalMap-Online/ (free, browser-based)
- Upload each `.jpg` texture → set Strength: 3.5, Level: 7
- Export each as: `leather-grain-normal.jpg`, `cloth-weave-normal.jpg`
- Place all normals in `/assets/textures/`

**Step 5 — Generate scroll animation source frames (optional but powerful)**
- Go to: https://higgsfield.ai
- Use Higgsfield MCP OR their web UI
- Generate 2–3 cinematic animation frames of an open book with pages turning
- These become reference material / background video assets
- Export as `.mp4` → place in `/assets/video/`

**DONE CONDITION FOR A1:**
```
/assets/
  book-reference-4x.jpg
  /textures/
    leather-grain.jpg
    leather-grain-normal.jpg
    leather-corner.jpg
    cloth-weave.jpg
    cloth-weave-normal.jpg
    spine-bands.jpg
    endpaper-marble.jpg
  /video/
    book-pages-cinematic.mp4  (optional)
```

---

### A2. REPOSITORY SETUP (BLOCKING)

```bash
# Create the repo (or use existing)
mkdir walker-book-works && cd walker-book-works
git init
git remote add origin https://github.com/YOUR_USERNAME/walker-book-works.git

# Place both reference docs in root
cp path/to/initial_website_plan.md .
cp path/to/agent_build_rules.md .
cp path/to/FULL_brief.md .

# Place assets folder
mkdir -p assets/textures assets/video
# Copy all texture files from A1 into assets/textures/
```

---

### A3. CLAUDE CODE CLI — INSTALL & AUTH (BLOCKING)

```bash
# Install Claude Code globally
npm install -g @anthropic-ai/claude-code

# Authenticate (opens browser)
claude auth login

# Verify
claude --version
```

Requires: Anthropic account with Claude Code access (Pro or above).

---

### A4. NODE / PNPM ENVIRONMENT (BLOCKING)

```bash
# Node 20+ required
node --version  # must be ≥ 20.0.0

# Install pnpm if not present
npm install -g pnpm

# Verify
pnpm --version
```

---

### A5. VERCEL ACCOUNT (Non-blocking for build, blocking for deploy)

- Create account at vercel.com if you don't have one
- Install Vercel CLI: `npm install -g vercel`
- Login: `vercel login`
- This is needed for Phase 7 (deploy). Agent will scaffold the config.

---

### A6. DNS ACCESS (Non-blocking until Phase 7)

You will need access to the DNS panel for `walkerbookworks.com.au`
(wherever the domain is registered — likely Squarespace or a domain
registrar like Crazy Domains / VentraIP for .com.au).

When Phase 7 runs, you will manually add:
- `A` or `CNAME` record: `@` → Vercel IP (agent will provide exact values)
- `CNAME` record: `shop` → `ext.squarespace.com`

The agent will generate a `DNS_INSTRUCTIONS.md` file with exact values.

---

### A7. SQUARESPACE — SUBDOMAIN SETUP (Non-blocking until Phase 7)

In your Squarespace settings:
- Go to: Settings → Domains
- Add custom domain: `shop.walkerbookworks.com.au`
- This keeps Squarespace on the subdomain while Vercel owns the root

The agent cannot touch your Squarespace account. You do this manually
when prompted in Phase 7.

---
---

## SECTION B — AGENT PROMPT
## Copy this ENTIRE block and paste it as your first message to Claude Code.

---

```
You are the lead engineer on a production website build for Walker Book Works
(walkerbookworks.com.au). You have full permissions in this repository root.

Read these three files in full before doing anything else:
1. initial_website_plan.md
2. agent_build_rules.md
3. FULL_brief.md (this document — re-read Section C for your CLAUDE.md)

Your complete context:
- Client: Ethan Walker — book repair, binding, workshops — Australia
- Visual source of truth: /assets/book-reference-4x.jpg (DO NOT DEVIATE)
- Design system: forest green linen + cognac leather — all tokens in agent_build_rules.md
- Commerce: Squarespace on shop.walkerbookworks.com.au (YOU DO NOT TOUCH THIS)
- Hosting: Vercel on root domain
- Primary user: mobile phone (390px viewport, touch scroll, mid-range Android)

YOUR TASK:
Build the complete Walker Book Works immersive scrollytelling website
as specified across the three reference documents.

Execute the build in this exact phase order. Complete each phase fully
before starting the next. At the end of each phase, write a one-line
status comment in a file called `BUILD_LOG.md`.

PHASE 0: Asset validation + project scaffold + CLAUDE.md + tokens.css
PHASE 1: Static 3D book scene + CSS/SVG fallback + useDeviceCapability hook
PHASE 2: Scroll engine (Lenis + GSAP ScrollTrigger) + mobile/desktop split
PHASE 3: Cover open animation (the hero moment)
PHASE 4: Tassel bookmark with pendulum physics
PHASE 5: All 6 chapters assembled (Chapter 0 through Chapter 6)
PHASE 6: Mobile polish pass (Lighthouse ≥ 85, zero Safari errors)
PHASE 7: Vercel config + DNS instructions + HANDOFF.md for Ethan

HARD RULES YOU CANNOT OVERRIDE:
1. No Three.js on mobile — CSS/SVG fallback always
2. No GSAP pin on mobile — scroll-driven opacity/transform only
3. All colours from tokens.css only — no hardcoded hex anywhere
4. All proportions validated against /assets/book-reference-4x.jpg
5. shop.walkerbookworks.com.au is Squarespace — you never touch it
6. Run /polish skill after completing each chapter
7. Pull Refero.design references before generating any new UI section

Begin with PHASE 0 now.
```

---
---

## SECTION C — CLAUDE.md CONTENT
## The agent will create this file. It is included here as a reference/override.
## If the agent's generated CLAUDE.md is missing anything, manually replace with this.

---

```markdown
# CLAUDE.md — Walker Book Works
# Project persistent memory. Read at the start of every session.

## Identity
Project: Walker Book Works immersive scrollytelling website
Client: Ethan Walker — book repair, binding, workshops (Australia)
Domain: walkerbookworks.com.au
Commerce subdomain: shop.walkerbookworks.com.au (Squarespace — NEVER MODIFY)
Stack overview: Next.js 14 · GSAP · Framer Motion · Three.js · Vercel

## The Single Source of Truth
/assets/book-reference-4x.jpg is the design bible.
Every colour, texture, proportion, and material must trace to this image.
If you cannot justify a decision from this photo, do not make it.

## Colour Tokens (always use CSS variables, never raw hex)
--leather:        #C2813A
--leather-dark:   #8B5A24
--leather-light:  #D9A96E
--cloth:          #2C5040
--cloth-mid:      #3D6B54
--cloth-light:    #4E7D64
--parchment:      #F5EDD8
--parchment-dark: #E8D9B8
--ink:            #1A1208
--gold:           #C9A84C

## Typography
Headings: Cormorant Garamond (300/400/600 italic)
Body:     EB Garamond (400/500)
Labels:   Libre Baskerville (400, small caps)

## Immutable Constraints
1. MOBILE FIRST — 390px is the primary design surface
2. No Three.js on mobile — always provide CSS/SVG fallback
3. No GSAP pin on mobile — use scroll-driven opacity/transform
4. All colours via tokens.css variables only
5. Lenis smooth scroll on desktop, native on mobile
6. Squarespace subdomain is untouched infrastructure
7. Performance budget: Lighthouse mobile ≥ 85

## Installed Skills (invoke as needed)
- emilkowalski/design-skill → correct easing and motion
- impeccable-design/skill → /polish command for cleanup
- leonxlnx/taste-skill → high-end visual + design taste + minimalist
- nextlevelbuilder/ui-ux-pro-max-skill → layout rules

## Workflow
- Run /polish after completing each chapter section
- Check Refero.design before generating any new UI pattern
- Log phase completions in BUILD_LOG.md
- Never hardcode colours, spacing, or font sizes outside tokens.css

## File Structure
/src/components/Book/         → 3D book + cover + spine + page + tassel
/src/components/Chapters/     → Chapter0 through Chapter6
/src/components/UI/           → WaxSeal, GoldRule, PageEdge
/src/hooks/                   → useScrollScrub, useTasselPhysics, usePageCurl, useDeviceCapability
/src/styles/                  → tokens.css, book.css
/assets/textures/             → all extracted + generated texture maps
/assets/video/                → cinematic scroll frames (optional)
```

---
---

## SECTION D — THE FULL CLI COMMAND
## Run this from your repo root after ALL Section A prerequisites are complete.

---

### One-liner (paste and run):

```bash
claude --dangerously-skip-permissions "$(cat FULL_brief.md | sed -n '/## SECTION B/,/## SECTION C/p' | sed '1d;$d')"
```

### Explicit full command (recommended — paste the prompt directly):

```bash
claude --dangerously-skip-permissions \
"You are the lead engineer on a production website build for Walker Book Works \
(walkerbookworks.com.au). You have full permissions in this repository root. \
\
Read these three files in full before doing anything else: \
1. initial_website_plan.md \
2. agent_build_rules.md \
3. FULL_brief.md \
\
Your complete context: \
- Client: Ethan Walker — book repair, binding, workshops — Australia \
- Visual source of truth: /assets/book-reference-4x.jpg (DO NOT DEVIATE) \
- Design system: forest green linen + cognac leather — all tokens in agent_build_rules.md \
- Commerce: Squarespace on shop.walkerbookworks.com.au (YOU DO NOT TOUCH THIS) \
- Hosting: Vercel on root domain \
- Primary user: mobile phone (390px viewport, touch scroll, mid-range Android) \
\
Execute the build in this exact phase order. Complete each phase fully \
before starting the next. Log each phase completion in BUILD_LOG.md. \
\
PHASE 0: Asset validation + project scaffold + CLAUDE.md + tokens.css \
PHASE 1: Static 3D book scene + CSS/SVG fallback + useDeviceCapability hook \
PHASE 2: Scroll engine (Lenis + GSAP ScrollTrigger) + mobile/desktop split \
PHASE 3: Cover open animation \
PHASE 4: Tassel bookmark with pendulum physics \
PHASE 5: All 6 chapters assembled \
PHASE 6: Mobile polish pass (Lighthouse >= 85) \
PHASE 7: Vercel config + DNS instructions + HANDOFF.md \
\
HARD RULES: \
1. No Three.js on mobile — CSS/SVG fallback always \
2. No GSAP pin on mobile \
3. All colours from tokens.css only \
4. All proportions from /assets/book-reference-4x.jpg \
5. Never touch shop.walkerbookworks.com.au \
6. Run /polish after each chapter \
7. Pull Refero.design references before each new UI section \
\
Begin with PHASE 0 now."
```

### If you prefer an interactive session (recommended for first run):

```bash
claude --dangerously-skip-permissions
```

Then paste the full Section B prompt as your first message.
This lets you watch phase-by-phase and intervene if needed.

---

### Skills pre-install (run these BEFORE the main command):

```bash
# Install all required Claude Code design skills first
npx skills add https://github.com/emilkowalski/design-skill && \
npx skills add https://github.com/impeccable-design/skill && \
npx skills add https://github.com/leonxlnx/taste-skill && \
npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
```

### Full pre-flight sequence (everything in order):

```bash
# 0. Confirm you are in the repo root with assets in place
ls assets/textures/leather-grain.jpg && echo "✅ Assets ready" || echo "❌ STOP — complete Section A first"

# 1. Install skills
npx skills add https://github.com/emilkowalski/design-skill
npx skills add https://github.com/impeccable-design/skill
npx skills add https://github.com/leonxlnx/taste-skill
npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill

# 2. Confirm Claude Code is authenticated
claude auth status

# 3. FIRE
claude --dangerously-skip-permissions
# → paste Section B prompt
```

---

## SECTION E — WHAT TO WATCH FOR (human monitoring guide)

The agent will run autonomously but you should monitor these checkpoints:

| Phase | What to verify manually |
|-------|------------------------|
| Phase 0 | tokens.css opened — confirm hex values match your eye-picked colours from the photo |
| Phase 1 | Screenshot the 3D book — does it match the reference photo proportions? |
| Phase 3 | Play the cover open on desktop — does it feel like a real book or a flat card? |
| Phase 4 | Scroll fast — does the tassel actually swing? Does it settle naturally? |
| Phase 5 | Open every chapter on your phone — is anything overflowing or janking? |
| Phase 6 | Run Lighthouse yourself. If score < 85, tell the agent explicitly. |
| Phase 7 | Do not let the agent touch DNS or Squarespace. It generates instructions only. |

---

## SECTION F — FALLBACK PROMPTS

If the agent stalls or produces wrong output, use these targeted re-prompts:

**If colours are wrong:**
```
Stop. Open /src/styles/tokens.css and compare every colour variable
against /assets/book-reference-4x.jpg. Fix any that diverge.
The leather is cognac/tan, NOT dark brown. The cloth is dark forest
green, NOT emerald or teal. Correct and continue.
```

**If mobile is janky:**
```
Stop. The mobile experience has scroll jank. Audit every component for:
1. Any GSAP pin on mobile — remove it, replace with opacity scroll-drive
2. Any Three.js canvas rendering on mobile — replace with CSS/SVG fallback
3. Any will-change: transform on more than 3 elements simultaneously
Fix all issues. Run Lighthouse mobile. Score must be >= 85. Continue.
```

**If the 3D book looks generic:**
```
Stop. The book model does not match the reference photo.
Open /assets/book-reference-4x.jpg. The book is a quarter-bound
construction: leather only on the spine and corner triangles, green
linen cloth on the boards. The spine has 5 raised horizontal bands.
The corners have a diagonal chamfer. Fix the geometry and texture
mapping to match exactly. Do not use generic book models.
```

**If tassel is stiff:**
```
The tassel physics feel too rigid. Reduce the spring strength to 0.02,
increase damping to 0.95, and add Perlin noise idle drift of ±1.5°
at amplitude 0.02 and frequency 0.8. The tassel should feel like
real silk — light, responsive, with natural overshoot on fast scroll.
```

---

*End of FULL_brief.md*
*Save in repo root. Agent reads Sections B–D. Human acts on Section 