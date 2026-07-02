# Linting & Formatting

Generated experiment projects use Biome as the JavaScript, JSX, JSON, and formatting quality gate.

Biome is installed in generated projects, `biome.json` stores formatting and linting rules, and the production build runs a read-only check before bundling. Run `pnpm lint:fix` before committing or handing off an experiment.

SCSS is handled through Sass CSS Modules in Vite. The active generated templates do not generate a `.stylelintrc` file.

::: warning There is no ESLint in generated projects
Biome replaced ESLint entirely (migrated in commit `bb91734`). Do not add an `.eslintrc` file - it will not be picked up and will conflict with editor integrations.
:::

## Team commands

| Command | When to use it | What it does |
|---|---|---|
| `pnpm lint` | Before reviewing lint output manually | Runs formatter, linter, and import-sorting checks without writing files. |
| `pnpm lint:fix` | Before committing | Formats files, sorts imports, and applies safe lint fixes. |
| `pnpm format` | When only formatting is needed | Formats supported files without running the full lint/check flow. |
| `pnpm ci:lint` | In CI or release checks | Runs the read-only CI check and fails on issues. |

Recommended generated project scripts:

```json
{
    "scripts": {
        "lint": "biome check .",
        "lint:fix": "biome check --write .",
        "format": "biome format --write .",
        "ci:lint": "biome ci ."
    }
}
```

Use `pnpm lint:fix` as the normal local repair command. Use `pnpm ci:lint` or `biome ci .` in CI because Biome's `ci` command is read-only and intended for pipelines.

## Auto-fix behavior

`biome check --write .` is the default local fix command. It formats files, sorts imports, and applies safe fixes.

Safe fixes are changes Biome can make without changing intended behavior. Unsafe fixes require an explicit `--unsafe` flag and should not be part of default scripts.

If `pnpm lint:fix` does not fix an issue, read the diagnostic and edit the code manually. Biome does not fix every lint error.

## New or existing project setup

Generated projects already include Biome. Use this setup sequence only when adding Biome to an older or manually created project:

```bash
pnpm add -D -E @biomejs/biome
pnpm exec biome init
pnpm lint:fix
pnpm ci:lint
```

`pnpm add -D -E @biomejs/biome` installs Biome as an exact dev dependency so every developer and CI run uses the same version. `pnpm exec biome init` creates `biome.json`. `pnpm lint:fix` applies formatting, import sorting, and safe fixes. `pnpm ci:lint` verifies the result without changing files.

## `biome.json` notes

The docs do not need to duplicate the whole config. Check these decisions when reviewing or updating `biome.json`:

- Formatter is enabled so code style is automatic.
- Linter is enabled so correctness and suspicious patterns are caught early.
- Import sorting is part of `biome check`.
- Generated output folders such as `dist/` should be ignored.

## References

- [Biome Getting Started](https://biomejs.dev/guides/getting-started/)
- [Biome CLI reference](https://biomejs.dev/reference/cli/)
- [Biome Rules](/linting/biome-rules)
- [Editor Setup](/linting/editor-setup)
- [Logging & Debugging](/framework-api/logging)
