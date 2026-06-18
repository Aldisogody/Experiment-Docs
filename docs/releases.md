---
title: Releases
---

# Releases

The published package is `create-experiment`. Generated projects depend on it for runtime helpers and the `exp-*` commands.

## Current published line

The repository package metadata reports `2.0.2`, released on April 23, 2026.

| Version | Main change |
|---|---|
| `2.0.2` | Removed the unused Stylelint toolchain from generated projects. |
| `2.0.1` | Added package-owned runtime commands, minimal scaffold fixes, and CSS class-prefix generation. |
| `2.0.0` | Introduced the v2 Vite, Preact, Biome, multi-variation, and optional Playwright scaffold. |

The `main` branch also contains unreleased work such as live injection, URL and debug helpers, SCSS runtime helpers, and structured selector fallbacks. Treat repository source as newer than the last published changelog entry until a release is tagged.

## Upgrade a generated project

The scaffold writes a compatible `create-experiment` version into `devDependencies`. To inspect the installed version:

```bash
pnpm why create-experiment
```

After changing the dependency, run:

```bash
pnpm install
pnpm lint
pnpm build
```

Review [Migration](/reference/migration) when moving a legacy project to package-owned runtime and commands.

## Release process

Maintainers update `package.json` and `CHANGELOG.md`, run `pnpm test`, create a version tag, and publish the package. See the repository [Changelog](/reference/changelog) for user-facing changes.
