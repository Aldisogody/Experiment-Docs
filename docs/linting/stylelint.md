# Stylelint (SCSS)

Biome does not support SCSS, so generated projects use [Stylelint](https://stylelint.io) for SCSS linting. The two tools cover separate file types and do not overlap.

## Configuration

The generated `.stylelintrc`:

```json
{
    "plugins": [
        "stylelint-scss",
        "stylelint-order"
    ],
    "rules": {
        "block-no-empty": true,
        "number-no-trailing-zeros": true,
        "max-empty-lines": 1,
        "color-no-invalid-hex": true,
        "declaration-block-single-line-max-declarations": 1,
        "function-url-quotes": "always",
        "no-missing-end-of-source-newline": true,
        "string-quotes": "single",
        "selector-max-id": 1,
        "max-nesting-depth": 4,
        "scss/dollar-variable-pattern": "^_?[a-z]+[\\w-]*$",
        "scss/at-extend-no-missing-placeholder": true,
        "scss/dollar-variable-colon-space-before": "never",
        "scss/dollar-variable-colon-space-after": "always",
        "scss/selector-no-redundant-nesting-selector": true,
        "order/order": [
            "declarations",
            "rules"
        ]
    }
}
```

## Rules explained

### General rules

| Rule | Value | Meaning |
|---|---|---|
| `block-no-empty` | `true` | No empty `{}` blocks |
| `number-no-trailing-zeros` | `true` | `0.5` not `0.50` |
| `max-empty-lines` | `1` | At most one blank line between declarations |
| `color-no-invalid-hex` | `true` | Validates hex colour values |
| `declaration-block-single-line-max-declarations` | `1` | One declaration per line — no `{ color: red; margin: 0 }` |
| `function-url-quotes` | `'always'` | `url('...')` not `url(...)` |
| `no-missing-end-of-source-newline` | `true` | Files must end with a newline |
| `string-quotes` | `'single'` | Single quotes — consistent with Biome JS formatter |
| `selector-max-id` | `1` | At most one ID selector per rule |
| `max-nesting-depth` | `4` | Maximum SCSS nesting depth |

### SCSS-specific rules (`stylelint-scss`)

| Rule | Meaning |
|---|---|
| `scss/dollar-variable-pattern` | Variable names must be `camelCase` or `kebab-case` |
| `scss/at-extend-no-missing-placeholder` | `@extend` must target a `%placeholder`, not a class |
| `scss/dollar-variable-colon-space-before: never` | `$var: value` not `$var : value` |
| `scss/dollar-variable-colon-space-after: always` | `$var: value` not `$var:value` |
| `scss/selector-no-redundant-nesting-selector` | No `& .child` when `.child` would suffice |

### Property ordering (`stylelint-order`)

Declarations must come before nested rules:

```scss
// CORRECT
.card {
    display: flex;          // declarations first
    padding: 1rem;

    &:hover {               // nested rules after
        opacity: 0.8;
    }
}

// WRONG — nested rule before declaration
.card {
    &:hover {
        opacity: 0.8;
    }
    display: flex;          // declaration after nested rule
}
```

## CSS Modules convention

Generated projects use Vite's CSS Modules. Class names in SCSS files are scoped automatically:

```scss
// styles.module.scss
.cardWrapper {
    display: flex;
}
```

```jsx
// index.jsx
import style from './styles.module.scss';

<div class={style.cardWrapper}>...</div>
```

Use **camelCase** for CSS Module class names — the Vite config is set to `localsConvention: 'camelCase'`.
