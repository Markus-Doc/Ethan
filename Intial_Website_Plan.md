# Walker Book Works — Immersive Scrollytelling Website Brief

---

## Site Audit Summary

The live site (`walkerbookworks.com.au`) is currently a Squarespace password-protected "coming soon" page. Owner: **Ethan Walker**. Services advertised: book repair, binding, workshops, general enquiries. Contact: Info@walkerbookworks.com.au / 0431 339 084. Launch target: Late June – Early July. The Squarespace infrastructure is paid and live — the goal is to build a custom-coded frontend that wraps over or lives adjacent to it.

---

## The Book — Visual Design System

Looking carefully at the image, this is a classic **quarter-bound book** with a specific construction that defines the entire design language:

**Colour Palette (extracted precisely from the book):**

| Token | Hex | Use |
|-------|-----|-----|
| `--leather` | `#C2813A` | Primary CTA, headings, tassel, spine highlight |
| `--leather-dark` | `#8B5A24` | Hover states, deep shadow, borders |
| `--leather-light` | `#D9A96E` | Leather grain texture overlay, shimmer |
| `--cloth` | `#2C5040` | Background dark sections, nav, footer |
| `--cloth-mid` | `#3D6B54` | Section dividers, card backgrounds |
| `--cloth-light` | `#4E7D64` | Secondary surfaces |
| `--parchment` | `#F5EDD8` | Page/paper backgrounds, body text areas |
| `--parchment-dark` | `#E8D9B8` | Page edge shadows, aged paper feel |
| `--ink` | `#1A1208` | Primary body text |
| `--gold` | `#C9A84C` | Gilded detail lines, raised bands, decorative rule |

**Construction details to animate:**
- Raised spine bands (5 horizontal ridges on the leather spine)
- Diagonal corner leather triangles on all 4 board corners
- The spine is slightly convex/rounded — critical for 3D model feel
- Cloth boards are a finely woven linen-textured green
- The leather has visible pebble grain — use a normal map texture

---

## The Full Scrollytelling Concept

Think of the entire website as **a single book being read**. The user is not scrolling a website — they are turning through the book. Every section is a chapter. The book itself is the UI.

---

## SCROLL SEQUENCE: Beat-by-Beat

### SCENE 0 — The Cover (Page Load, 0 scroll)
The book enters from darkness. It sits in 3D space, slightly angled (the exact perspective from your photo — showing both the front board and the spine simultaneously). A single warm light source from above-left casts shadows in the right-hand corner leather pieces.

