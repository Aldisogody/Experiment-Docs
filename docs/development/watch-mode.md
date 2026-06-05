# Watch Mode & Clipboard

## Starting a variation watch

```bash
pnpm start 0   # watches v1
pnpm start 1   # watches v2
pnpm start 2   # watches v3
```

The numeric argument is zero-indexed: `0` targets `src/js/v1/index.jsx`, `1` targets `src/js/v2/index.jsx`, and so on.

Internally, `pnpm start 0` delegates to the package-owned `exp-start` binary, which runs the build watcher with:

```bash
exp-build --watch -e0
```

The `-e0` flag tells the build script to focus on variation 1 and enable clipboard copy on each successful rebuild.

## Clipboard copy

On every save, the IIFE bundle is automatically copied to your clipboard:

| OS | Tool used |
|---|---|
| macOS | `pbcopy` (built-in) |
| Linux | `xclip -selection clipboard` |
| Windows | `clip` (built-in) |

If the clipboard tool is unavailable, the build continues silently — you'll just need to copy the bundle manually from `dist/v1/v1.js`.

::: tip Linux: install xclip
```bash
# Ubuntu / Debian
sudo apt-get install xclip

# Arch
sudo pacman -S xclip
```
:::

## Pasting into Adobe Target

1. Open your Adobe Target activity and navigate to the custom code editor for the variation you're developing.
2. Switch to your terminal — the clipboard already contains the latest bundle.
3. Select all existing content in the code editor and paste.
4. Click **Save** in Adobe Target and refresh your preview page.

::: info How the bundle works
The IIFE bundle registers itself under `window.sgd` (or your chosen namespace). Adobe Target's custom code editor accepts raw JavaScript — no module loader is required.
:::

## Watching all variations

To rebuild all variations on every save without clipboard copy:

```bash
pnpm dev
```

Use `pnpm dev` when you want to verify that all variations build cleanly. Use `pnpm start N` when actively iterating on a single variation.
