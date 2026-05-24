# Blender Book Asset Generation Instructions

Status: active
Owner: Markus Walker
Purpose: define how to use Blender to create the Ethan book assets for the scrollytelling website.

## Outcome

Use Blender to generate the complete visual asset set needed for the Ethan website.

The target experience is a cinematic hand-bound book sequence:

1. Closed book rotates into view
2. Front cover opens
3. Pages flip through content sections
4. Content pages hold long enough for scroll sections
5. Book closes or settles on the back cover
6. Contact information appears on the final back cover

The website should receive web-ready assets that can be scrubbed by scroll. The first production path is a rendered image sequence. Live 3D export is optional.

## Required deliverables

The Blender work is complete only when these deliverables exist:

| Deliverable | Required | Purpose |
| --- | --- | --- |
| Master Blender file | Yes | Creative source of truth |
| Incremental Blender backups | Yes | Safe rollback points |
| Named materials | Yes | Agent readable editing |
| Named camera | Yes | Repeatable renders |
| Named lights | Yes | Repeatable renders |
| Animation markers | Yes | Map scroll sections to frames |
| Master PNG frame sequence | Yes | Highest quality render output |
| Web WebP or AVIF frame sequence | Yes | Runtime scroll sequence |
| Low resolution preview MP4 | Yes | Fast review only |
| Contact back cover texture | Yes | Final call to action |
| Optional GLB export | Optional | Only if live 3D is needed |

## Source and runtime folders

Use this structure inside the repo:

```text
assets/
  source/
    blender/
      ethan-book-main.blend
      versions/
  renders/
    book-hero-sequence/
      master-png/
      web-webp/
      preview-video/
  textures/
    cloth/
    leather/
    pages/
    contact-cover/
  references/
    photos/
    moodboards/
public/
  sequences/
    book-hero/
```

The blank Blender file that was manually added under `assets/` should be moved into `assets/source/blender/` if it is not already there.

## Blender scene naming rules

Agents must use clear object names. Do not leave important objects named Cube, Plane, or Material.

Required object names:

| Object | Name |
| --- | --- |
| Book body | `Book_Page_Block` |
| Front cover | `Cover_Front_Green_Cloth` |
| Back cover | `Cover_Back_Green_Cloth` |
| Spine | `Spine_Tan_Leather_Rounded` |
| Front leather corners | `Leather_Corners_Front` |
| Back leather corners | `Leather_Corners_Back` |
| Page stack | `Pages_Animated_Stack` |
| Hero camera | `Camera_Hero_Scroll` |
| Key light | `Light_Key_Warm` |
| Fill light | `Light_Fill_Soft` |
| Rim light | `Light_Rim_Subtle` |
| Contact cover text | `Contact_Back_Cover_Text` |

Required material names:

| Material | Name |
| --- | --- |
| Green cloth | `MAT_Dark_Green_Cloth` |
| Tan leather | `MAT_Tan_Leather_Grain` |
| Page paper | `MAT_Warm_Off_White_Paper` |
| Page edge | `MAT_Page_Edge_Shadow` |
| Gold or deboss text | `MAT_Contact_Emboss` |

## Stage 1: Reference setup

Open the physical book reference image in Blender as a reference image or keep it visible beside Blender.

The model should match these visible characteristics:

- Dark green cloth panels
- Tan leather spine
- Tan leather corner pieces
- Rounded spine
- Handmade material texture
- Thick physical page block
- Slight imperfections rather than perfect synthetic edges

Agent prompt:

```text
Inspect the reference image and create a production scene plan for a hand-bound book asset. The book must have dark green cloth panels, tan leather spine, tan leather corner pieces, a rounded spine, visible page block thickness, and handmade material variation. The model must be built as separate named objects suitable for cover opening and page flip animation.
```

## Stage 2: Blockout

Create the simplest usable book first.

Required blockout:

- Page block as a thick rectangular cuboid
- Front cover as a separate hinged slab
- Back cover as a separate slab
- Rounded spine as separate geometry
- Leather corner pieces as separate geometry
- Basic page planes for flip animation
- Camera and lights

Do not start with complex page simulation. First make the whole object read correctly from the hero camera.

Agent prompt:

```text
Create a clean blockout of the Ethan hand-bound book. Use separate named objects for page block, front cover, back cover, rounded leather spine, leather corners, and a small set of animated page planes. Set the origin of the front cover at its hinge so it can open. Set the origin of each animated page at the spine edge so each page can flip. Add a hero camera and warm studio lights.
```

Acceptance check:

- The book silhouette matches the reference
- The cover can rotate independently
- Page objects can rotate independently
- The camera sees the whole book clearly

## Stage 3: Materials

Create the material system before detailed animation.

Green cloth material:

- Dark green base colour
- Fine weave bump texture
- High roughness
- Slight colour variation

Tan leather material:

- Warm tan base colour
- Grain bump texture
- Medium roughness
- Subtle darker worn areas near edges

Paper material:

- Warm off-white colour
- Low contrast fibre noise
- Slight page edge shadow

Contact material:

