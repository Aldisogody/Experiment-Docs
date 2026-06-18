# Changelog

This page summarizes user-facing scaffold changes. The package repository `CHANGELOG.md` remains the release source of truth.

## Unreleased on `main`

- Made `CLAUDE.md` and `AGENTS.md` opt-in instead of generating AI instruction files during scaffolding.
- Added package-owned `exp-init-claude` and `exp-init-agents` binaries and generated `pnpm init-claude` / `pnpm init-agents` scripts.
- Added opt-in `pnpm init-skills` / `exp-init-skills`, which installs
  boilerplate-aware project skills for Codex, Claude Code, and Cursor with
  transactional `--force` replacement. See
  [AI Project Support](/development/ai-project-support).
- Removed generated skill `assets/` and `scripts/` directories; skills now
  contain `SKILL.md` and applicable reference documents only.
- Added `pnpm live` / `exp-live` with variation, URL, overlay, and browser-profile options.
- Added `getPath()`, `getPathSegments()`, `getMarket()`, `log()`, and `debug()` runtime helpers.
- Added ordered selector fallbacks and the no-fallback position shorthand to `mountExperiment()`.
- Added shared `mq()` and `fluid-property()` Sass helpers.
- Removed experimental Adobe Target template-literal lowering and emitted `${` bundle protection.
- Added `targetUrl` and `live` settings to `experiment.config.js`.
- Refactored generator behavior around a file-oriented scaffold plan.

## 2.0.2 - April 23, 2026

- Removed Stylelint packages and the generated `.stylelintrc`.
- Kept Biome for JavaScript, JSX, and JSON.
- Kept Sass compilation as the SCSS validation step.

## 2.0.1 - April 23, 2026

- Changed the interactive boilerplate default to `minimal`.
- Moved generated runtime and command tooling into the `create-experiment` package.
- Added `exp-build`, `exp-start`, and `exp-new-variation`.
- Derived CSS Module prefixes from the project name.
- Fixed the minimal scaffold so it does not receive product-card variation styles.

## 2.0.0 - March 13, 2026

- Added the minimal boilerplate.
- Added multi-variation generation.
- Added optional Playwright smoke tests.
- Migrated generated projects from ESLint to Biome.
- Added clipboard copy during focused watch mode.
- Set Node 18 as the minimum and Node 24 in generated `.nvmrc`.

See [Migration](/reference/migration) for an upgrade checklist.
