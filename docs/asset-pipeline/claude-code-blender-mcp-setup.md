# Claude Code Blender MCP Setup

Status: active
Purpose: make Claude Code capable of controlling Blender through the selected Blender MCP workflow for Ethan.

## Goal

Set up an environment where Claude Code CLI can use natural language prompts to inspect, create, edit, animate, render, and export the Ethan 3D storybook assets through Blender.

## Selected framework

- Primary MCP framework: `ahujasid/blender-mcp`
- Creative source of truth: Blender
- Runtime consumer: Next.js web app

## Required local tools

Install or confirm:

- Blender
- Claude Code CLI
- Python available to `uvx`
- `uv` or `uvx`
- Git
- The Ethan repo checked out locally

## Required Claude Code skill

This repo includes a project skill:

```text
.claude/skills/blender-storybook-assets/SKILL.md
```

Claude Code should use this skill for any request involving Blender, the storybook asset, book animation, render sequences, frame exports, or visual asset production.

## High level setup sequence

1. Open Blender.
2. Install the Blender MCP add-on from the selected framework.
3. Enable the add-on in Blender preferences.
4. Start the Blender MCP server from inside Blender if required by the add-on.
5. Add the MCP server to Claude Code.
6. Verify Claude Code can see the Blender MCP tools.
7. Ask Claude Code to inspect the current Blender scene without editing.
8. Only then start asset generation.

## Claude Code MCP registration

The practical command from the selected Blender MCP project is:

```text
claude mcp add blender uvx blender-mcp
```

Run this from a normal terminal after Claude Code is installed.

## First verification prompt

Use this before asking Claude to create anything:

```text
Confirm that the Blender MCP server is available. Then inspect the current Blender scene and list objects, materials, cameras, lights, timeline markers, render settings, and output paths. Do not change anything yet.
```

Expected result:

- Claude can access Blender MCP tools
- Claude can inspect the open Blender scene
- Claude lists scene contents
- Claude does not edit the scene during verification

## First production prompt

After verification succeeds:

```text
Use the blender-storybook-assets skill. Read AGENTS.md and the Blender asset pipeline docs. Then inspect the current Blender scene again and propose the first safe production pass for the Ethan hand-bound book asset. The target is a premium scroll-scrubbed storybook animation with dark green cloth panels, tan leather rounded spine, tan leather corners, thick off-white pages, realistic materials, page flip animation, and a final contact back cover.
```

## Safety rules

Blender MCP can execute local code through Blender and Python. Treat it as local code execution.

Rules:

- Use local MCP only
- Do not expose Blender MCP to the public internet
- Avoid unreviewed forks
- Save before destructive changes
- Keep source `.blend` files separate from exported web assets
- Do not allow the web app to depend on Blender or MCP at runtime

## Troubleshooting checklist

If Claude cannot see Blender:

1. Confirm Blender is open.
2. Confirm the Blender MCP add-on is installed and enabled.
3. Confirm the MCP server is started in Blender if required.
4. Confirm `claude mcp list` shows the `blender` server.
5. Restart Claude Code after adding the MCP server.
6. Restart Blender after installing the add-on.
7. Retry the verification prompt before editing.

## Done state

The environment is ready when Claude Code can:

- Detect the Blender MCP server
- Inspect the current Blender scene
- List current objects and materials
- Create or edit objects only after approval
- Save the `.blend` file
- Prepare the asset for render sequence export
