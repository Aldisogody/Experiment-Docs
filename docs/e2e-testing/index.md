# E2E Testing

::: tip Optional feature
E2E testing is opt-in. You choose whether to include it when scaffolding. Skip this section entirely if you didn't enable it — you can always add it later by revisiting [Setup](/e2e-testing/setup).
:::

E2E testing is optional and configured at scaffold time. When enabled, the scaffolder generates a Playwright setup with per-market smoke tests.

## When to enable E2E

Enable E2E testing when:
- You have a stable preview URL to test against
- You need to verify the experiment renders correctly across multiple markets
- You want to catch regressions before deploying to Adobe Target

Skip E2E testing when:
- You're in early experimentation and don't yet have a stable URL
- The experiment is a simple copy change with no API calls
- You're prototyping and plan to add tests later

## What gets generated

When E2E is enabled, the scaffolder adds:

```
my-experiment/
├── e2e/
│   ├── smoke.spec.js      # Playwright test — verifies experiment renders
│   ├── config.js          # Market URLs and base URL configuration
│   └── helpers.js         # setupPage, takeScreenshot, experimentContainer
├── playwright.config.js   # Playwright configuration
└── package.json           # pnpm test:e2e script added
```

## Sections

- [Setup](/e2e-testing/setup) — installing browsers, running tests, debugging
- [Writing Tests](/e2e-testing/writing-tests) — smoke spec walkthrough, helpers, multi-market patterns
- [Markets](/e2e-testing/markets) — URL path mapping, multi-country group behaviour
