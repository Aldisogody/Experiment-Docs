# Scaffold Template

The scaffolder generates one small Adobe Target and Preact template: a button component, structured selectors, variation entry points, and package-owned build commands.

## Generated UI

The template includes:

- `src/components/ExperimentButton/` - a Preact button component with local Sass CSS Module styles.
- `src/config.js` - `selectors.primary`, ordered `selectors.fallbacks`, and `buttonText`.
- `src/helpers.js` - page-aware tracking label construction shared by control and variants.
- `src/js/vN/index.jsx` - variation entry points that mount, render, track impressions, and attach click tracking.
- `src/js/vN/styles.module.scss` - mount-wrapper styles passed to `mountExperiment()`.

## Extending the template

Add experiment-specific pieces inside the generated project:

- Replace `TRACKING_PROJECT` and `TRACKING_DESCRIPTION` in `src/helpers.js`, then keep other reusable experiment logic there.
- Replace or extend `ExperimentButton` when the UI needs a different component.
- Keep selectors and editable copy in `src/config.js` so variation entry points stay focused.

Older documentation and generated projects may mention `minimal`, `product-card`, or `template-minimal/`. Those were removed from the current scaffold; use the generated button template as the base for new work.
