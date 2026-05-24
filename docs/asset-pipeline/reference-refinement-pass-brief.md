# Reference Refinement Pass Brief

Status: active
Purpose: correct the first Blender blockout so the book matches the supplied reference images much more closely.

## Current issue

The first static blockout produced a useful proof that Blender MCP is working, but it does not yet match the physical book reference.

Observed problems:

- The model reads as a flat opened binder rather than the photographed standing hand-bound book.
- The hero camera is too flat and orthographic-like compared with the reference.
- The central spine is too rectangular and segmented instead of rounded, leather-wrapped, and softly protruding.
- The green cloth panels are too flat and lack visible inset seams and fabric texture.
- The tan leather corner pieces are too small, too flat, and do not follow the reference diagonal joins.
- The right-side rectangular patch is not part of the visible reference and should be removed unless later approved.
- The model lacks the thick angled board geometry visible at the outer sides.
- The bottom edge and board thickness do not yet feel handmade or physical.

## Approved references

Use all available photos in:

```text
assets/references/photos/
```

Expected files include:

```text
custom_binding-1.jpeg
custom_binding-2.jpg
custom_binding-3.jpg
```

## Primary visual goal

Rebuild or heavily revise the book so the hero camera reads as the same object in the reference photos:

- Standing book with boards angled back from the central spine.
- Dominant rounded tan leather spine at the centre.
- Dark forest green cloth panels on both boards.
- Tan leather side strips and corner pieces.
- Diagonal leather-to-cloth joins on the outer panels.
- Visible board thickness and bevels.
- Leather grain, mottling, seam grooves, and edge wear.
- Cloth weave and subtle panel seams.

## Geometry corrections

### Spine

The spine must be a rounded vertical leather form, not a flat rectangle.

Required changes:

- Use a convex half-cylinder or bevelled rounded rectangular spine.
- Make it protrude slightly toward the camera.
- Add two shallow vertical grooves beside the central spine face.
- Add subtle leather seam lines.
- Remove large horizontal bands unless explicitly requested later.

### Boards and cover angle

The boards should form a shallow open-book angle around the spine.

Required changes:

- Left and right boards angle backward from the central spine.
- Outer board edges should be slightly visible.
- Boards must have thickness, bevels, and soft edge highlights.
- The camera should frame the object close, like the reference photo.

### Cloth panels

The green cloth panels should be inset-looking and tactile.

Required changes:

- Add cloth weave through procedural bump or texture nodes.
- Add dark green colour variation.
- Add subtle vertical seam or raised edge where cloth meets the leather spine.
- Add diagonal panel edge lines matching the reference.

### Leather corners

The corner leather must be larger and integrated with the board edges.

Required changes:

- Use triangular or trapezoid tan leather corner areas at the outer board corners.
- Align diagonal edges with the visible reference diagonals.
- Add leather grain material to all tan corner pieces.

### Remove incorrect elements

Remove any flat rectangular patch on the right board unless it is being used only as a temporary placeholder for future contact text.

The contact back cover is a later pass and should not disrupt reference matching in this refinement pass.

## Pass instruction

This is not an animation pass.

This is a visual correction pass that should create `ethan-book-v002.blend` from the existing scene, preserving v001 as a backup.

## Claude Code prompt

```text
Use the blender-storybook-assets skill.

This is Pass 1B: Reference Accuracy Rebuild.

Do not animate yet.

The current Pass 1 model is not accurate enough. Before editing, save a backup copy of the current scene as assets/source/blender/ethan-book-v001-before-refinement.blend if it does not already exist. Then create a revised file as assets/source/blender/ethan-book-v002.blend.

Use all reference images in assets/references/photos, especially custom_binding-1.jpeg, custom_binding-2.jpg, and custom_binding-3.jpg.

Goal: rebuild or heavily revise the static book model so the hero camera matches the physical reference much more closely.

Required visual corrections:
- The book must read as the photographed standing hand-bound book, not a flat opened binder.
- The left and right boards must angle backward from the central spine.
- The central spine must be dominant, rounded, tan leather, vertically oriented, and slightly protruding toward the camera.
- Add shallow vertical groove lines on both sides of the spine face.
- Remove the large horizontal spine bands unless they are needed only as subtle leather seam details.
- Make the green cloth panels deep forest green with visible cloth weave and subtle panel seams.
- Make the tan leather corners larger and match the diagonal joins visible in the reference.
- Add tan leather side strips and visible board thickness at the outer edges.
- Remove the incorrect flat rectangular patch on the right board for now.
- Add bevels and soft handmade imperfections.
- Keep the covers, spine, corners, page block, and future page elements as separate editable named objects.
- Keep the required timeline markers and frame range.
- Keep the named materials, but improve them.
- Reposition Camera_Hero_Scroll to a close reference-style hero view.
- Render or save at least one preview still if possible.

Stop after the static visual refinement pass and report:
- backup file path
- v002 saved path
- objects changed or rebuilt
- materials improved
- camera changes
- remaining visual gaps versus the reference
```

## Acceptance criteria

The pass is acceptable when a screenshot from `Camera_Hero_Scroll` immediately reads as the supplied physical book reference without needing explanation.
