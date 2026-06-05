# Variations

## Variation numbering

Variations are numbered from 1. In a standard A/B test:

- `v1` — control (no change, or baseline treatment)
- `v2` — treatment A
- `v3` — treatment B (A/B/C test)

## Adding a variation manually

The scaffolder generates `v1` and any additional variations you requested. To add another variation later:

1. Copy the existing variation directory:
   ```bash
   cp -r src/js/v1 src/js/v2
   ```

2. Open `src/js/v2/index.jsx` and update:
   - The tracking label: `'my-experiment: v1 cta clicked'` → `'my-experiment: v2 cta clicked'`
   - Any selectors or component props specific to this variation

3. Copy the variation styles if applicable:
   ```bash
   cp src/js/v1/styles.module.scss src/js/v2/styles.module.scss
   ```

4. Build to confirm the new variation compiles:
   ```bash
   pnpm build
   # dist/v1/v1.js
   # dist/v2/v2.js
   ```

## Developing a specific variation

```bash
pnpm start 0   # variation 1 (src/js/v1/)
pnpm start 1   # variation 2 (src/js/v2/)
pnpm start 2   # variation 3 (src/js/v3/)
```

The index is always zero-based. Only one variation is watched at a time — switch by restarting with a different number.

## Production build

```bash
pnpm build
```

Builds all variations in parallel. Output:

```
dist/
├── v1/
│   └── v1.js
├── v2/
│   └── v2.js
└── vN/
    └── vN.js
```

Biome runs before the build. The build aborts if linting fails.

## Dedup guard

On Samsung's SPA pages, Adobe Target may re-execute custom code on route changes, causing the experiment to mount twice. `mountExperiment` does not include a built-in dedup guard — if your target page is an SPA, add a manual check before mounting:

```js
runScript(async () => {
    if (document.querySelector('[data-injected-experiment]')) return;

    const container = mountExperiment(targetSelector, fallbackSelector);
    if (!container) return;

    container.dataset.injectedExperiment = testName;
    render(<MyComponent />, container);
    setupTracking(container, { label: 'my-experiment: v1 cta clicked' });
});
```

Set `container.dataset.injectedExperiment` immediately after mounting so subsequent runs hit the guard.

::: warning SPA pages
If you omit the dedup guard on an SPA, the component will mount multiple times on navigation. Add it whenever the target page uses client-side routing.
:::
