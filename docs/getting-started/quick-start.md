# Quick Start

Build and preview a small Vite + Preact experiment in Adobe Target. The walkthrough takes about 15 to 20 minutes, including time to find a stable selector on the target page.

::: tip Prerequisites
Use Node 24 and pnpm >=10.26.0. If you have not set them up yet, complete [Installation](/getting-started/installation) first.
:::

## What you will build

1. Scaffold a button experiment.
2. Use DevTools to find a stable CSS selector on the target page.
3. Choose where the experiment injects relative to that element (`afterbegin`, `beforeend`, and so on).
4. Paste a working bundle into Adobe Target and see the button on the page.

## Choose your path

| Goal | Use this path |
|---|---|
| First experiment | Follow this page end to end. |
| Existing Target activity | Scaffold, start watch mode, then paste into the matching variation. |
| Just exploring | Open [Playground](/playground). |
| Preparing release | Skip to [Run and Ship](/run-and-ship). |

## Step 1: Scaffold the project

```bash
npx @sogody/experiment-framework my-first-experiment
cd my-first-experiment
nvm use
```

When prompted:

| Prompt | Choose | Why |
|---|---|---|
| Number of variations | `1` | Keeps the first bundle focused. |
| Window namespace | `sgd` | Uses the team default. |
| Include emergency brake | `Yes` | Keeps the safety hook available. |
| Enable E2E testing | `No` | Add Playwright after the core loop works. |

If you are unsure, keep the default answer.

## Step 2: Know the two files you will edit first

The scaffold creates the full project. Start with these two files:

| File | What it controls |
|---|---|
| `src/config.js` | **Where** the experiment injects (`selectors`) and **what** the button says (`buttonText`). |
| `src/js/v1/index.jsx` | **How** the variation runs: wait for DOM → mount container → render UI → attach tracking. |

The variation entry point follows a fixed order:

```jsx
runScript(async () => {
    const container = mountExperiment(selectors.primary, selectors.fallbacks, 'afterbegin', {
        className: style.root,
        dataset: { experiment: 'my-first-experiment' },
    });
    if (!container) return;

    render(<ExperimentButton text={buttonText} />, container);

    setupTracking(container, {
        label: 'my-first-experiment: v1 button clicked',
        selector: 'button',
    });
});
```

- `runScript()` waits until the page DOM is ready.
- `mountExperiment()` finds your selector and inserts a wrapper `div`.
- `render()` puts the Preact button inside that wrapper.
- `setupTracking()` runs **after** render so the button exists.

If the button does not appear, check the selector and mount position first.

## Step 3: Find the mount point with DevTools

Before editing code, inspect the real target page in the browser.

### Open the target page

Use the URL from your Adobe Target activity, or the scaffold default in `experiment.config.js`:

```js
// experiment.config.js
export default {
    targetUrl: 'https://www.samsung.com/uk/smartphones/all-smartphones/',
    // ...
};
```

Open that URL in Chrome or Edge.

### Inspect the injection anchor

1. Open **DevTools** (`F12` or `Cmd+Option+I` on macOS).
2. Click the **element picker** (cursor icon in the top-left of DevTools).
3. Click the page region where the experiment should appear, such as a product grid, hero, or filter bar.
4. In the **Elements** panel, note the highlighted node and its stable attributes.

Prefer selectors that survive page reloads and market differences:

| Prefer | Avoid |
|---|---|
| `[data-testid="…"]`, `[data-component="…"]` | Random hashed classes such as `.css-1a2b3c` |
| Semantic wrappers: `main`, `[role="main"]` | `nth-child` chains that break when optional modules load |
| A unique class on a layout container | IDs that change per session |

### Test the selector

In the DevTools **Console** tab, verify the selector matches exactly one intended element:

```js
document.querySelector('[data-testid="product-list"]')
// → should return the element you want, not null
```

If it returns `null`, refine the selector. If it returns the wrong element, pick a more specific anchor.

### Choose the mount position

`mountExperiment()` inserts a wrapper **relative to the matched element**. Choose the position based on where the UI should land:

