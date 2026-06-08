# Templates

The scaffolder offers two boilerplate types. You choose at scaffold time — it cannot be changed afterwards without regenerating the project.

## Comparison

| Feature | `product-card` | `minimal` |
|---|---|---|
| Samsung product API (`fetchProductCard`) | Yes | No |
| Price formatting (`formatPrice`) | Yes | No |
| `ExperimentCard` Preact component | Yes | No |
| `ExperimentButton` Preact component | No | Yes |
| Generated per-variation `styles.module.scss` | No | No |
| `MODEL_CODE_MAP` in config | Yes | No |
| Full `src/helpers.js` | Yes | No |

## `product-card`

Use this for experiments that display Samsung product information — image, price, title, and a CTA button pulling live data from the Samsung search API.

The generated project includes:

- `src/components/ExperimentCard/` — a Preact component that renders the product card
- `fetchProductCard()` — fetches product data from `searchapi.samsung.com` for the current market
- `formatPrice(price)` — formats a price with the correct currency and locale using `Intl.NumberFormat`
- `MODEL_CODE_MAP` — maps locale codes to Samsung model codes
- `MULTI_MODEL_CODES_MAP` and `fetchProductCards()` for parallel product lookups

**Best for:** Upsell experiments, product promotion banners, cross-sell modules.

## `minimal`

Use this for experiments that don't need product data. It generates a simple button component with a stripped-down config.

The generated project includes:

- `src/components/ExperimentButton/` — a Preact button component
- No `src/helpers.js`
- No per-variation SCSS files

**Best for:** CTA copy tests, layout experiments, button style tests, anything that doesn't pull live product data.
