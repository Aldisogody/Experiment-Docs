# Migration Guide

## v1 → v2

v2 replaces ESLint with Biome, drops support for Node 16/18, and locks pnpm to an exact version. If you have an existing experiment project from v1, follow these steps.

### Breaking changes summary

| Area | v1 | v2 |
|---|---|---|
| **Linter** | ESLint + Prettier | Biome (lint + format in one tool) |
| **Node** | 16, 18, or 20 | 20 minimum, 24 recommended |
| **pnpm** | any version | `10.30.1` (exact — enforced by `packageManager` field) |
| **Console logs** | Allowed | `noConsole: error` — build fails if `console.*` is present |
| **`watchFor()`** | Not available | Added in v2.0.0 |

---

### Step 1: Remove old tooling

Delete `node_modules` and any ESLint config files:

```bash
rm -rf node_modules
rm -f .eslintrc .eslintrc.js .eslintrc.cjs .eslintrc.json .eslintignore
rm -f .prettierrc .prettierrc.js .prettierignore
```

### Step 2: Add Biome

Copy `biome.json` from a freshly scaffolded v2 project into your project root. A minimal starting config:

```json
{
    "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
    "organizeImports": { "enabled": true },
    "linter": {
        "enabled": true,
        "rules": {
            "recommended": true,
            "suspicious": {
                "noConsole": "error"
            }
        }
    },
    "formatter": {
        "enabled": true,
        "indentStyle": "space",
        "indentWidth": 4,
        "lineWidth": 120
    },
    "javascript": {
        "formatter": {
            "quoteStyle": "single"
        },
        "globals": ["s", "window", "document"]
    }
}
```

### Step 3: Update package.json scripts

Replace ESLint commands with Biome equivalents:

**Before (v1):**

```json
{
    "scripts": {
        "lint": "eslint src --fix",
        "format": "prettier --write src"
    }
}
```

**After (v2):**

```json
{
    "scripts": {
        "lint": "biome check src",
        "lint:fix": "biome check --write src"
    }
}
```

Also add the `packageManager` field to lock pnpm:

```json
{
    "packageManager": "pnpm@10.30.1"
}
```

### Step 4: Switch Node version and reinstall

```bash
nvm install 24
nvm use 24
node --version   # v24.x.x
pnpm install
```

### Step 5: Fix Biome violations

Run the linter and address any errors:

```bash
pnpm lint
```

Common v1 → v2 violations:

| Violation | Fix |
|---|---|
| `noConsole` error | Remove or replace `console.log` with a comment or tracking call |
| Double quotes flagged | Biome enforces single quotes — run `pnpm lint:fix` to auto-fix |
| `var` declarations | Replace with `const` or `let` |

::: tip Auto-fix most issues
Run `pnpm lint:fix` first. Biome can auto-fix the majority of formatting and many linting issues.
:::

### Step 6: Verify the build

```bash
pnpm build
```

All variations should compile to `dist/`. If the build fails due to a `noConsole` violation, the error output shows the exact file and line number.

---

## Changelog

See the full [Changelog](/reference/changelog) for a complete list of new features added in v2.
