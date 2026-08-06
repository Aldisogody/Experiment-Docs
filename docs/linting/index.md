# Linting and formatting

Generated projects use Biome to format and check JavaScript, JSX, and JSON.

The production build runs a read-only Biome check before bundling. Run `pnpm format` before committing or handing off an experiment.

SCSS is handled through Sass CSS Modules in Vite. The active generated templates do not generate a `.stylelintrc` file.

::: warning There is no ESLint in generated projects
Biome replaced ESLint. An `.eslintrc` file will not be used and may conflict with editor integrations.
:::

## Team commands

| Command | When to use it | What it does |
|---|---|---|
| `pnpm lint` | Before reviewing lint output manually, in CI, or before shipping | Runs the Biome check over `src` without writing files. |
| `pnpm format` | Before committing | Runs `biome check --write src`, formatting files and applying safe fixes. |

Recommended generated project scripts:

```json
{
    "scripts": {
        "lint": "biome check src",
        "format": "biome check --write src"
    }
}
```

Use `pnpm format` as the normal local repair command. Use `pnpm lint` in CI because it is read-only and matches the generated production build gate.

## What `pnpm format` changes

`biome check --write src` is the default local fix command. It formats files and applies safe fixes.

Safe fixes are changes Biome can make without changing intended behavior. Unsafe fixes require an explicit `--unsafe` flag and should not be part of default scripts.

If `pnpm format` does not fix an issue, read the diagnostic and edit the code manually. Biome does not fix every lint error.

## Add Biome to an older project

Generated projects already include Biome. Use this setup sequence only when adding Biome to an older or manually created project:

```bash
pnpm add -D -E @biomejs/biome
pnpm exec biome init
pnpm format
pnpm lint
```

`pnpm add -D -E @biomejs/biome` installs Biome as an exact dev dependency so every developer and CI run uses the same version. `pnpm exec biome init` creates `biome.json`. `pnpm format` applies formatting and safe fixes. `pnpm lint` verifies the result without changing files.

## `biome.json` notes

When reviewing `biome.json`, check these project decisions:

- Formatter is enabled so code style is automatic.
- Linter is enabled so correctness and suspicious patterns are caught early.
- Generated projects disable Biome import sorting by default.
- Generated output folders such as `dist/` should be ignored.

## References

- [Biome Getting Started](https://biomejs.dev/guides/getting-started/)
- [Biome CLI reference](https://biomejs.dev/reference/cli/)
- [Biome Rules](/linting/biome-rules)
- [Editor Setup](/linting/editor-setup)
- [Logging & Debugging](/framework-api/logging)