- Embossed or debossed effect preferred
- Gold, dark brown, or pressed leather effect acceptable
- Must remain legible on the back cover

Agent prompt:

```text
Create named production materials for the book. The green cover material must look like woven cloth. The tan spine and corner material must look like warm leather with grain, variation, and edge wear. The page material must look like warm off-white paper with subtle fibre variation. Add a contact text material that can appear embossed or debossed on the tan leather back cover.
```

Acceptance check:

- Cloth and leather are visibly different
- Leather has grain and warmth
- Paper does not look flat white
- Contact text material is readable

## Stage 4: Geometry refinement

Refine the book after the basic material read is working.

Required refinements:

- Rounded spine profile
- Slight bevels on covers
- Slight bevels on page block
- Leather corner triangles or angled panels
- Subtle page edge lines
- Small handmade imperfections
- Cloth panel inset or seam detail

Agent prompt:

```text
Refine the book geometry for a premium cinematic close-up. Add bevels, rounded spine shaping, visible leather corner panels, cloth panel seams, page block edge lines, and subtle handmade imperfections. Keep all parts named and editable. Do not merge animated covers or animated pages into one mesh.
```

Acceptance check:

- The book feels crafted and physical
- Edges catch light nicely
- The spine feels rounded
- The page block looks thick enough to flip through

## Stage 5: Rigging for scroll sections

Rig for scroll-controlled sections, not a single fixed movie.

Required animation segments:

| Segment | Frame range | Purpose |
| --- | --- | --- |
| Rotate reveal | 1 to 120 | Book rotates into view |
| Cover open | 121 to 220 | Front cover opens |
| First page reveal | 221 to 280 | First content page appears |
| Page flips | 281 to 600 | Pages flip between sections |
| Final back cover | 601 to 720 | Back cover or rear surface is revealed |
| Contact hold | 721 to 780 | Contact details are readable |

These frame ranges are starting points. They can change later, but agents must keep named timeline markers.

Required timeline markers:

- `SCENE_01_ROTATE_REVEAL`
- `SCENE_02_COVER_OPEN`
- `SCENE_03_FIRST_PAGE`
- `SCENE_04_PAGE_FLIPS`
- `SCENE_05_BACK_COVER`
- `SCENE_06_CONTACT_HOLD`

Agent prompt:

```text
Set up a scroll-ready animation timeline for the book. Add named markers for rotate reveal, cover open, first page, page flips, back cover reveal, and contact hold. Animate the front cover opening around its spine hinge. Animate several page planes flipping from right to left. Keep each section long enough to scrub smoothly forward and backward.
```

Acceptance check:

- The animation scrubs cleanly in Blender
- Reverse playback does not look broken
- Page flips do not intersect badly from the hero camera
- Contact hold gives enough time for reading

## Stage 6: Page content system

Do not bake final page content too early.

Use page textures or SVG sources so the website content can be revised.

Recommended page sections:

1. Intro or identity
2. Featured work
3. AI and cybersecurity capability
4. Cloud and security engineering
5. Portfolio proof
6. Contact back cover

Agent prompt:

```text
Create placeholder page content surfaces for the book. Each page should accept a future texture or SVG. Use clean readable placeholder labels for Intro, Featured Work, AI Security, Cloud Security, Portfolio Proof, and Contact. Keep the text editable or replaceable through image textures.
```

Acceptance check:

- Page content can be replaced without rebuilding the whole book
- Content is readable from the camera
- Contact details can be updated separately

## Stage 7: Camera and lighting

Use cinematic lighting, but keep web readability.

Camera requirements:

- Camera name: `Camera_Hero_Scroll`
- Focal length: cinematic but not distorted
- Composition: book centred with enough breathing room for text overlays
- Movement: subtle only unless a section needs drama

Lighting requirements:

- Warm key light
- Soft fill light
- Subtle rim light
- No harsh blown highlights on leather
- Background should not distract from the book

Agent prompt:

```text
Create a premium studio lighting and camera setup for the book. Use warm soft light, subtle rim light, and a clean background. The camera should make the book feel cinematic and crafted without distortion. Leave room in the composition for website copy overlays.
```

Acceptance check:

- The book looks premium
- Contact text remains readable
- Cloth texture is visible
- Leather highlights are controlled

## Stage 8: Render settings

Start with fast previews. Move to final only after animation is approved.

Preview settings:

- Resolution: 1280 by 720
- Renderer: Eevee or Workbench preview if needed
- Purpose: motion and framing review only

Final master settings:

- Resolution: 1920 by 1080 or higher
- Renderer: Cycles preferred for final quality
- Transparent background optional
- Output format: PNG sequence
- Frame naming: `book_hero_0001.png`

Web output settings:

- Convert master PNG frames to WebP or AVIF
- Use a lower resolution version for mobile
- Keep a tiny preview video for review only

Agent prompt:

```text
Prepare render settings for the Ethan book sequence. Create a fast preview render setup and a final master PNG sequence setup. Use named output paths under assets/renders/book-hero-sequence. The master sequence should render clean frames suitable for conversion to WebP or AVIF for the website.
```

Acceptance check:

