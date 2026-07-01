# Changelog

This page summarizes user-facing scaffold changes. The package repository `CHANGELOG.md` remains the release source of truth.

## Unreleased on `main`

- Removed the product-card boilerplate, `template-minimal/` overlay system, CLI boilerplate selection, `boilerplateType` generator field, and `inferBoilerplateType` project detection.
- Consolidated generated projects to one generic button boilerplate in `template/`.
- Updated generated AI docs to describe the button-only project shape and markets/E2E URL guidance without product-card references.
- Made `CLAUDE.md` and `AGENTS.md` opt-in instead of generating AI instruction files during scaffolding.
- Added package-owned `exp-init-claude` and `exp-init-agents` binaries and generated `pnpm init-claude` / `pnpm init-agents` scripts.
- Added `pnpm live` / `exp-live` with variation, URL, overlay, and browser-profile options.
- Added `getPath()`, `getPathSegments()`, `getMarket()`, `log()`, and `debug()` runtime helpers.
- Added ordered selector fallbacks and the no-fallback position shorthand to `mountExperiment()`.
- Added optional mount options to `mountExperiment()` (`className`, `id`, `dataset`, `attributes`) and scaffolded `src/js/vN/styles.module.scss` for mount-root styling. See [mountExperiment()](/framework-api/mount-experiment).
- Added shared `mq()` and `fluid-property()` Sass helpers.
- Removed experimental Adobe Target template-literal lowering and emitted `${` bundle protection.
- Added `targetUrl` and `live` settings to `experiment.config.js`.
- Refactored generator behavior around a file-oriented scaffold plan.

## 2.0.3 - June 30, 2026

- Prepared npm release metadata with a `release:check` script for maintainer handoff.
- Included `CHANGELOG.md` in the published package payload.
- Documented maintainer release flow and npm package-name verification steps.
- Removed unused non-template AI instruction docs from the package payload while preserving generated `*.hbs` documentation templates.
- Corrected release notes that described JavaScript minification as enabled; generated Vite projects keep JS minification disabled and only minify production CSS.

## 2.0.2 - April 23, 2026

- Removed Stylelint packages and the generated `.stylelintrc`.
- Kept Biome for JavaScript, JSX, and JSON.
- Kept Sass compilation as the SCSS validation step.

## 2.0.1 - April 23, 2026

- Changed the interactive boilerplate default to `minimal`.
- Moved generated runtime and command tooling into the framework package.
- Added `exp-build`, `exp-start`, and `exp-new-variation`.
- Derived CSS Module prefixes from the project name.
- Fixed the minimal scaffold so it does not receive product-card variation styles.

## 2.0.0 - March 13, 2026

- Added the minimal boilerplate.
- Added multi-variation generation.
- Added optional Playwright smoke tests.
- Migrated generated projects from ESLint to Biome.
- Added clipboard copy during focused watch mode.
- Set Node 20.19 as the minimum and Node 24 in generated `.nvmrc`.

See [Migration](/reference/migration) for an upgrade checklist.