- The book **slowly rotates** on its vertical axis (a gentle 0–15° auto-idle rotate, like it's sitting on a velvet surface)
- Ambient particles: tiny golden dust motes floating (three.js particle system, very subtle)
- Wordmark **"Walker Book Works"** fades in above in a serif font, letter-spacing wide
- Tagline beneath: *"Binding. Repair. Craft."*
- The tassel bookmark hangs from the top of the book, swaying gently with a physics-based pendulum (Matter.js or CSS spring)

```js
// Auto-idle rotation on hero
gsap.to(book3D.rotation, {
  y: Math.PI * 0.08,
  duration: 4,
  ease: "sine.inOut",
  yoyo: true,
  repeat: -1
})
```

---

### SCENE 1 — The Opening (Scroll 0–20%)
As the user begins scrolling, the book **spins to face front** (rotateY to 0°), then the **front cover swings open** — the left board peels back with a CSS/Three.js perspective transform that reveals the inside cover (deep forest green with a marbled endpaper pattern).

- The spine stays in position; only the front board opens
- The hinge crease catches light as it opens (specular highlight sweeps across it)
- The opening reveals: an **aged parchment endpaper** with a hand-drawn map-style illustration of the workshop
- Overlaid in ink handwriting: *"Every great book deserves a life well-bound."*

**Implementation:** CSS `perspective` + `rotateY` on a flat card div, OR a Three.js mesh with a bone/joint rig on the cover plane. CSS is simpler and sufficient here.

```css
.book-cover {
  transform-origin: left center;
  transform: perspective(1200px) rotateY(0deg);
  transition: transform 0s; /* driven by GSAP ScrollTrigger */
}
```

```js
ScrollTrigger.create({
  trigger: "#scene-open",
  start: "top top",
  end: "+=800",
  scrub: 1.5,
  onUpdate: (self) => {
    cover.style.transform = 
      `perspective(1200px) rotateY(${-self.progress * 160}deg)`;
  }
})
```

---

### SCENE 2 — Chapter One: About (Scroll 20–35%)
The first page **turns** — a CSS page-curl from bottom-right corner, revealing the About section on the "right-hand page." The left-hand page shows a watercolour illustration of hands binding a book.

**Page content (right page):**
- Heading: *"The Craft"*
- Body: Ethan's story — who Walker Book Works is, where they're based, the philosophy of hand-bound books
- A worn leather-corner decorative element in the bottom right

**Page turn animation:**
```js
// Page curl using pseudo-3D CSS transform
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
```

---

### SCENE 3 — Chapter Two: Services (Scroll 35–60%)
This is the most theatrical section. The **book stays pinned and open** while four service "cards" appear as if being placed onto the right-hand page, one by one, in sequence — like index cards being laid onto a desk.

Services (from the coming-soon page):
1. **Book Repair** — restore damaged, broken, or aged books
2. **Book Binding** — full custom binding from materials and cloth to leather
3. **Workshops** — hands-on bookbinding classes
4. **General Enquiries** — bespoke commissions, unusual projects

Each card slides in from the right at a slight angle, in a slightly imperfect stack (like real cards on a desk), rotated 1–3° randomly. On hover, the card lifts and straightens — a subtle `translateY(-8px) rotate(0deg)` with a leather-texture drop shadow.

**The tassel bookmark** moves between cards as each is pinned — it physically sweeps from card to card, its silken thread catching the light.

---

### SCENE 4 — Chapter Three: Process (Scroll 60–75%)
**Horizontal scroll chapter** — the open book now has pages that scroll left-to-right rather than top-to-bottom, revealing a step-by-step process like illustrated pages in an old manual:

- Page 1: *Assessment* — inspect the damage (illustration: hands examining spine)
- Page 2: *Materials* — leather, cloth, thread, paste (illustration: flat lay of tools)
- Page 3: *Structure* — sewing, pressing, casing-in
- Page 4: *Finishing* — gold tooling, pressing, delivery

Each "page" uses `overflow-x: hidden` with a `scrollLeft` driven by vertical scroll progress via GSAP ScrollTrigger's `containerAnimation`.

---

### SCENE 5 — Chapter Four: Workshops (Scroll 75–85%)
A **video panel** appears embedded in the left page — treated to look like a moving photograph in an old book, with a slight sepia/warm grade and a torn-paper frame mask. The right page has workshop details, dates, and a CTA button styled as a wax seal stamp (the "W" of Walker Book Works pressed in deep red wax).

---

### SCENE 6 — Chapter Five: Contact (Scroll 85–100%)
The book **closes slowly** — the cover swings back shut. As it does, the contact details appear to be revealed on the back cover, embossed in the green cloth:

```
Walker Book Works
Info@walkerbookworks.com.au
0431 339 084
```

The tassel bookmark hangs from the now-closed book, softly swaying. Below the book, the word **"Fin."** in italic serif fades in, very small.

---

## THE TASSEL BOOKMARK — Full Animation Detail

This is your signature flourish. The tassel is a CSS/SVG element with a physics simulation:

```js
// Tassel physics — spring pendulum
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
```

The tassel has four parts:
1. **The ribbon** — a 4px wide silk ribbon emerging from the top of the spine
2. **The knot** — a small circular div with a radial gradient
3. **The thread bundle** — 8–12 individual SVG `<line>` elements, each offset slightly in a different direction
4. **The fringe ends** — each thread has a tiny teardrop cap that catches light

On **rapid scroll**, the tassel swings wide. On **slow scroll**, it sways gently. When **stationary**, it hangs perfectly still with only micro-drift from a Perlin noise idle animation.

---

## SQUARESPACE INTEGRATION STRATEGY

This is the most important technical constraint. The client has paid for Squarespace — that infrastructure must be respected and preserved.

**Recommended approach: Custom Domain + Subdomain Split**

```
walkerbookworks.com.au          → Custom React/Next.js frontend (this scrollytelling site)
shop.walkerbookworks.com.au     → Squarespace (products, booking, checkout, payments)
```

The scrollytelling homepage CTAs (e.g. "Book a Workshop", "Commission a Binding") link through to the Squarespace subdomain for transactions. This keeps Squarespace as the commerce and admin layer while giving complete creative freedom on the front.

**Alternative: Squarespace Code Injection (simpler, more limited)**
If keeping everything on one domain is required, Squarespace's `</head>` code injection can load a React bundle and a custom CSS overlay. This is more constrained but avoids subdomain confusion. The Squarespace pages become hidden utility pages; the injected JS renders the immersive experience on top. This approach works but you lose GSAP pin behaviour on mobile due to Squarespace's scroll container wrapper.

**Recommended choice: subdomain split.** It is cleaner, more performant, and Ethan already has Squarespace paid — nothing changes for him on the commerce side.

---

## TECH STACK

```
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
```

---

## FILE/COMPONENT ARCHITECTURE

```
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
```

---

## TYPOGRAPHY

```css
/* Heading — classic letterpress feel */
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
```

---

## IMMEDIATE NEXT STEPS (Ordered)

1. **Extract and clean the book textures** — run the book photo through an AI upscaler (Magnific or Topaz), then crop individual patches of leather grain and green cloth to use as Three.js texture maps
2. **Build the static book in Three.js** — a flat-shaded box geometry with the correct proportions, then map the extracted textures. Get the idle rotation working first before any scroll logic
3. **Install Claude Code skills** (from your saved videos): Emil Kowalski's motion skill + Impeccable Design skill — these ensure all easing and spacing are correct from the start
4. **Wire GSAP ScrollTrigger** to the cover-open animation first — this is the hero moment that sells the whole concept
5. **Build the tassel component** in isolation — it's the detail that makes people gasp and share
6. **Set up the Squarespace subdomain** — this unblocks Ethan's commerce needs independently of the frontend build
7. **Add Framer Motion** to all cards and page-content entrance animations last — polish layer only once structure works

---

The entire concept is unified by one metaphor: **you are not browsing a website, you are reading Ethan's book.** Every interaction — the creak of the cover, the flutter of a page, the swing of the tassel — communicates the same thing his physical craft communicates: that books are alive, tactile, and worth caring for.