| Position | Where the wrapper goes | Typical use |
|---|---|---|
| `'afterbegin'` *(scaffold default)* | Inside the target, before its first child | Inject at the top of a section |
| `'beforeend'` | Inside the target, after its last child | Append inside a container |
| `'beforebegin'` | Immediately before the target element | Insert a full-width row above a block |
| `'afterend'` | Immediately after the target element | Insert below a section |

Visual model for target element `<section class="hero">`:

```text
beforebegin →  [ wrapper ] <section>…</section>
afterbegin  →  <section> [ wrapper ] …children… </section>
beforeend   →  <section> …children… [ wrapper ] </section>
afterend    →  <section>…</section> [ wrapper ]
```

Use DevTools to confirm the anchor has room for your UI. A crowded flex row may need `'afterend'` instead of `'afterbegin'`.

## Step 4: Configure selectors and mount position

### Set selectors in `src/config.js`

Replace the placeholders with the selector you tested in DevTools:

```js
export const selectors = {
    primary: '[data-testid="product-list"]',
    fallbacks: ['main', 'body'],
};

export const buttonText = 'Shop now';
```

Rules for the selector chain:

- `primary` is the preferred injection anchor. Keep it as specific as the page allows.
- `fallbacks` are tried in order after `primary`. Use them when templates differ across markets.
- Do not rely on `body` unless you intentionally want a last-resort full-page mount.

### Change the mount position when needed

The third argument to `mountExperiment()` in `src/js/v1/index.jsx` controls placement. The scaffold defaults to `'afterbegin'`.

Example: inject **below** the product list instead of inside it:

```jsx
const container = mountExperiment(selectors.primary, selectors.fallbacks, 'afterend', {
    className: style.root,
    dataset: { experiment: 'my-first-experiment' },
});
```

Save both files. You will rebuild in the next step.

## Step 5: Start watch mode

```bash
pnpm start 0
```

You should see:

```text
v1-index.jsx copied to clipboard
```

::: tip
Every save rebuilds the bundle and copies the latest output to your clipboard.
:::

Alternative: open the target page with live injection (uses `targetUrl` from `experiment.config.js`):

```bash
pnpm live
```

The overlay shows which selector matched. See [Run and Ship - Live injection](/run-and-ship#live-injection) for flags such as `--url` and `--overlay hidden`.

## Step 6: Paste into Adobe Target

1. Open your Adobe Target activity.
2. Open the **Custom Code** editor for variation 1.
3. Paste the clipboard contents.
4. Save and refresh the preview page.

::: warning
Paste the bundle into the matching Target variation. `pnpm start 0` builds `v1-index.jsx`.
:::

## Step 7: Verify and fix common issues

| Symptom | Likely cause | Fix |
|---|---|---|
| Nothing renders | Selector does not match on this page/market | Re-test in DevTools console on the **preview URL**; update `selectors.primary` |
| UI appears in the wrong place | Mount position does not match layout | Change `'afterbegin'` → `'afterend'` or `'beforeend'` in `src/js/v1/index.jsx` |
| UI flashes then disappears | SPA re-executes Target code | Add a dedup guard - see [mountExperiment SPA dedup](/framework-api/mount-experiment#spa-dedup-guard) |
| Button missing but bundle runs | `mountExperiment` returned `null` | Check fallback order; confirm `if (!container) return` is present |
| Click not tracked | Tracking runs before render | Keep `setupTracking()` **after** `render()` |

After each fix, save the file, wait for the clipboard message, paste the new bundle, and refresh the Target preview.

## Step 8: Build for shipping

```bash
pnpm build
```

The production bundle is written to:

```text
dist/v1-index.jsx
```

Before handoff, also run `pnpm format` and `pnpm lint`. See [Run and Ship](/run-and-ship) for the full release checklist.

If your team uses coding agents, [AI Project Support](/development/ai-project-support) explains how to add local instruction files.

## Next steps

- [Project Structure](/getting-started/project-structure) - full file map
- [Build an Experiment](/build-an-experiment) - components, styles, and tracking
- [`mountExperiment()`](/framework-api/mount-experiment) - mount options, styling, and edge cases
- [Run and Ship](/run-and-ship) - watch mode, live injection, variations
- [Testing](/testing) - optional Playwright coverage
