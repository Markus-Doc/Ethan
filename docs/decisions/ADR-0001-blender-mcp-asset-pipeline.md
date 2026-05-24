# ADR-0001: Blender MCP Asset Pipeline

Status: Accepted
Date: 2026-05-24
Owner: Markus Walker

## Context

Ethan needs a premium cinematic website built around a hand-bound book. The experience should feel like an immersive scrollytelling product site, with scroll-synchronised animations, pinned sections, cinematic transitions, and 3D interactive elements.

The required hero sequence is:

1. The book rotates into view
2. The book opens
3. Pages flip through content sections
4. The final back cover closes or settles
5. Contact information appears on the back cover

The production workflow must support imaginative natural language prompting, rapid iteration, custom materials, animation control, frame output, and later website integration.

## Decision

Use Blender as the primary creative production platform.

Use ahujasid/blender-mcp as the selected MCP framework for practical natural language driven Blender control in local development.

Use Blender Lab MCP as a monitored official-aligned alternative, not the selected primary framework yet.

Use Spline only as a secondary prototype layer for quick web-native interaction experiments. Spline is not the production source of truth for the book model, animation, material system, or final rendered frame sequences.

## Rationale

Blender is the strongest fit because it can create the model, materials, camera, lighting, rigging, page animation, render passes, and export formats required for a premium visual system.

ahujasid/blender-mcp is selected because it is currently the most practical community option for MCP-enabled Blender control. It supports the natural language and agentic workflow Ethan needs while still allowing direct Blender Python execution when precise control is required.

Blender Lab MCP is important because it is closer to the official Blender ecosystem. It should be watched, but the production workflow should not wait on it.

Spline remains useful for quick prototypes and interaction sketches, but its MCP story is not strong enough to anchor this project.

## Architecture consequence

The web runtime should not depend on Blender MCP.

Blender MCP is part of the creative asset production workflow only. Final web artefacts should be exported as static or optimised assets consumed by the site.

The preferred runtime path is:

1. Blender source scene
2. Rendered frame sequence
3. Optimised web image sequence
4. Next.js canvas playback
5. GSAP ScrollTrigger scroll control
6. Optional Lenis smooth scroll
7. Optional Three.js or React Three Fiber interactive layer

## Source of truth rules

- Source .blend files are creative masters
- Rendered frame sequences are build artefacts
- Optimised web images are runtime artefacts
- Website code must not require Blender to run
- Page content and contact details should stay editable before final render
- New source files should be stored away from optimised runtime files

## MCP security rules

Blender MCP must be treated as local code execution.

Use local stdio workflows where practical. Do not expose Blender MCP to public networks. Avoid unreviewed forks. Record new MCP dependencies before use. Ask before destructive scene or file operations.

## Revisit triggers

Revisit this ADR if:

- Blender Lab MCP becomes clearly superior for this workflow
- Spline releases a first-party API or MCP workflow that can reliably create and manipulate scenes
- The website needs live runtime 3D rather than pre-rendered scroll-scrubbed frame sequences
- Render size or mobile performance forces a different delivery model

## Agent instruction

All agents should treat this ADR as the current truth. Do not propose replacing Blender as the source-of-truth creative platform unless the task is explicitly to reassess the production pipeline.
