---
name: blender-storybook-assets
description: Use when creating, editing, reviewing, or exporting the Ethan Blender storybook book asset through Blender MCP. This skill guides Claude Code to inspect Blender first, use the repo asset pipeline docs, build the hand-bound book scene, and export web-ready frame sequences.
---

# Blender Storybook Assets Skill

You are working on Ethan, a Next.js scrollytelling website with Blender as the creative source of truth.

Use this skill when the user asks to create, modify, inspect, animate, render, or export the Ethan 3D book assets.

## Required reading

Read these files before making production decisions:

- `AGENTS.md`
- `docs/decisions/ADR-0001-blender-mcp-asset-pipeline.md`
- `docs/asset-pipeline/blender-mcp-workflow.md`
- `docs/asset-pipeline/blender-book-asset-generation-instructions.md`
- `docs/asset-pipeline/claude-code-blender-mcp-setup.md`

## Workflow contract

1. Confirm Blender MCP is connected before attempting Blender edits.
2. Inspect the current Blender scene first.
3. Summarise the scene state before making changes.
4. Ask for confirmation before destructive scene operations.
5. Keep Blender as the creative master and the website as the runtime consumer.
6. Use named objects, named materials, named lights, named cameras, and named timeline markers.
7. Work in small passes: setup, blockout, materials, geometry, rigging, animation, camera, render, export.
8. Save source `.blend` files before major destructive changes.
9. Export master PNG frame sequences first, then optimise to WebP or AVIF for the website.
10. Never make the website depend on Blender or MCP at runtime.

## Target asset

Create a premium hand-bound book matching the reference direction:

- Dark green cloth panels
- Tan leather rounded spine
- Tan leather corner pieces
- Thick warm off-white page block
- Handmade material variation
- Realistic cloth and leather textures
- Page flip animation suitable for scroll scrubbing
- Final back cover contact information

## Required animation sections

Use timeline markers:

- `SCENE_01_ROTATE_REVEAL`
- `SCENE_02_COVER_OPEN`
- `SCENE_03_FIRST_PAGE`
- `SCENE_04_PAGE_FLIPS`
- `SCENE_05_BACK_COVER`
- `SCENE_06_CONTACT_HOLD`

Default frame ranges:

- Rotate reveal: 1 to 120
- Cover open: 121 to 220
- First page: 221 to 280
- Page flips: 281 to 600
- Back cover: 601 to 720
- Contact hold: 721 to 780

## First action in a live Blender session

When Blender MCP is available, start with:

```text
Inspect the current Blender scene and list all objects, materials, cameras, lights, timeline markers, render settings, and output paths. Do not change anything yet. Then compare the scene against the Ethan Blender asset generation runbook and provide the next safest production pass.
```

## Production instruction

After inspection, proceed in the smallest useful pass. Avoid one giant all-at-once edit unless the user explicitly asks for it.

Use Blender Python where it improves repeatability, but explain the intended change before destructive edits.
