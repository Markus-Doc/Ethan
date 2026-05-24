# Blender MCP Asset Workflow

This guide defines how Ethan should use Blender and MCP for the cinematic book website.

## Selected toolchain

| Layer | Decision |
| --- | --- |
| Creative source of truth | Blender |
| Primary MCP framework | ahujasid/blender-mcp |
| Official-aligned MCP to monitor | Blender Lab MCP |
| Web framework | Next.js |
| Scroll animation | GSAP ScrollTrigger |
| Smooth scroll | Lenis |
| Optional live 3D layer | Three.js or React Three Fiber |
| Secondary prototype tool | Spline |

## Read first

Before generating assets, read:

- `docs/asset-pipeline/blender-book-asset-generation-instructions.md`
- `docs/decisions/ADR-0001-blender-mcp-asset-pipeline.md`
- `AGENTS.md`

## Creative intent

The hero book should feel physical, crafted, cinematic, and premium.

The current visual reference is a green cloth and tan leather hand-bound book. The binding, spine, cloth panels, leather corners, and real handmade texture should guide the modelling and material work.

## Production stages

### Stage 1: Reference and modelling

Create a clean Blender scene that matches the physical object:

- Rectangular book block
- Rounded leather spine
- Green cloth covers
- Tan leather spine strip
- Tan leather corners
- Subtle handmade imperfections
- Visible page block edges

### Stage 2: Materials

Create physically plausible materials:

- Tan leather with roughness, grain, colour variation, and edge wear
- Dark green cloth with weave texture and soft roughness
- Slightly off-white pages with thickness and shadowing
- Optional foil, embossing, or debossing for contact details

### Stage 3: Rig and animation

Build animation segments as separate controllable timelines:

1. Closed book rotation
2. Front cover opening
3. First page reveal
4. Page flip loop or multiple page flip beats
5. Hero content pages
6. Final back cover reveal
7. Contact cover ending

Keep camera motion and object motion separable so scroll mapping can be tuned later.

### Stage 4: Render output

Render image sequences first.

Preferred outputs:

- Master frames: PNG
- Web frames: WebP or AVIF after optimisation
- Fallback preview: MP4 or WebM
- Optional live 3D export: GLB only when required

Avoid making traditional video the main scroll-controlled experience.

### Stage 5: Website integration

The site should map scroll position to frame number.

Preferred runtime pattern:

- Preload frame sequence
- Draw current frame to canvas
- Use GSAP ScrollTrigger scrub to control frame index
- Pin hero sections during key animation beats
- Use text overlays and page content timing as separate layers
- Use Lenis only after basic ScrollTrigger timing works

## Directory expectations

Use clear separation between creative source files and runtime files.

Recommended structure:

```text
assets/
  source/
    blender/
      ethan-book-v001.blend
      ethan-book-v002.blend
  renders/
    book-hero-sequence/
      master-png/
      web-webp/
      previews/
  textures/
    leather/
    cloth/
    pages/
  references/
    photos/
    moodboards/
public/
  sequences/
    book-hero/
```

## Agent workflow

Agents using Blender MCP should work in small named passes:

1. Scene setup pass
2. Materials pass
3. Rigging pass
4. Animation pass
5. Camera and lighting pass
6. Render pass
7. Optimisation pass
8. Website integration pass

Each pass should leave a short note describing what changed and what remains unresolved.

## Prompting style for Blender agents

Prompts should describe the desired visual outcome, physical constraints, and production output.

Good prompt pattern:

```text
Create a realistic hand-bound book matching the reference: dark green cloth panels, tan leather spine, tan leather corner pieces, rounded spine, visible page block, handmade texture, warm studio lighting. Build it as separate objects suitable for opening cover animation and page flip animation. Keep materials named and editable.
```

Avoid vague prompts that only ask for a book. Ethan needs a specific crafted object that can become a scroll-controlled website hero.

## Quality bar

The asset is not ready until:

- The book reads clearly as hand-bound
- Leather and cloth are visibly different materials
- The spine feels rounded and physical
- Page flips have believable thickness and shadow
- Contact details can be placed on the final back cover
- Rendered frames can scrub smoothly forward and backward
- Mobile performance has a fallback plan

## Spline guidance

Spline may be used for quick interaction prototypes, but not as the production source of truth.

Acceptable Spline use:

- Testing hover concepts
- Testing a simple camera orbit idea
- Rapidly previewing a web-native 3D feeling
- Creating a non-final proof of concept

Do not use Spline to replace Blender for the book model, material system, final page flip animation, or master render sequence.
