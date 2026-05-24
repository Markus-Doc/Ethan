# Ethan

Ethan is a Next.js application for an immersive scrollytelling website built around a cinematic hand-bound book experience.

The project direction is:

> Build an immersive scrollytelling website with scroll-synchronised animations, pinned sections, cinematic transitions, and 3D interactive elements.

The hero experience is a green cloth and tan leather book that rotates, opens, flips through content pages, and ends with contact information on the back cover.

## Locked production decision

Blender is the primary creative production platform.

The selected MCP workflow is ahujasid/blender-mcp, used locally for natural language driven Blender creation and iteration.

Spline is secondary only. It may be used for quick web-native prototypes, but it is not the source of truth for the book model, page animation, materials, or final rendered assets.

Start here before changing the creative pipeline:

- `AGENTS.md`
- `docs/decisions/ADR-0001-blender-mcp-asset-pipeline.md`
- `docs/asset-pipeline/blender-mcp-workflow.md`

## Preferred delivery model

The preferred runtime path is a scroll-scrubbed image sequence rendered into canvas, controlled by GSAP ScrollTrigger.

Baseline stack:

- Next.js
- Blender
- ahujasid/blender-mcp for local creative production
- GSAP ScrollTrigger
- Lenis
- Optional Three.js or React Three Fiber where live 3D adds clear value

## Getting Started

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000` with your browser to see the result.

## Agent notes

Agents must read `AGENTS.md` before making architectural, visual, animation, or asset-pipeline changes.
