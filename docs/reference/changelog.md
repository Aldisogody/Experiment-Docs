# Changelog

This page summarizes changes that affect generated projects. The package repository's `CHANGELOG.md` is the release source of truth.

## Unreleased on `main`

No documented user-facing changes beyond the current package line.

## 2.2.0 - August 25, 2026

### Added

- Added `trackInView()` for viewport impressions. It supports shared `onceKey` values, custom callbacks, observer options, a browser fallback, and an idempotent `disconnect()` handle. `trackOnceInView()` remains as a compatibility wrapper.
- Added the generator's `--control` flag. It creates an impression-only `src/js/control/index.jsx` that observes the unchanged page without mounting variant UI.
- Added version-matched framework guides to the published package. New experiments include tracked `AGENTS.md` and `CLAUDE.md` files that start discovery at the installed `llms.txt` manifest.
- Added multi-select markets to the main generator and `pnpm add-e2e`. Groups and individual countries can be mixed in one selection.
- Added Ukraine (`UA`) to the E2E market list.
- Added `src/helpers.js` to new projects for page-aware tracking labels shared by control and variant entries.

### Changed

- Generated source, configuration, E2E files, and examples now use two-space indentation.
- Agent refreshes replace only the framework-managed block in `AGENTS.md`. Project rules outside that block stay intact.
- Generated agent rules now cover source ownership, CSS Modules, accessibility, runtime guards, tracking, controls, and E2E boundaries.
- New project `package.json` files no longer include redundant `init-claude` and `init-agents` scripts. The package binaries remain available for older projects.
- Multi-market selections expand groups, remove duplicates, and write countries in canonical order. Playwright runs once per resolved country, while `pnpm live` uses the first one as its default URL.

### Fixed

- `pnpm add-e2e` now updates `experiment.config.js#targetUrl` after market setup.
- `pnpm add-e2e` accepts pnpm's `--` option separator.
- The main generator and `pnpm add-e2e` now show the same interactive market choices.

For worked examples, see [AI project support](/development/ai-project-support), [Variations](/development/variations), [Tracking](/framework-api/tracking), and [Markets in E2E tests](/e2e-testing/markets).

## 2.1.0 - July 13, 2026

### Added

- Added `pnpm new-variation control` support for generated projects that need a dedicated control entry point.

### Changed

- Variation entry discovery now keeps numeric `vN` folders before named folders such as `control`.

## 2.0.1 - July 13, 2026

### Added

- Added TypeScript declarations for the root and `/framework` package entry points.

### Changed

- `pnpm start` now keeps development logging enabled while production behavior remains exclusive to `pnpm build`.
- Generated projects use workspace-level dependency build approvals compatible with pnpm 10.26 and pnpm 11.
- Generated Biome configuration rejects undeclared JSX references before a broken Adobe Target bundle can be emitted.

### Fixed

- Disabled generated source maps in development and production output for Adobe Target paste compatibility.

## 2.0.0 - July 1, 2026

### Added

- Added the generic button experiment template with CSS Modules class prefixes derived from the project name.
- Added multi-variation generation and the `exp-build`, `exp-start`, `exp-live`, and `exp-new-variation` package binaries.
- Added emergency brake support, fallback selectors, Adobe Analytics tracking helpers, and optional Playwright E2E smoke tests.
- Added package-owned runtime, build tooling, Sass helpers, generated AI documentation, and maintainer release checks.

### Changed

- Migrated generated projects to the scoped `@sogody/experiment-framework` dependency, Vite, Preact, Biome, and Sass CSS Modules.
- Consolidated scaffolding to one generic button template and removed product-card boilerplate selection.
- JavaScript minification remains disabled for Adobe Target compatibility; production CSS uses Vite's esbuild minifier.
- DOM waiting uses `MutationObserver`, and variation builds run in parallel.

### Fixed

- Corrected the default base URL and initialized tracking after Preact rendering.
- Removed unused non-template AI instruction files and legacy stylelint tooling from the published payload.

See [Migration](/reference/migration) for an upgrade checklist.
