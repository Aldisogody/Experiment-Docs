# CLI prompts

These are the questions asked by `npx @sogody/experiment-framework`.

## Usage

```bash
npx @sogody/experiment-framework my-experiment
npx @sogody/experiment-framework my-experiment --control
```

The project name is a required argument. The CLI exits if it is not provided.

`--control` adds `src/js/control/index.jsx` during scaffolding. That entry observes the existing page and sends an impression event. It does not mount Preact or change the control experience.

## Prompts

### Number of variations

| | |
|---|---|
| **Type** | Select |
| **Default** | `1` |
| **Options** | `1`, `2`, `3`, `4`, `custom` |

Controls how many variation directories are generated under `src/js/`.

- `1` - generates `src/js/v1/` only
- `2` - generates `src/js/v1/` and `src/js/v2/` (A/B)
- `custom` - prompts for a number between 1 and 10

The current CLI uses one generic button scaffold for every project. It does not ask for a boilerplate type.

---

### Window namespace

| | |
|---|---|
| **Type** | Text |
| **Default** | `sgd` |
| **Validation** | Must be a valid JavaScript identifier |

Sets `runtime.globalObject` in `experiment.config.js`. The IIFE bundle registers under that namespace, for example `window.sgd`.

Keep the default `sgd` unless it conflicts with another experiment running on the same Adobe Target page.

---

### Include emergency brake

| | |
|---|---|
| **Type** | Confirm |
| **Default** | `true` |

Sets `runtime.includeEmergencyBrake` in `experiment.config.js`. When enabled, `runScript()` checks the Adobe Target emergency-brake configuration before running the experiment.

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

### Markets _(E2E only)_

| | |
|---|---|
| **Type** | Multiselect |
| **Default** | - |
| **Condition** | Only shown when E2E is enabled |

Select one or more groups or individual markets with Space, then press Enter. Multi-country groups (`BENELUX`, `NORDICS`, `IBERIA`) expand to their countries. Mixed selections are combined, deduplicated, and written in canonical order. See the [Markets Reference](/reference/markets) for every option.

---

### Run smoke test _(E2E only)_

| | |
|---|---|
| **Type** | Confirm |
| **Default** | `false` |
| **Condition** | Only shown when E2E is enabled |

When `true`, the CLI runs `pnpm build` followed by `pnpm test:e2e` after setup. This checks the generated project before you start editing it.
