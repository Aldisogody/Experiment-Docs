---
title: Releases
---

# Releases

Generated projects get their runtime helpers and `exp-*` commands from `@sogody/experiment-framework`.

## Current published line

The current package line is `2.1.0`.

| Version | Main change |
|---|---|
| `2.1.0` | Adds named `control` variation generation and numeric-first/named-last entry discovery. |
| `2.0.1` | Adds package type declarations, pnpm 10.26+/11 build approvals, development watch logging, and source-map fixes. |
| `2.0.0` | Introduces the scoped package line, generic button scaffold, package-owned runtime, build/live tooling, and optional E2E setup. |

Use the package repository's `CHANGELOG.md` when preparing a release.

## Upgrade a generated project

The scaffold writes a compatible `@sogody/experiment-framework` version into `devDependencies`. To inspect the installed version:

```bash
pnpm why @sogody/experiment-framework
```

After changing the dependency, run:

```bash
pnpm install
pnpm format
pnpm lint
pnpm build
```

Review [Migration](/reference/migration) when moving a legacy project to package-owned runtime and commands.

## Release process

Maintainers update `package.json` and `CHANGELOG.md`, run `pnpm test`, create a version tag, and publish the package. See the repository [Changelog](/reference/changelog) for user-facing changes.
