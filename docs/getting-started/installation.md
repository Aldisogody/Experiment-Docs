# Installation

## Create a new experiment

Run the create command with your project name:

```bash
pnpm create @sogody/experiment my-experiment
```

The CLI guides you through a series of prompts, then generates a complete project, installs dependencies, and optionally runs Playwright setup and a smoke test.

## CLI prompts

| Prompt | Default | What it controls |
|---|---|---|
| **Select boilerplate** | `product-card` | Which template to use. `product-card` includes Samsung product API, Preact card component, and SCSS. `minimal` generates a simple button with no API integration. |
| **Number of variations** | `1` | Generates `src/js/v1/` through `src/js/vN/`. Pick 2 for A/B, 3 for A/B/C. |
| **Window namespace** | `sgd` | The IIFE output name on `window` (e.g. `window.sgd`). Must be a valid JS identifier. Keep the default unless it conflicts with another experiment on the same page. |
| **Include emergency brake** | `true` | Wraps the experiment in an Adobe Target kill-switch. Leave enabled for all production experiments. |
| **Enable E2E testing** | `false` | Generates `e2e/`, `playwright.config.js`, and wires up `pnpm test:e2e`. Enable if you have a stable preview URL to test against. |
| **Base URL** _(E2E only)_ | `https://samsung.com` | The root URL for Playwright tests. |
| **Market** _(E2E only)_ | — | Selects which Samsung market(s) to parametrise tests against. See the [Markets reference](/reference/markets). |
| **Run smoke test** _(E2E only)_ | `false` | Runs `pnpm build` and `pnpm test:e2e` immediately after setup. |

## After scaffolding

The CLI prints the next steps. Start developing immediately:

```bash
cd my-experiment

# Watch variation 1 — rebuilds on save and copies IIFE to clipboard
pnpm start 0
```

Open Adobe Target, navigate to your experiment's custom code editor, and paste. That's the full inner loop.

::: tip Choosing a boilerplate
Use `product-card` when your experiment displays Samsung product data (image, price, CTA). Use `minimal` for layout tests, copy changes, or anything that doesn't need the Samsung product API.
:::
