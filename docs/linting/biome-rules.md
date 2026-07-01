# Biome Rules

[Biome](https://biomejs.dev) is the linter and formatter for all JavaScript and JSX in generated experiment projects. It replaces ESLint and Prettier.

## Full configuration

The generated `biome.json`:

```json
{
    "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
    "files": {
        "ignore": ["dist/**", "node_modules/**", "scripts/**", "lib/**"]
    },
    "formatter": {
        "indentStyle": "space",
        "indentWidth": 4,
        "lineWidth": 120
    },
    "javascript": {
        "formatter": {
            "quoteStyle": "single"
        },
        "globals": [
            "window", "document", "fetch",
            "setTimeout", "setInterval", "clearInterval", "clearTimeout",
            "MutationObserver", "HTMLElement", "Intl", "s"
        ]
    },
    "organizeImports": {
        "enabled": false
    },
    "linter": {
        "enabled": true,
        "rules": {
            "recommended": false,
            "correctness": {
                "recommended": true,
                "noUnusedVariables": "error"
            },
            "suspicious": {
                "recommended": true,
                "noConsole": "error"
            },
            "a11y": {
                "recommended": true
            }
        }
    }
}
```

## Formatter settings

| Setting | Value | Reason |
|---|---|---|
| `indentStyle` | `space` | Consistent with surrounding Samsung codebase |
| `indentWidth` | `4` | 4-space indentation |
| `lineWidth` | `120` | Wider than the 80-char default to accommodate JSX |
| `quoteStyle` | `single` | Single quotes throughout |

## Linter rules

### Recommended rule groups

The generated config keeps the top-level `recommended` setting off, then enables recommended rules in these groups:

| Group | Why it is enabled |
|---|---|
| `correctness` | Catches likely runtime errors and unused variables. |
| `suspicious` | Catches code that is usually accidental, including console logging. |
| `a11y` | Catches common accessibility issues in JSX. |

### `noConsole: error`

```js
// WRONG - will fail the build
console.log('debug value:', data);

// CORRECT - use the runtime's opt-in diagnostic helper
debug('product data', data);
```

`console.log` statements in IIFE bundles appear in all users' browser consoles. This rule prevents accidental logging in production bundles.

### `noUnusedVariables: error`

```js
// WRONG - unused import fails the build
import { waitFor, watchFor } from '@sogody/experiment-framework/framework';
// watchFor is never used

// CORRECT - only import what you use
import { waitFor } from '@sogody/experiment-framework/framework';
```

Unused variables and imports increase bundle size unnecessarily. This rule enforces clean imports.

## Globals

The `javascript.globals` array tells Biome which identifiers are available as browser globals without being imported:

| Global | Source |
|---|---|
| `window`, `document` | Browser DOM |
| `fetch` | Browser Fetch API |
| `setTimeout`, `setInterval`, `clearTimeout`, `clearInterval` | Browser timer APIs |
| `MutationObserver` | Browser Observer API |
| `HTMLElement` | Browser DOM |
| `Intl` | Browser Internationalization API |
| `s` | Adobe Analytics AppMeasurement global |

The `s` global is specific to the Samsung/Adobe Analytics setup. Biome will not flag `s.tl()` or `s.events` as undeclared.

## Ignored paths

| Path | Reason |
|---|---|
| `dist/**` | Build output - not source |
| `node_modules/**` | Dependencies |
| `scripts/**` | Build scripts run outside the experiment context |
| `lib/**` | Framework runtime - not linted per project |

## Commands

```bash
# Check for violations (read-only - used in CI and build gate)
pnpm lint

# Auto-fix formatting violations
pnpm format
```

## Common errors and fixes

| Error | Cause | Fix |
|---|---|---|
| `noConsole` | `console.log` in `src/` | Remove it or use framework `log()` / `debug()` |
| `noUnusedVariables` | Unused import or declared variable | Remove the unused declaration |
| Formatting | Tabs instead of spaces, wrong quote style | Run `pnpm format` to auto-fix |
