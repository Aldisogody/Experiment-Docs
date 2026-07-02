---
title: Tutorial
---

# Tutorial

Build a button experiment from scaffold to production bundle. Use [Quick Start](/getting-started/quick-start) when you want the shortest version of the same workflow.

## 1. Scaffold

```bash
npx @sogody/experiment-framework button-cta-test
cd button-cta-test
nvm use
```

Choose one variation, the default `sgd` namespace, the default emergency brake setting, and no E2E testing for this walkthrough.

## 2. Configure the Target

Update `src/config.js`:

```js
export const selectors = {
    primary: '[data-testid="product-list"]',
    fallbacks: ['main', 'body'],
};

export const buttonText = 'Shop now';
```

Keep the selector chain ordered from the most specific target to the broadest fallback.

## 3. Review the Entry Point

`src/js/v1/index.jsx` mounts the wrapper, renders the button, and attaches tracking:

```jsx
const container = mountExperiment(selectors.primary, selectors.fallbacks, 'afterbegin', {
    className: style.root,
    dataset: { experiment: 'button-cta-test' },
});
if (!container) return;

render(<ExperimentButton text={buttonText} />, container);

setupTracking(container, {
    label: 'button-cta-test: v1 button clicked',
    selector: 'button',
});
```

Tracking stays after `render()` so the button exists before `setupTracking()` queries it.

## 4. Style the Button

Edit `src/components/ExperimentButton/styles.module.scss` for the visible UI. Edit `src/js/v1/styles.module.scss` only when the mount wrapper needs layout changes.

## 5. Preview

```bash
pnpm start 0
```

Paste the copied bundle into Adobe Target, or configure `targetUrl` in `experiment.config.js` and run:

```bash
pnpm live
```

## 6. Build

```bash
pnpm lint:fix
pnpm ci:lint
pnpm build
```

The final bundle is `dist/v1-index.jsx`.
