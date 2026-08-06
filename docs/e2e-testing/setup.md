# E2E setup

## Browser installation

When E2E is enabled during scaffolding, the CLI runs `pnpm playwright install` for you.

After cloning an E2E-enabled project, install the browsers manually:

```bash
cd my-experiment
pnpm playwright install
```

This downloads browser binaries for Chromium, Firefox, and WebKit to `~/.cache/ms-playwright`. The generated `playwright.config.js` uses Chromium only (`Desktop Chrome` device), so you can install just Chromium to save space:

```bash
pnpm playwright install chromium
```

## Running tests

```bash
pnpm test:e2e
```

Runs `pnpm build` first, then all tests in `e2e/` against the configured base URL and markets.

### Debug in a visible browser

```bash
pnpm playwright test --headed
```

This opens a browser window so you can inspect the page while the test runs.

### Run a single test file

```bash
pnpm playwright test e2e/smoke.spec.js
```

Direct Playwright commands do not build first. Run `pnpm build` when the bundle may be stale or missing.

## playwright.config.js

The generated configuration:

```js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: 'html',
    use: {
        ...devices['Desktop Chrome'],
        screenshot: 'only-on-failure',
        trace: 'on-first-retry',
    },
});
```

| Option | Value | Notes |
|---|---|---|
| `testDir` | `./e2e` | All test files in `e2e/` |
| `fullyParallel` | `true` | Tests run in parallel |
| `forbidOnly` | `!!CI` | Fails the run if `.only()` is left in any test |
| `retries` | `2` in CI, `0` locally | Retries on CI to handle flakiness |
| `reporter` | `html` | Generates `playwright-report/index.html` |
| `screenshot` | `only-on-failure` | Screenshots saved only when a test fails |
| `trace` | `on-first-retry` | Trace recorded on first retry for debugging |

## Run in CI

Set the `CI` environment variable to enable CI-specific behaviour (retries, `forbidOnly`):

```bash
CI=true pnpm test:e2e
```

The HTML report is written to `playwright-report/`. Generated screenshot helpers attach images to that report.
