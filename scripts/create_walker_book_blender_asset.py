import math
import os
from pathlib import Path

import bpy
from mathutils import Vector


REPO = Path(r"C:\Users\marku\OneDrive\Documents\GitHub\Ethan")
REF_DIR = REPO / "assets" / "generations" / "walker_bookworks_all_frames_opening_turning_closing"
SOURCE_DIR = REPO / "assets" / "source" / "blender"
VERSION_DIR = SOURCE_DIR / "versions"
TEXTURE_DIR = REPO / "assets" / "textures" / "contact-cover"
RENDER_DIR = REPO / "assets" / "renders" / "book-hero-sequence"

MASTER_BLEND = SOURCE_DIR / "ethan-book-main.blend"
VERSION_BLEND = VERSION_DIR / "ethan-book-main-v001.blend"


def ensure_dirs():
    for path in [
        SOURCE_DIR,
        VERSION_DIR,
        TEXTURE_DIR,
        RENDER_DIR / "master-png",
        RENDER_DIR / "web-webp",
        RENDER_DIR / "preview-video",
    ]:
        path.mkdir(parents=True, exist_ok=True)


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def mat_principled(name, color, roughness=0.75, metallic=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = color
        bsdf.inputs["Roughness"].default_value = roughness
        bsdf.inputs["Metallic"].default_value = metallic
    return mat


def add_cube(name, loc, scale, mat=None, bevel=0.03):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if mat:
        obj.data.materials.append(mat)
    if bevel:
        mod = obj.modifiers.new(f"{name}_soft_bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 6
        mod.affect = "EDGES"
        obj.modifiers.new(f"{name}_weighted_normals", "WEIGHTED_NORMAL")
    return obj


def add_cylinder(name, loc, radius, depth, mat=None, rot=(0, 0, 0), vertices=48):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc, rotation=rot)
    obj = bpy.context.object
    obj.name = name
    if mat:
        obj.data.materials.append(mat)
    obj.modifiers.new(f"{name}_weighted_normals", "WEIGHTED_NORMAL")
    return obj


def create_triangle_prism(name, verts, depth, mat):
    mesh = bpy.data.meshes.new(f"{name}_Mesh")
    z0 = -depth / 2
    z1 = depth / 2
    v = [(x, y, z0) for x, y in verts] + [(x, y, z1) for x, y in verts]
    faces = [(0, 1, 2), (3, 5, 4), (0, 3, 4, 1), (1, 4, 5, 2), (2, 5, 3, 0)]
    mesh.from_pydata(v, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    bevel = obj.modifiers.new(f"{name}_raised_edge_bevel", "BEVEL")
    bevel.width = 0.018
    bevel.segments = 3
    obj.modifiers.new(f"{name}_weighted_normals", "WEIGHTED_NORMAL")
    return obj


def add_text(name, text, loc, rot, size, mat, align="CENTER"):
    curve = bpy.data.curves.new(name, "FONT")
    curve.body = text
    curve.align_x = align
    curve.align_y = "CENTER"
    curve.size = size
    curve.extrude = 0.006
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.location = loc
    obj.rotation_euler = rot
    obj.data.materials.append(mat)
    return obj


def parent_keep_transform(obj, parent):
    world = obj.matrix_world.copy()
    obj.parent = parent
    obj.matrix_parent_inverse = parent.matrix_world.inverted()
    obj.matrix_world = world


def create_curved_page(name, flip_index, mat):
    # Grid page with a subtle upward curl near the free edge.
    width = 2.08
    height = 3.05
    cols = 16
    rows = 8
    verts = []
    faces = []
    for iy in range(rows + 1):
        y = -height / 2 + height * iy / rows
        for ix in range(cols + 1):
            x = width * ix / cols
            curl = 0.10 * (ix / cols) ** 2
            wave = 0.015 * math.sin(iy * 1.7 + flip_index)
            verts.append((x, y, curl + wave))
    for iy in range(rows):
        for ix in range(cols):
            i = iy * (cols + 1) + ix
            faces.append((i, i + 1, i + cols + 2, i + cols + 1))
    mesh = bpy.data.meshes.new(f"{name}_Mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = (-0.02, 0, 0.145 + flip_index * 0.012)
    obj.rotation_euler = (0, 0, 0)
    obj.data.materials.append(mat)
    obj.modifiers.new(f"{name}_paper_smooth", "WEIGHTED_NORMAL")
    return obj


def add_noise_nodes(mat, scale=35, bump_strength=0.08):
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    bsdf = nodes.get("Principled BSDF")
    noise = nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = scale
    noise.inputs["Detail"].default_value = 12
    noise.inputs["Roughness"].default_value = 0.62
    bump = nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = bump_strength
    bump.inputs["Distance"].default_value = 0.06
    if bsdf:
        links.new(noise.outputs["Fac"], bump.inputs["Height"])
        links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])


def add_reference_planes():
    coll = bpy.data.collections.new("Reference_All_Source_Images")
    bpy.context.scene.collection.children.link(coll)
    image_paths = sorted(REF_DIR.glob("*.png"))
    x0 = -5.2
    for i, path in enumerate(image_paths):
        img = bpy.data.images.load(str(path))
        mat = bpy.data.materials.new(f"REF_MAT_{path.stem}")
        mat.use_nodes = True
        mat.blend_method = "BLEND"
        nodes = mat.node_tree.nodes
        bsdf = nodes.get("Principled BSDF")
        tex = nodes.new("ShaderNodeTexImage")
        tex.image = img
        if bsdf:
            mat.node_tree.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
            mat.node_tree.links.new(tex.outputs["Alpha"], bsdf.inputs["Alpha"])
        bpy.ops.mesh.primitive_plane_add(size=1, location=(x0 + (i % 5) * 1.25, 3.0 + (i // 5) * 0.85, 1.15))
        obj = bpy.context.object
        obj.name = f"Reference_{i + 1:02d}_{path.stem}"
        obj.scale = (0.55, 0.36, 1)
        obj.rotation_euler = (math.radians(70), 0, 0)
        obj.data.materials.append(mat)
        for c in obj.users_collection:
            c.objects.unlink(obj)
        coll.objects.link(obj)


def animate_rotation(obj, frames):
    obj.rotation_euler = (0, 0, math.radians(-18))
    obj.keyframe_insert("rotation_euler", frame=frames[0])
    obj.rotation_euler = (0, 0, math.radians(0))
    obj.keyframe_insert("rotation_euler", frame=frames[1])


def main():
    ensure_dirs()
    clear_scene()

    cloth = mat_principled("MAT_Dark_Green_Cloth", (0.018, 0.075, 0.048, 1), 0.92)
    leather = mat_principled("MAT_Tan_Leather_Grain", (0.66, 0.28, 0.07, 1), 0.68)
    paper = mat_principled("MAT_Warm_Off_White_Paper", (0.91, 0.84, 0.68, 1), 0.83)
    edge = mat_principled("MAT_Page_Edge_Shadow", (0.69, 0.61, 0.47, 1), 0.9)
    emboss = mat_principled("MAT_Contact_Emboss", (0.86, 0.61, 0.24, 1), 0.46, 0.45)
    seam = mat_principled("MAT_Dark_Cloth_Seam", (0.006, 0.045, 0.035, 1), 0.94)
    add_noise_nodes(cloth, 68, 0.045)
    add_noise_nodes(leather, 42, 0.085)
    add_noise_nodes(paper, 28, 0.025)

    book = bpy.data.collections.new("Ethan_Book_Production_Model")
    bpy.context.scene.collection.children.link(book)

    # Main book pieces: closed dimensions are x=width across spread, y=height, z=thickness.
    page_block = add_cube("Book_Page_Block", (0.22, 0, 0.03), (3.85, 2.92, 0.30), paper, 0.04)
    page_edge = add_cube("Page_Block_Edge_Lines", (2.22, 0, 0.035), (0.055, 2.88, 0.32), edge, 0.015)
    front = add_cube("Cover_Front_Green_Cloth", (0.22, 0, 0.245), (3.55, 3.16, 0.105), cloth, 0.055)
    back = add_cube("Cover_Back_Green_Cloth", (0.22, 0, -0.14), (3.55, 3.16, 0.105), cloth, 0.055)
    spine = add_cylinder("Spine_Tan_Leather_Rounded", (-2.04, 0, 0.05), 0.22, 3.20, leather, rot=(math.radians(90), 0, 0))
    spine.scale.x = 0.64
    groove1 = add_cube("Spine_Raised_Hinge_Left", (-1.78, 0, 0.14), (0.055, 3.16, 0.33), leather, 0.025)
    groove2 = add_cube("Spine_Raised_Hinge_Right", (-2.24, 0, 0.14), (0.045, 3.16, 0.31), leather, 0.025)

    # Leather corner/side panels matching the references.
    add_cube("Leather_Spine_Front_Strip", (-1.38, 0, 0.31), (0.42, 3.15, 0.06), leather, 0.025)
    add_cube("Leather_Fore_Edge_Right_Strip", (1.88, 0, 0.31), (0.36, 3.12, 0.06), leather, 0.025)
    tri1 = create_triangle_prism("Leather_Corners_Front_Top_Right", [(1.05, 1.57), (2.02, 1.57), (2.02, 0.72)], 0.08, leather)
    tri1.location.z = 0.355
    tri2 = create_triangle_prism("Leather_Corners_Front_Bottom_Right", [(1.05, -1.57), (2.02, -1.57), (2.02, -0.72)], 0.08, leather)
    tri2.location.z = 0.355
    tri3 = create_triangle_prism("Leather_Corners_Back_Top_Left", [(-2.02, 1.57), (-1.05, 1.57), (-2.02, 0.72)], 0.08, leather)
    tri3.location.z = -0.205
    tri4 = create_triangle_prism("Leather_Corners_Back_Bottom_Left", [(-2.02, -1.57), (-1.05, -1.57), (-2.02, -0.72)], 0.08, leather)
    tri4.location.z = -0.205

    # Group empties with required names for corners.
    for name, members in {
        "Leather_Corners_Front": [tri1, tri2],
        "Leather_Corners_Back": [tri3, tri4],
    }.items():
        empty = bpy.data.objects.new(name, None)
        bpy.context.collection.objects.link(empty)
        for obj in members:
            obj.parent = empty

    # Cloth seam strips; these outline the inset cloth panel without filling it.
    for prefix, z in [("Front", 0.392), ("Back", -0.263)]:
        add_cube(f"{prefix}_Cloth_Seam_Top", (0.24, 1.39, z), (2.70, 0.025, 0.014), seam, 0.006)
        add_cube(f"{prefix}_Cloth_Seam_Bottom", (0.24, -1.39, z), (2.70, 0.025, 0.014), seam, 0.006)
        add_cube(f"{prefix}_Cloth_Seam_Left", (-1.12, 0, z), (0.025, 2.78, 0.014), seam, 0.006)
        add_cube(f"{prefix}_Cloth_Seam_Right", (1.60, 0, z), (0.025, 2.78, 0.014), seam, 0.006)
    for i in range(18):
        y = -1.36 + i * 0.16
        add_cube(f"Page_Edge_Line_{i + 1:02d}", (2.255, y, 0.22), (0.018, 0.018, 0.26), edge, 0.002)

    pages = []
    for i in range(7):
        page = create_curved_page(f"Pages_Animated_Stack_Page_{i + 1:02d}", i, paper)
        pages.append(page)
    stack_empty = bpy.data.objects.new("Pages_Animated_Stack", None)
    bpy.context.collection.objects.link(stack_empty)
    for p in pages:
        p.parent = stack_empty

    labels = [
        ("Page_Label_Intro", "INTRO", (-0.78, 0.68, 0.19)),
        ("Page_Label_Featured_Work", "FEATURED WORK", (0.76, 0.68, 0.19)),
        ("Page_Label_AI_Security", "AI SECURITY", (0.76, 0.18, 0.20)),
        ("Page_Label_Cloud_Security", "CLOUD SECURITY", (0.76, -0.32, 0.21)),
        ("Page_Label_Portfolio_Proof", "PORTFOLIO PROOF", (0.76, -0.82, 0.22)),
    ]
    for name, text, loc in labels:
        add_text(name, text, loc, (0, 0, 0), 0.105, emboss)

    add_text(
        "Front_Cover_Subtle_Title",
        "WALKER\nBOOKWORKS",
        (0.22, 0.0, 0.415),
        (0, 0, 0),
        0.16,
        emboss,
    )

    add_text(
        "Contact_Back_Cover_Text",
        "MARKUS WALKER\nwalker bookworks\nhello@example.com",
        (-0.62, 0, -0.32),
        (math.radians(180), 0, 0),
        0.105,
        emboss,
    )

    # Parent all production objects to a rig empty so rotate reveal is scroll friendly.
    rig = bpy.data.objects.new("Rig_Book_Scroll_Reveal", None)
    bpy.context.collection.objects.link(rig)
    for obj in list(bpy.context.scene.objects):
        if obj.name.startswith("Camera") or obj.name.startswith("Light") or obj.name.startswith("Reference_"):
            continue
        if obj.parent is None and obj.name != rig.name:
            obj.parent = rig

    # Hinge empties: objects are named and animation-ready even though this first pass keeps geometry simple.
    front_hinge = bpy.data.objects.new("Hinge_Front_Cover_Spine_Edge", None)
    bpy.context.collection.objects.link(front_hinge)
    front_hinge.location = (-1.42, 0, 0.245)
    front.parent = front_hinge
    front.location = (1.64, 0, 0)
    front.rotation_euler = (0, 0, 0)
    front_hinge.parent = rig
    for name in [
        "Leather_Spine_Front_Strip",
        "Leather_Fore_Edge_Right_Strip",
        "Leather_Corners_Front_Top_Right",
        "Leather_Corners_Front_Bottom_Right",
        "Front_Cloth_Seam_Top",
        "Front_Cloth_Seam_Bottom",
        "Front_Cloth_Seam_Left",
        "Front_Cloth_Seam_Right",
        "Front_Cover_Subtle_Title",
    ]:
        obj = bpy.data.objects.get(name)
        if obj:
            parent_keep_transform(obj, front_hinge)

    # Timeline markers.
    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = 780
    for name, frame in [
        ("SCENE_01_ROTATE_REVEAL", 1),
        ("SCENE_02_COVER_OPEN", 121),
        ("SCENE_03_FIRST_PAGE", 221),
        ("SCENE_04_PAGE_FLIPS", 281),
        ("SCENE_05_BACK_COVER", 601),
        ("SCENE_06_CONTACT_HOLD", 721),
    ]:
        scene.timeline_markers.new(name, frame=frame)

    animate_rotation(rig, (1, 120))
    front_hinge.rotation_euler = (0, 0, 0)
    front_hinge.keyframe_insert("rotation_euler", frame=121)
    front_hinge.rotation_euler = (0, math.radians(-118), 0)
    front_hinge.keyframe_insert("rotation_euler", frame=220)

    for i, p in enumerate(pages):
        start = 281 + i * 38
        p.rotation_euler = (0, 0, 0)
        p.keyframe_insert("rotation_euler", frame=start)
        p.rotation_euler = (0, math.radians(-172), 0)
        p.keyframe_insert("rotation_euler", frame=start + 34)

    rig.rotation_euler = (0, 0, math.radians(0))
    rig.keyframe_insert("rotation_euler", frame=600)
    rig.rotation_euler = (0, math.radians(0), math.radians(180))
    rig.keyframe_insert("rotation_euler", frame=720)
    rig.keyframe_insert("rotation_euler", frame=780)

    # Camera and lighting.
    bpy.ops.object.light_add(type="AREA", location=(-2.2, -4.0, 5.0))
    key = bpy.context.object
    key.name = "Light_Key_Warm"
    key.data.energy = 650
    key.data.size = 4.0
    bpy.ops.object.light_add(type="AREA", location=(3.2, 3.0, 3.2))
    fill = bpy.context.object
    fill.name = "Light_Fill_Soft"
    fill.data.energy = 130
    fill.data.size = 5.2
    bpy.ops.object.light_add(type="POINT", location=(-3.5, 2.7, 2.8))
    rim = bpy.context.object
    rim.name = "Light_Rim_Subtle"
    rim.data.energy = 95

    bpy.ops.object.camera_add(location=(0.3, -5.2, 3.0), rotation=(math.radians(58), 0, math.radians(3)))
    cam = bpy.context.object
    cam.name = "Camera_Hero_Scroll"
    cam.data.lens = 55
    scene.camera = cam

    add_reference_planes()

    # Render settings.
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 96
    scene.render.resolution_x = 1280
    scene.render.resolution_y = 720
    scene.render.film_transparent = False
    scene.render.filepath = str(RENDER_DIR / "master-png" / "book_hero_")
    scene.render.image_settings.file_format = "PNG"
    scene.view_settings.view_transform = "Filmic"
    scene.view_settings.look = "Medium High Contrast"
    scene.world.color = (0.78, 0.75, 0.69)

    # Move objects into production collection when possible.
    for obj in list(bpy.context.scene.objects):
        if obj.name.startswith("Reference_"):
            continue
        if obj.name not in book.objects:
            try:
                book.objects.link(obj)
            except RuntimeError:
                pass

    bpy.ops.wm.save_as_mainfile(filepath=str(MASTER_BLEND))
    bpy.ops.wm.save_as_mainfile(filepath=str(VERSION_BLEND))


if __name__ == "__main__":
    main()
