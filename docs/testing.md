# Testing

Add E2E coverage when a stable experiment needs repeatable checks before release. Early prototypes are usually faster to verify in the Adobe Target preview.

## Testing checklist

- Confirm the experiment has a stable target URL.
- Confirm the selector in `src/config.js` works on the target page.
- Run `pnpm build` before debugging browser tests.
- Run `pnpm test:e2e` after the build passes.
- Add assertions for experiment-owned behavior only.

## Decide when to add E2E

| Situation | Add E2E? | Why |
|---|---|---|
| First scaffold or early prototype | No | The target page, selector, and copy may still change quickly. |
| Stable Target activity with repeated QA | Yes | Playwright gives the team a repeatable smoke check. |
| Multi-market launch | Yes | Market iterations catch URL and locale-specific selector issues. |
| One-off copy or style tweak | Usually no | Manual Target preview is often enough unless the release risk is high. |

Get the watch, paste, and preview loop working before adding E2E.

## What gets generated

When you answer yes to the E2E prompt, the scaffold adds:

```text
e2e/
  config.js
  helpers.js
  smoke.spec.js
playwright.config.js
```

It also adds:

```json
{
    "scripts": {
        "test:e2e": "pnpm build && playwright test"
    }
}
```

## Setup

If the CLI generated E2E files, it also runs Playwright browser setup during project creation. If you clone or restore an E2E-enabled project later, install the browser manually:

```bash
pnpm playwright install chromium
```

Run tests with:

```bash
pnpm test:e2e
```

This command builds first, then runs Playwright. Fix lint or build errors before debugging the browser test.

## Generated files

| File | Purpose |
|---|---|
| `playwright.config.js` | Uses `./e2e`, Desktop Chrome, HTML reporter, failure screenshots, and CI retries. |
| `e2e/config.js` | Stores `baseUrl`, `bundlePath`, markets, and URL construction. |
| `e2e/helpers.js` | Loads the IIFE bundle, prepares the page, injects the bundle, and captures screenshots. |
| `e2e/smoke.spec.js` | Runs one smoke test per configured market. |

## Smoke test flow

For each configured market, the generated smoke test:

1. Build `dist/v1-index.jsx` through `pnpm test:e2e`.
2. Resolve the market URL from `e2e/config.js`.
3. Navigate to the page.
4. Inject or find the target element.
5. Add the IIFE bundle to the page.
6. Wait for the selector-derived experiment container.
7. Attach screenshots or page metadata to the Playwright report.

## Markets

Market groups expand into one test iteration per country. You can combine a group with individual countries; the framework removes duplicate countries and restores canonical order. For example, `BENELUX` plus `DE` runs Belgium Dutch, Belgium French, Netherlands, and Germany.

Use `e2e/config.js` when you need to adjust market coverage after scaffolding:

```js
export const urlsConfig = {
    baseUrl: 'https://www.samsung.com',
    bundlePath: 'dist/v1-index.jsx',
    markets: [{ code: 'UK', urlPath: 'uk', name: 'United Kingdom' }],
};
```

Custom market codes fall back to lowercase URL paths in the scaffolder.

## Add experiment assertions

Start from the smoke test. Add assertions after setup finishes:

```js
test(`cta renders - ${market.name}`, async ({ page }, testInfo) => {
    await setupPage(page, market, testInfo);
    const container = page.locator(experimentContainer);
    await expect(container.getByRole('link', { name: /shop/i })).toBeVisible();
});
```

Keep assertions focused on experiment behavior. Avoid testing Samsung page features that the experiment does not own.

## Failure modes

| Symptom | Check |
|---|---|
| `pnpm test:e2e` fails before opening a browser | Fix `pnpm build` first. The test command builds before Playwright runs. |
| Browser install is missing | Run `pnpm playwright install chromium`. |
| Tests pass in one market and fail in another | Check market URL paths and selectors in `e2e/config.js`. |
| Screenshot shows the page but not the experiment | Confirm `bundlePath` points to the built variation. |

## Related pages

- [E2E Testing](/e2e-testing/)
- [Markets Reference](/reference/markets)
- [Framework API](/framework-api/)
