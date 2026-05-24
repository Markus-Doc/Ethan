# Reference Image Recreation Brief

Status: active
Purpose: define the approved visual target for the Ethan Blender book asset.

## Reference image

The approved visual reference is the supplied photo of the hand-bound book with dark green cloth panels and tan leather binding.

Copy the image into the repo at:

```text
assets/references/photos/custom_binding-1.jpeg
```

## Modelling note

A single front-facing image can guide a highly accurate hero-view recreation. It cannot fully define hidden surfaces, exact rear geometry, interior page construction, or every side angle. For the first pass, recreate the visible hero view as closely as possible and make reasonable symmetrical assumptions for unseen parts.

## Visible features to reproduce

- Upright hand-bound book form
- Deep forest green cloth panels
- Warm tan leather rounded central spine
- Tan leather outer corner pieces
- Diagonal joins between leather corners and green cloth
- Thick boards with slight bevels
- Subtle handmade imperfections
- Leather grain, mottling, and edge wear
- Cloth weave and matte fabric roughness
- Symmetry around the central spine from the hero camera

## First Blender pass

The first production pass should create a static hero-view model before page animation.

Steps:

1. Add the reference image as a Blender reference image or background.
2. Set the frame range to 1 to 780.
3. Add the six required scene timeline markers.
4. Build separate editable objects for the covers, spine, leather corners, cloth panels, and page block.
5. Match the camera to the supplied hero-view photo.
6. Add named procedural materials for tan leather, dark green cloth, warm paper, and contact embossing.
7. Add named key, fill, and rim lights.
8. Save the file under `assets/source/blender/`.

## First Claude Code prompt

```text
Use the blender-storybook-assets skill. The supplied image at assets/references/photos/custom_binding-1.jpeg is the approved visual target. Inspect the current Blender scene first. State the plan before making changes. Then perform only the first safe production pass: set frame range to 1 to 780, add the six required timeline markers, create a reference-aligned static blockout of the hand-bound book, create named materials for tan leather and dark green cloth, add named camera and lights, and save the Blender file. Recreate the visible hero view as closely as possible: rounded tan leather central spine, deep green cloth panels, tan leather outer corners, diagonal corner joins, bevelled handmade board edges, and tactile material grain. Do not attempt final page flip animation yet.
```
