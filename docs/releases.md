---
title: Releases
---

# Releases

Generated projects get their runtime helpers and `exp-*` commands from `@sogody/experiment-framework`.

## Current published line

The current package line is `2.2.0`.

| Version | Main change |
|---|---|
| `2.2.0` | Adds shared viewport tracking, impression-only control scaffolding, version-matched agent guides, and multi-market E2E selection. Generated files now use two-space indentation. |
| `2.1.0` | Adds named `control` variation generation and numeric-first/named-last entry discovery. |
| `2.0.1` | Adds package type declarations, pnpm 10.26+/11 build approvals, development watch logging, and source-map fixes. |
| `2.0.0` | Introduces the scoped package line, generic button scaffold, package-owned runtime, build/live tooling, and optional E2E setup. |

Use the package repository's `CHANGELOG.md` when preparing a release.

## What changes for experiment teams in 2.2.0

| Area | Before | In 2.2.0 |
|---|---|---|
| Agent guidance | Instruction files were created on demand and could drift from the installed package. | New projects track thin instruction files that discover guides inside the installed package. |
| Control exposure | Teams created a named entry from `v1` and stripped out variant behavior by hand. | `--control` creates an unchanged-page impression entry during scaffolding. |
| Impression tracking | Experiments carried their own `IntersectionObserver` helper. | `trackInView()` provides the shared observer, deduplication, fallback, and cleanup behavior. |
| E2E markets | Setup accepted one group or market. | Setup accepts mixed selections, expands groups, removes duplicates, and runs one test per resolved country. |

The release diagrams live beside the relevant instructions: [agent discovery](/development/ai-project-support#how-an-agent-finds-the-right-guide), [control and variant exposure](/development/variations#scaffold-an-unchanged-control), and [multi-market resolution](/e2e-testing/markets#select-one-or-more-markets).

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
