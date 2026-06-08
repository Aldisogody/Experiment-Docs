# Writing Tests

## The smoke spec

Generated smoke tests loop over `urlsConfig.markets`, call `setupPage()`, assert boilerplate-specific content, and attach a screenshot.

Minimal example:

```js
import { expect, test } from '@playwright/test';
import { buttonText } from '../src/config.js';
import { urlsConfig } from './config.js';
import { experimentContainer, setupPage, takeScreenshot } from './helpers.js';

for (const market of urlsConfig.markets) {
    test.describe(`ExperimentButton [${market.code}]`, () => {
        test('renders the experiment button with correct text', async ({ page }, testInfo) => {
            await setupPage(page, market, testInfo);
            const container = page.locator(experimentContainer);

            await expect(container.locator('button')).toBeVisible();
            await expect(container.locator('button')).toContainText(buttonText);
            await takeScreenshot(page, market.code, 'experiment-button', testInfo);
        });
    });
}
```

The product-card version also verifies title, CTA, price, image attributes, and link output.

## Helpers

### `setupPage(page, market, testInfo)`

The helper:

1. Registers the product API mock for product-card projects.
2. Opens the market URL.
3. Creates the primary target when it is a missing simple class selector.
4. Injects the loaded `dist/v1/v1.js` code.
5. Waits for `experimentContainer`.
6. Attaches the test URL to the report.

Generated target creation supports selectors such as `.target-selector`. Customize `injectTargetElement()` when the primary selector is an attribute, descendant, or other complex selector.

### `experimentContainer`

The current boilerplates mount as the first child of `selectors.primary`:

```js
export const experimentContainer = `${primarySelector} > div:first-child`;
```

Use the exported selector instead of assuming the runtime adds a data attribute:

```js
const container = page.locator(experimentContainer);
await expect(container).toBeVisible();
```

### `takeScreenshot(page, marketCode, name, testInfo)`

Captures the experiment container and attaches the image to the Playwright HTML report:

```js
await takeScreenshot(page, market.code, 'after-render', testInfo);
```

### `mockProductApi(page, overrides?)`

Product-card helpers route `**/product/card/detail/**` and return a stable model. Override fields for focused cases:

```js
await setupPage(page, market, testInfo, {
    mockFn: (currentPage) =>
        mockProductApi(currentPage, {
            promotionPrice: 999.99,
            displayName: 'Test device',
        }),
});
```

## Multi-market parametrisation

The `for...of` loop creates one independent test per market. `SEBN`, for example, creates tests for Belgium Dutch, Belgium French, and Netherlands.

## URL configuration

```js
export const urlsConfig = {
    baseUrl: 'https://samsung.com',
    bundlePath: 'dist/v1/v1.js',
    markets: [{ code: 'UK', urlPath: 'uk', name: 'United Kingdom' }],

    getUrl(marketCode, pagePath) {
        const market = this.markets.find((item) => item.code === marketCode);
        if (!market) throw new Error(`Unknown market: ${marketCode}`);
        const base = this.baseUrl.replace(/\/$/, '');
        return `${base}/${market.urlPath}${pagePath}`;
    },
};
```

Change the page path in `setupPage()` when the experiment belongs to a route other than `/`.

## Add assertions

```js
test(`price renders - ${market.name}`, async ({ page }, testInfo) => {
    await setupPage(page, market, testInfo);

    const container = page.locator(experimentContainer);
    const price = container.locator('[class*="price"]');
    await expect(price).toBeVisible();
    await expect(price).not.toBeEmpty();
});
```

Keep assertions scoped to the injected container so unrelated host-page changes do not make the test noisy.