- Output paths are correct
- Frame sequence renders without missing frames
- Frames have consistent camera and lighting
- Master frames are separate from web-optimised frames

## Stage 9: Export for the web app

The main website asset should be an image sequence.

Required runtime artefacts:

```text
public/sequences/book-hero/
  desktop/
    book_hero_0001.webp
    book_hero_0002.webp
  mobile/
    book_hero_0001.webp
    book_hero_0002.webp
  manifest.json
```

The manifest should record:

- Frame count
- Width
- Height
- File extension
- Section frame ranges
- Fallback video path if one exists

Example manifest shape:

```json
{
  "sequenceName": "book-hero",
  "frameCount": 780,
  "extension": "webp",
  "desktop": {
    "width": 1920,
    "height": 1080,
    "path": "/sequences/book-hero/desktop/book_hero_####.webp"
  },
  "mobile": {
    "width": 960,
    "height": 540,
    "path": "/sequences/book-hero/mobile/book_hero_####.webp"
  },
  "sections": [
    { "name": "rotateReveal", "start": 1, "end": 120 },
    { "name": "coverOpen", "start": 121, "end": 220 },
    { "name": "firstPage", "start": 221, "end": 280 },
    { "name": "pageFlips", "start": 281, "end": 600 },
    { "name": "backCover", "start": 601, "end": 720 },
    { "name": "contactHold", "start": 721, "end": 780 }
  ]
}
```

## Stage 10: Agent pass sequence

Use this order when prompting an AI agent through Blender MCP:

1. Inspect current scene and list objects
2. Create or repair folder and object naming
3. Create blockout
4. Add materials
5. Refine geometry
6. Add rig pivots and origins
7. Add animation markers
8. Animate cover opening
9. Animate page flips
10. Add placeholder page content
11. Add contact back cover
12. Set camera and lighting
13. Render still preview
14. Render short motion preview
15. Render master sequence
16. Export web sequence
17. Write asset notes

Do not skip the inspection step. The agent must understand the current scene before editing it.

## First agent prompt to use

Use this as the first prompt after Blender MCP is connected:

```text
You are working inside the Ethan repo and Blender is the source of truth for the hero asset. Inspect the current Blender scene first. Then create a safe plan before making changes. The target is a premium hand-bound book matching the provided reference: dark green cloth panels, tan leather rounded spine, tan leather corners, thick off-white page block, realistic cloth and leather materials, and an animation-ready structure for a scroll-scrubbed website. Do not merge animated components. Use named objects, named materials, named camera, named lights, and timeline markers. The final output must support a rendered PNG master frame sequence and a web-optimised WebP or AVIF sequence.
```

## Main production prompt

Use this once the agent has inspected the scene:

```text
Build the Ethan hand-bound book asset in Blender. Create separate named objects for the page block, front cover, back cover, rounded tan leather spine, green cloth panels, tan leather corner pieces, and several animated page planes. Apply realistic named materials for dark green cloth, tan leather grain, warm off-white paper, and contact embossing. Set correct hinge origins for the front cover and page planes. Add warm cinematic studio lighting and a hero camera. Add timeline markers for rotate reveal, cover open, first page, page flips, back cover reveal, and contact hold. Save the Blender file as the master production source.
```

## Animation prompt

```text
Animate the Ethan book for scroll-scrubbed playback. Frames 1 to 120 should rotate the closed book into view. Frames 121 to 220 should open the front cover around the spine hinge. Frames 221 to 280 should reveal the first content page. Frames 281 to 600 should flip pages between content sections. Frames 601 to 720 should reveal the back cover. Frames 721 to 780 should hold on readable contact information. Make the animation smooth when scrubbed forward and backward.
```

## Quality review prompt

```text
Review the scene for production readiness. Check object names, material names, hinge origins, timeline markers, camera framing, lighting, geometry intersections, page readability, contact readability, and render output paths. List every issue found. Fix safe issues only after explaining the change.
```

## Render prompt

```text
Prepare final render output for the Ethan book hero sequence. Use the approved camera and lighting. Render a master PNG sequence to assets/renders/book-hero-sequence/master-png. Create a smaller preview video in assets/renders/book-hero-sequence/preview-video. Prepare instructions for converting the master frames to WebP or AVIF under public/sequences/book-hero.
```

## Done definition

The Blender asset is ready for website integration when:

- The `.blend` source file opens cleanly
- Objects and materials follow the naming rules
- The book visually matches the physical reference
- Cover and page animation scrub cleanly
- Timeline markers match website sections
- Contact information is readable on the final back cover
- Master PNG frames exist
- Web-optimised frames exist
- A manifest exists for the web sequence
- A preview video exists for quick review
- Asset notes document the final choices

## Asset notes template

Create `assets/renders/book-hero-sequence/ASSET_NOTES.md` with:

```text
# Ethan Book Hero Asset Notes

## Source file

## Render date

## Blender version

## Frame count

## Resolution

## Materials

## Camera

## Lights

## Animation markers

## Web sequence output

## Known issues

## Next pass recommendations
```

## Important rule

Blender is the creative master. The website consumes exported assets. Do not make the website depend on Blender or MCP at runtime.
