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
   - The `uniqueBuild` call: `uniqueBuild('v1')` → `uniqueBuild('v2')`
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

Every variation entry point checks for the `data-injected-experiment` attribute before doing anything:

```js
const { uniqueId, injectedSelector } = uniqueBuild('v1');
if (!target || document.querySelector(injectedSelector)) return;
```

The `uniqueId` is `{testName}-v1`. The guard prevents the experiment from injecting twice if Adobe Target fires the custom code more than once — which can happen on single-page applications during navigation or re-renders.

::: warning SPA pages
On Samsung's SPA pages, Adobe Target may re-execute custom code on route changes. The dedup guard is the primary defence. Do not remove it.
:::
