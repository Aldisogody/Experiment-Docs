# Writing Tests

## The smoke spec

The generated `e2e/smoke.spec.js` verifies that the experiment bundle loads and renders correctly on each configured market. It follows a straightforward structure: navigate to the page with the bundle injected, then assert the experiment is visible.

```js
import { test, expect } from '@playwright/test';
import { urlsConfig } from './config';
import { setupPage, takeScreenshot } from './helpers';

for (const market of urlsConfig.markets) {
    test(`smoke test — ${market.name}`, async ({ page }, testInfo) => {
        // 1. Navigate and inject the experiment bundle
        await setupPage(page, market, testInfo);

        // 2. Assert the experiment container is visible
        const container = page.locator('[data-injected-experiment]');
        await expect(container).toBeVisible();

        // 3. Take a screenshot for visual review
        await takeScreenshot(page, market.code, 'visible', testInfo);
    });
}
```

## Helpers

### `setupPage(page, market, testInfo)`

Navigates to the market's URL and injects the IIFE bundle from `dist/v1/v1.js`.

```js
// e2e/helpers.js
export async function setupPage(page, market, testInfo) {
    const url = urlsConfig.getUrl(market.code, '/');
    await page.goto(url);
    await page.addScriptTag({ path: urlsConfig.bundlePath });
}
```

Call this at the start of every test. It handles navigation and script injection.

### `takeScreenshot(page, marketCode, label, testInfo)`

Saves a screenshot with a descriptive filename. Screenshots are always saved (not just on failure), making them useful for visual review across markets.

```js
await takeScreenshot(page, market.code, 'after-render', testInfo);
// Saves: e2e/screenshots/UK-after-render.png
```

### `experimentContainer`

The experiment container selector — any element with `data-injected-experiment`. Use this in assertions:

```js
const container = page.locator('[data-injected-experiment]');
await expect(container).toBeVisible();
```

## Multi-market parametrisation

The `for...of` loop over `urlsConfig.markets` generates one test per market. For a project with `SEBN` (Benelux), this creates three tests:

```
smoke test — Belgium (NL)
smoke test — Belgium (FR)
smoke test — Netherlands
```

Each test runs independently and in parallel (per `fullyParallel: true` in the config).

## e2e/config.js

Generated from your scaffold answers. Contains the market list and URL resolution:

```js
export const urlsConfig = {
    baseUrl: 'https://samsung.com',
    bundlePath: 'dist/v1/v1.js',
    markets: [
        { code: 'UK', urlPath: 'uk', name: 'United Kingdom' },
    ],
    getUrl(marketCode, pagePath) {
        const market = this.markets.find(m => m.code === marketCode);
        return `${this.baseUrl}/${market.urlPath}${pagePath}`;
    },
};
```

To test against a different page path, change the `pagePath` argument passed to `getUrl`.

## Adding assertions

Extend the smoke spec with additional assertions for your specific experiment. For example, to verify a price element renders:

```js
test(`price renders — ${market.name}`, async ({ page }, testInfo) => {
    await setupPage(page, market, testInfo);

    const priceEl = page.locator('[data-injected-experiment] .price');
    await expect(priceEl).toBeVisible();
    await expect(priceEl).not.toBeEmpty();
});
```
