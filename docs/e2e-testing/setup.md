# E2E Setup

## Browser installation

If you enabled E2E at scaffold time, the CLI runs `pnpm playwright install` automatically during project setup. No manual step is required.

To install browsers manually (e.g. after cloning a project that has E2E enabled):

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

### Headed mode (for debugging)

```bash
pnpm playwright test --headed
```

Opens a real browser window so you can see the test executing. Useful when a test fails and you need to inspect the page state.

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

## CI usage

Set the `CI` environment variable to enable CI-specific behaviour (retries, `forbidOnly`):

```bash
CI=true pnpm test:e2e
```

The HTML report is written to `playwright-report/`. Generated screenshot helpers attach images to that report.
