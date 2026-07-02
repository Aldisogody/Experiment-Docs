---
title: Error Reference
---

# Error Reference

## `Usage: experiment-framework <project-name>`

The project argument is missing.

```bash
npx @sogody/experiment-framework my-experiment
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

Production builds run a read-only Biome check. Run:

```bash
pnpm lint:fix
pnpm ci:lint
```

Fix remaining errors, including unused variables and `console` calls.

## `IIFE bundle not found`

Playwright loads `dist/v1-index.jsx`. Run E2E through:

```bash
pnpm test:e2e
```

That command builds before starting Playwright.

## `injectTargetElement: unsupported selector`

Generated E2E helpers can create only a simple class target such as `.target-selector`. If `selectors.primary` is complex, ensure the real page contains it or customize `injectTargetElement()` for the selector shape.

## `Unknown market`

`e2e/config.js#getUrl()` could not find the requested country code in `urlsConfig.markets`. Use a configured country code, not only the parent group code.

## `Bundle did not register window.<globalObject>["<package-name>"]`

`pnpm live` injected the bundle but `window[globalObject][packageName]` was not set within the wait window. Common causes:

- The variation entry point does not call `runScript`
- `package.json` `name` does not match the registered key
- `experiment.config.js` `globalObject` does not match the runtime namespace
- The bundle threw before registration completed

Fix the variation entry point and confirm the built bundle executes without errors in the browser console.

## `No target matched selectors`

Live injection could not match `selectors.primary` or any fallback. This is informational only — injection still runs when the bundle registers on `window[globalObject][packageName]`. Verify the target URL, page state, and selector chain when you need mount-point context in the overlay.

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

## Invalid project metadata for AI initialization

Run AI initialization commands from a generated experiment project root. They
can report:

- `package.json not found. Run this command from a generated experiment project root.`
- `package.json is not valid JSON.`
- `package.json must contain a string "name" field.`
- `No experiment.config.js or src/config.js found. Run this command from a generated experiment project root.`

Restore valid package metadata and experiment configuration.

## `Unknown option "<option>". Supported option: --force`

The `init-claude` and `init-agents` commands accept only `--force`. Through a
generated package script, include the separator:

```bash
pnpm init-agents -- --force
```

## Chromium executable is missing

Install the browser used by live injection and E2E:

```bash
pnpm dlx playwright install chromium
```

## Clipboard does not update

macOS and Windows use built-in clipboard commands. Linux requires `xclip`. The watcher still builds if clipboard copy fails, so copy `dist/vN-index.jsx` manually or install `xclip`.
