# Linting & Formatting

Generated experiment projects use Biome for JavaScript, JSX, and JSON under `src/`.

SCSS is handled through Sass CSS Modules in Vite. The active generated templates do not generate a `.stylelintrc` file.

::: warning There is no ESLint in generated projects
Biome replaced ESLint entirely (migrated in commit `bb91734`). Do not add an `.eslintrc` file — it will not be picked up and will conflict with editor integrations.
:::

## Quick reference

```bash
pnpm lint      # Biome check on src/ (read-only, exits non-zero on violations)
pnpm format    # Biome check --write on src/ (auto-fixes formatting)
```

The production build runs Biome automatically. If linting fails, the build aborts.

Focused and all-variation watchers also run a lint gate on rebuild. They keep running after an error so the next save can retry.

## Sections

- [Biome Rules](/linting/biome-rules) — full config, key rules, common errors
- [Styling (SCSS Modules)](/linting/stylelint) — Sass CSS Modules conventions
- [Editor Setup](/linting/editor-setup) — Biome editor setup
- [Logging & Debugging](/framework-api/logging) — diagnostics without direct `console` calls
