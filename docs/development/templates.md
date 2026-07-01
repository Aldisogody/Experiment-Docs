# Scaffold Template

The scaffolder currently generates one generic Adobe Target / Preact template. It is intentionally small: a button component, structured selectors, per-variation entry points, and package-owned build commands.

## Generated UI

The template includes:

- `src/components/ExperimentButton/` - a Preact button component with local Sass CSS Module styles.
- `src/config.js` - `selectors.primary`, ordered `selectors.fallbacks`, and `buttonText`.
- `src/js/vN/index.jsx` - variation entry points that mount, render, and attach tracking.
- `src/js/vN/styles.module.scss` - mount-wrapper styles passed to `mountExperiment()`.

## When You Need More

Add experiment-specific pieces inside the generated project:

- Add `src/helpers.js` for reusable API calls, price formatting, or market-specific data logic.
- Replace or extend `ExperimentButton` when the UI needs a different component.
- Keep selectors and editable copy in `src/config.js` so variation entry points stay focused.

Older documentation and generated projects may mention `minimal`, `product-card`, or `template-minimal/`. Those were removed from the current scaffold; use the generated button template as the base for new work.
