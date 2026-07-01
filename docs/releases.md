---
title: Releases
---

# Releases

The package is `@sogody/experiment-framework`. Generated projects depend on it for runtime helpers and the `exp-*` commands.

## Current published line

The npm package currently resolves to `2.0.0`. The repository changelog contains newer entries, but they are source/release-preparation notes until published to npm.

| Version | Main change |
|---|---|
| `2.0.0` | Current npm package for the scoped `@sogody/experiment-framework` line. |
| Source newer than npm | Repository changelog entries mention release metadata, Stylelint removal, and the single button scaffold. |

Treat repository source as newer than the npm package until a new package version is published.

## Upgrade a generated project

The scaffold writes a compatible `@sogody/experiment-framework` version into `devDependencies`. To inspect the installed version:

```bash
pnpm why @sogody/experiment-framework
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
