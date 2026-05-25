# Ethan Book Hero Asset Notes

## Source file

`assets/source/blender/ethan-book-main.blend`

Versioned copy: `assets/source/blender/versions/ethan-book-main-v001.blend`

Generation script: `scripts/create_walker_book_blender_asset.py`

## Render date

2026-05-24

## Blender version

Blender 5.1.2

## Frame count

780 frames.

## Resolution

Scene render settings are 1280 x 720 PNG for preview/master setup.

## Materials

- `MAT_Dark_Green_Cloth`: dark green rough cloth with procedural bump.
- `MAT_Tan_Leather_Grain`: tan leather with procedural grain bump.
- `MAT_Warm_Off_White_Paper`: warm paper with subtle fibre bump.
- `MAT_Page_Edge_Shadow`: darker page-edge material.
- `MAT_Contact_Emboss`: metallic warm emboss material for cover and contact text.

## Camera

`Camera_Hero_Scroll`, 55mm, angled cinematic close-up.

## Lights

- `Light_Key_Warm`
- `Light_Fill_Soft`
- `Light_Rim_Subtle`

## Animation markers

- `SCENE_01_ROTATE_REVEAL`: frame 1
- `SCENE_02_COVER_OPEN`: frame 121
- `SCENE_03_FIRST_PAGE`: frame 221
- `SCENE_04_PAGE_FLIPS`: frame 281
- `SCENE_05_BACK_COVER`: frame 601
- `SCENE_06_CONTACT_HOLD`: frame 721

## Web sequence output

Master PNG output path is configured as `assets/renders/book-hero-sequence/master-png/book_hero_`.

Preview stills rendered:

- `assets/renders/book-hero-sequence/master-png/book_hero_preview_0001.png`
- `assets/renders/book-hero-sequence/master-png/book_hero_preview_0220.png`
- `assets/renders/book-hero-sequence/master-png/book_hero_preview_0721.png`

## Reference usage

All 10 PNGs from `assets/generations/walker_bookworks_all_frames_opening_turning_closing` are loaded into the scene as named reference planes in the `Reference_All_Source_Images` collection.

## Known issues

This is a first production blockout/refinement pass, not a final render sequence. Page turns and final back-cover contact reveal need a dedicated animation pass before rendering all 780 frames.

## Next pass recommendations

- Bind all cover trim and contact details to dedicated front/back cover rigs.
- Replace placeholder contact text with final approved details.
- Add higher fidelity leather tooling and cloth weave displacement.
- Tune the final back-cover reveal for readable contact information.
- Render a short viewport or low-sample motion preview before the full master sequence.
