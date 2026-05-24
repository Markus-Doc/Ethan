<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Ethan Agent Instructions

This file is the repo-level source of truth for AI agents working on Ethan.

## Locked creative production decision

The primary asset creation platform for Ethan is Blender.

The primary MCP framework choice is ahujasid/blender-mcp, used in a local and isolated creative workstation workflow. It is selected because it is the most practical current Blender MCP option for natural language driven scene creation, object manipulation, material work, animation setup, and prompt assisted 3D production.

Blender Lab MCP should be monitored as the conservative official-aligned alternative, but it does not replace the selected working choice until a new decision record is added.

Spline is not the primary creation pipeline. Spline may be used only as a secondary web-native prototype or interaction sketching tool. Do not move the core book animation, model creation, or final render source of truth into Spline unless Markus explicitly approves a new architecture decision.

## Product experience goal

Build an immersive scrollytelling website with scroll-synchronised animations, pinned sections, cinematic transitions, and 3D interactive elements.

The hero object is a hand-bound green cloth and tan leather book. The intended sequence is:

1. Book rotates into view
2. Book opens
3. Pages flip through content sections
4. Final rear cover closes or settles
5. Back cover shows contact information

## Preferred web delivery model

The default runtime path is a scroll-scrubbed image sequence rendered into canvas, controlled by GSAP ScrollTrigger.

Use this as the baseline before adding heavier interactive 3D:

- Next.js for the website
- GSAP ScrollTrigger for scroll synchronisation
- Lenis for smooth scroll feel
- Blender render output as PNG, WebP, or AVIF frame sequences
- Three.js or React Three Fiber only where live 3D interaction adds clear value

Do not default to traditional video for the main scroll-controlled sequence. Video may be used only for previews or fallback assets.

## Blender agent operating rules

When controlling Blender through MCP, agents should:

- Treat Blender as the production source of truth
- Prefer natural language prompt iteration backed by Blender Python where useful
- Keep scene files organised by milestone
- Preserve source .blend files before destructive changes
- Export web-ready frame sequences as explicit build artefacts
- Keep page content and contact details editable as textures or generated SVG sources
- Document material, camera, lighting, and render choices in the relevant asset notes

## Security and safety rules for MCP

Blender MCP can execute code through Blender and local tooling. Treat it as local code execution.

Agents must:

- Use local stdio style MCP workflows where practical
- Avoid exposing Blender MCP to public networks
- Avoid untrusted MCP forks unless separately reviewed
- Record any new MCP dependency before use
- Ask before running destructive local scene or file operations
- Keep generated assets and source scenes separate from production web code

## Documentation map

Read these first:

- docs/decisions/ADR-0001-blender-mcp-asset-pipeline.md
- docs/asset-pipeline/blender-mcp-workflow.md

## Non-goals

Do not treat Spline MCP as a required production dependency.
Do not make the site depend on a paid 3D platform to run locally.
Do not collapse creative source files and web runtime files into the same asset folder.
