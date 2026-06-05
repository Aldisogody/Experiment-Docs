# Getting Started

`create-experiment` is a CLI scaffolder that generates self-contained Vite + Preact A/B experiment projects for Adobe Target. Each variation compiles to an IIFE bundle that you paste directly into Adobe Target's custom code editor.

## What you'll get

Running the scaffolder produces a complete project:

```
my-experiment/
├── src/
│   ├── components/ExperimentCard/     # Preact component (product-card boilerplate)
│   ├── js/v1/index.jsx                # Variation entry point
│   ├── config.js                      # selectors, translations, model codes
│   └── helpers.js                     # Samsung API helpers, price formatting
├── experiment.config.js               # globalObject, includeEmergencyBrake
├── vite.config.js                     # IIFE lib mode, Preact plugin, aliases
├── biome.json                         # Linter + formatter config
├── .nvmrc                             # Node 24
└── package.json
```

## Quick Start

New here? Start with [Start Here](/start-here). The older [Quick Start tutorial](/getting-started/quick-start) is still available as a step-by-step walkthrough.

## Before you begin

Make sure you have the following installed and at the correct versions:

- [ ] **Node 18+** (24 recommended) — [Prerequisites: Node version](/getting-started/prerequisites#node-version)
- [ ] **pnpm 10+** — [Prerequisites: pnpm](/getting-started/prerequisites#pnpm)
- [ ] **Playwright** (only if you plan to enable E2E testing) — [Prerequisites: Playwright](/getting-started/prerequisites#playwright)

[Next: Quick Start →](/getting-started/quick-start)
