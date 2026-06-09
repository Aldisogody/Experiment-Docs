# CLI Prompts Reference

Complete reference for every prompt shown when running `npx create-experiment`.

## Usage

```bash
npx create-experiment my-experiment
```

The project name is a required argument. The CLI exits if it is not provided.

## Prompts

### Select boilerplate

| | |
|---|---|
| **Type** | Select |
| **Default** | `minimal` |
| **Options** | `minimal`, `product-card` |

Controls which template is used for the generated project.

- `product-card` - Generates a Samsung product card UI with Samsung API helpers and an `ExperimentCard` Preact component. Use for upsell, cross-sell, and product promotion experiments.
- `minimal` - Generates a simple button component with no API integration. Use for CTA copy tests, layout experiments, and anything that doesn't need product data.

---

### Number of variations

| | |
|---|---|
| **Type** | Select |
| **Default** | `1` |
| **Options** | `1`, `2`, `3`, `4`, `custom` |

Controls how many variation directories are generated under `src/js/`.

- `1` - generates `src/js/v1/` only (control)
- `2` - generates `src/js/v1/` and `src/js/v2/` (A/B)
- `custom` - prompts for a number between 1 and 10

---

### Window namespace

| | |
|---|---|
| **Type** | Text |
| **Default** | `sgd` |
| **Validation** | Must be a valid JavaScript identifier |

Sets the `globalObject` field in `experiment.config.js`. The IIFE bundle registers itself as `window[globalObject]` - for example, `window.sgd`.

Keep the default `sgd` unless it conflicts with another experiment running on the same Adobe Target page.

---

### Include emergency brake

| | |
|---|---|
| **Type** | Confirm |
| **Default** | `true` |

Sets `includeEmergencyBrake` in `experiment.config.js`. The current package records but does not consume this value, so verify any deployment-layer kill-switch integration.

---

### Enable E2E testing

| | |
|---|---|
| **Type** | Confirm |
| **Default** | `false` |

When `true`, generates `e2e/`, `playwright.config.js`, and adds `pnpm test:e2e` to `package.json`. The CLI also runs `pnpm playwright install` after project setup.

If `false`, none of the E2E files are generated and Playwright is not installed.

---

### Base URL _(E2E only)_

| | |
|---|---|
| **Type** | Text |
| **Default** | `https://samsung.com` |
| **Condition** | Only shown when E2E is enabled |

The root URL for Playwright tests. Written to `e2e/config.js` as `urlsConfig.baseUrl`.

---

### Market _(E2E only)_

| | |
|---|---|
| **Type** | Select |
| **Default** | - |
| **Condition** | Only shown when E2E is enabled |

Selects which Samsung market(s) to run E2E tests against. Multi-country groups (`SEBN`, `SENA`, `SEIB`) generate one test per configured country. See the [Markets Reference](/reference/markets) for all available options.

---

### Run smoke test _(E2E only)_

| | |
|---|---|
| **Type** | Confirm |
| **Default** | `false` |
| **Condition** | Only shown when E2E is enabled |

When `true`, the CLI runs `pnpm build` and then `pnpm test:e2e` immediately after project setup. Useful to verify the scaffold is working end-to-end before you start developing.
