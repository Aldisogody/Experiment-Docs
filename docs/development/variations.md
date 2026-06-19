# Variations

## Variation numbering

Variations are numbered from 1. In a standard A/B test:

- `v1` - control (no change, or baseline treatment)
- `v2` - treatment A
- `v3` - treatment B (A/B/C test)

## Adding a variation

The scaffolder generates `v1` and any additional variations you requested. To add another variation later, use the generated command:

```bash
pnpm new-variation 3
```

This creates `src/js/v3/index.jsx` from `v1`. The command also copies `src/js/v1/styles.module.scss` when present (both boilerplates scaffold this file for mount-root styling).

After creation, open `src/js/v3/index.jsx` and update:

- The tracking label, for example `my-experiment: v3 cta clicked`.
- Any selectors, props, component logic, or styles specific to this variation.

Build to confirm the new variation compiles:

```bash
pnpm build
# dist/v1-index.jsx
# dist/v2-index.jsx
# dist/v3-index.jsx
```

## Developing a specific variation

```bash
pnpm start 0   # variation 1 (src/js/v1/)
pnpm start 1   # variation 2 (src/js/v2/)
pnpm start 2   # variation 3 (src/js/v3/)
```

The index is always zero-based. Only one variation is watched at a time - switch by restarting with a different number.

## Production build

```bash
pnpm build
```

Builds all variations in parallel. Output:

```
dist/
├── v1-index.jsx
├── v2-index.jsx
└── vN-index.jsx
```

Biome runs before the build. The build aborts if linting fails.

## Dedup guard

On Samsung's SPA pages, Adobe Target may re-execute custom code on route changes, causing the experiment to mount twice. `mountExperiment` does not include a built-in dedup guard - if your target page is an SPA, add a manual check before mounting:

```js
import style from './styles.module.scss';

runScript(async () => {
    const marker = 'my-experiment-v1';
    if (document.querySelector(`[data-experiment="${marker}"]`)) return;

    const container = mountExperiment(selectors.primary, selectors.fallbacks, 'afterbegin', {
        className: style.root,
        dataset: { experiment: marker },
    });
    if (!container) return;

    render(<MyComponent />, container);
    setupTracking(container, { label: 'my-experiment: v1 cta clicked' });
});
```

Set the marker immediately after mounting so subsequent runs hit the guard.

::: warning SPA pages
If you omit the dedup guard on an SPA, the component will mount multiple times on navigation. Add it whenever the target page uses client-side routing.
:::
