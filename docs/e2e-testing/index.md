# E2E testing

The optional Playwright setup runs the same smoke test against each configured market. Enable it while scaffolding or add it later with `pnpm add-e2e`.

## When to enable E2E

Add E2E when you have a stable preview URL, repeated QA work, or several market URLs to cover. For a changing prototype or a one-off copy edit, the Target preview is often enough.

## What gets generated

When E2E is enabled, the scaffolder adds:

```
my-experiment/
├── e2e/
│   ├── smoke.spec.js      # Playwright test - verifies experiment renders
│   ├── config.js          # Market URLs and base URL configuration
│   └── helpers.js         # setup, target injection, bundle loading, screenshots
├── playwright.config.js   # Playwright configuration
└── package.json           # pnpm test:e2e script added
```

## Sections

- [Setup](/e2e-testing/setup) covers browser installation, test runs, and debugging.
- [Writing tests](/e2e-testing/writing-tests) explains the smoke spec, helpers, and multi-market patterns.
- [Markets](/e2e-testing/markets) explains URL paths and multi-country groups.

Generated smoke tests assert the scaffolded button renders with the configured `buttonText`. Add product API mocks or extra assertions when your experiment introduces those dependencies.
