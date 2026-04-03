# Linting & Formatting

Generated experiment projects use two linting tools with distinct responsibilities:

| Tool | What it covers |
|---|---|
| **Biome** | JavaScript, JSX, JSON — formatting and linting |
| **Stylelint** | SCSS only |

::: warning There is no ESLint in generated projects
Biome replaced ESLint entirely (migrated in commit `bb91734`). Do not add an `.eslintrc` file — it will not be picked up and will conflict with editor integrations.
:::

## Quick reference

```bash
pnpm lint      # Biome check on src/ (read-only, exits non-zero on violations)
pnpm format    # Biome check --write on src/ (auto-fixes formatting)
```

The production build runs Biome automatically. If linting fails, the build aborts.

## Sections

- [Biome Rules](/linting/biome-rules) — full config, key rules, common errors
- [Stylelint (SCSS)](/linting/stylelint) — SCSS rules and conventions
- [Editor Setup](/linting/editor-setup) — VSCode extensions, format-on-save
