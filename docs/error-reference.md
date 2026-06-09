---
title: Error Reference
---

# Error Reference

## `Usage: create-experiment <project-name>`

The project argument is missing.

```bash
npx create-experiment my-experiment
```

## `Failed to load experiment.config.js`

Run the command from the generated project root and check that `experiment.config.js` exports a default object with `globalObject`.

## `No variation entry points found`

The build expects `src/js/vN/index.jsx`. Restore `v1/index.jsx` or run from the correct directory.

## `-eN is out of range`

The zero-based watch index is larger than the number of discovered variation folders. For `v2`, use:

```bash
pnpm start 1
```

## `Build aborted - fix lint errors before bundling`

Production builds run `biome check src`. Run:

```bash
pnpm format
pnpm lint
```

Fix remaining errors, including unused variables and `console` calls.

## `Adobe Target unsafe placeholder syntax found` {#adobe-target-unsafe-placeholder-syntax}

The emitted JavaScript still contains `${`, which Adobe Target can treat as placeholder syntax. Avoid constructing literal placeholders with template literals or escaped string fragments. Keep approved Target placeholders as plain quoted strings and rebuild.

## `IIFE bundle not found`

Playwright loads `dist/v1/v1.js`. Run E2E through:

```bash
pnpm test:e2e
```

That command builds before starting Playwright.

## `injectTargetElement: unsupported selector`

Generated E2E helpers can create only a simple class target such as `.target-selector`. If `selectors.primary` is complex, ensure the real page contains it or customize `injectTargetElement()` for the selector shape.

## `Unknown market`

`e2e/config.js#getUrl()` could not find the requested country code in `urlsConfig.markets`. Use a configured country code, not only the parent group code.

## `No target matched selectors`

Live injection tried `selectors.primary` and every fallback without finding an element. Verify the target URL, page state, and selector chain.

## `AGENTS.md already exists.`

`pnpm init-agents` found an existing `AGENTS.md` and left it unchanged. To intentionally replace the file, run:

```bash
pnpm init-agents -- --force
```

## `CLAUDE.md already exists.`

`pnpm init-claude` found an existing `CLAUDE.md` and left it unchanged. To intentionally replace the file, run:

```bash
pnpm init-claude -- --force
```

## Chromium executable is missing

Install the browser used by live injection and E2E:

```bash
pnpm dlx playwright install chromium
```

## Clipboard does not update

macOS and Windows use built-in clipboard commands. Linux requires `xclip`. The watcher still builds if clipboard copy fails, so copy `dist/vN/vN.js` manually or install `xclip`.
