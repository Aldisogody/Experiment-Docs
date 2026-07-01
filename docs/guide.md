---
title: Guide
---

# Guide

Use this guide to choose the right workflow after a project has been scaffolded.

## Start from the generated button scaffold

The CLI generates a single generic button template. Use it as the base for copy, CTA, layout, and small UI experiments. Add product API calls, custom data helpers, or replacement components only when the experiment needs them.

## Work in the generated layers

1. Put selectors and editable values in `src/config.js`.
2. Keep DOM mounting, data loading, rendering, and tracking in `src/js/vN/index.jsx`.
3. Keep Preact components focused on rendering props.
4. Keep component styles beside the component in `styles.module.scss`.
5. Put reusable API and formatting logic in `src/helpers.js` only when the experiment needs shared data helpers.

## Keep the runtime order

```jsx
runScript(async () => {
    const container = mountExperiment(selectors.primary, selectors.fallbacks);
    if (!container) return;

    render(<ExperimentComponent />, container);

    setupTracking(container, {
        label: 'my-experiment: v1 cta clicked',
        selector: 'button',
    });
});
```

Mount before rendering, guard a missing target, and attach tracking after rendering.

## Choose a preview loop

| Workflow | Command | Best use |
|---|---|---|
| Clipboard | `pnpm start 0` | Adobe Target custom-code iteration |
| Live injection | `pnpm live` | Repeated browser preview against `targetUrl` |
| All variations | `pnpm dev` | Confirm every variation still compiles |
| Production | `pnpm build` | Lint and create final IIFE bundles |

## Ship deliberately

Before handing off a bundle:

- Run `pnpm lint`.
- Run `pnpm build`.
- Preview every variation on the intended market URL.
- Verify selectors and fallback order.
- Verify click tracking labels and elements.
- Run `pnpm test:e2e` when the project includes Playwright.

Continue with [Build an Experiment](/build-an-experiment) for file-level guidance or [Run and Ship](/run-and-ship) for commands.
