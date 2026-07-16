# Changelog

This page summarizes user-facing scaffold changes. The package repository
`CHANGELOG.md` remains the release source of truth.

## Unreleased on `main`

No documented user-facing changes beyond the current package line.

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
