# Styling (SCSS Modules)

Generated projects use Sass CSS Modules for UI styles. Biome does not lint SCSS, and the active templates do not generate a `.stylelintrc` file.

Use this page as the styling convention reference.

## CSS Modules

Component styles live beside the component:

```text
src/components/ExperimentButton/
  index.jsx
  styles.module.scss
```

Import styles locally:

```jsx
import style from './styles.module.scss';

export default function ExperimentButton({ text }) {
    return <button class={style.button}>{text}</button>;
}
```

Vite scopes CSS Module class names automatically, so `.button` does not leak into the Samsung page.

## Class names

Use camelCase class names in SCSS:

```scss
.cardWrapper {
    display: flex;
}
```

Then reference the same name in JSX:

```jsx
<div class={style.cardWrapper}>...</div>
```

The generated `vite.config.js` sets:

```js
css: {
    modules: {
        localsConvention: 'camelCase',
        generateScopedName: '{{ classPrefix }}-[local]',
    },
}
```

The generated class prefix comes from the project folder name, so different experiments are less likely to collide.

## Sass helpers

Generated projects load shared Sass helpers from `@sogody/experiment-framework/runtime/scss`:

```js
preprocessorOptions: {
    scss: {
        loadPaths: [resolve(__dirname, 'node_modules/@sogody/experiment-framework/runtime/scss')],
        additionalData: `
            @use "media-queries" as *;
            @use "fluid-property" as *;
        `,
    },
}
```

That means component SCSS can use the framework media-query and fluid-property helpers without adding local imports.

## Style locations

The scaffold keeps component styling inside `ExperimentButton`.

Generated variations include **mount-root** styles in `src/js/v1/styles.module.scss`. This file styles the outer wrapper created by `mountExperiment()`, not the Preact component inside it.

```text
src/js/v1/
  index.jsx
  styles.module.scss   # mount wrapper — pass style.root to mountExperiment()
```

Keep shared component styles in `src/components/*/styles.module.scss`. Extend per-variation mount styles when a variation needs different wrapper layout or spacing. `pnpm new-variation N` copies `v1/styles.module.scss` into the new variation folder when the file exists.

See [mountExperiment()](/framework-api/mount-experiment) for usage examples.

## Shared mixins

### Media queries

```scss
.card {
    @include mq($from: md) {
        display: grid;
    }

    @include mq($from: sm, $until: lg) {
        gap: 16px;
    }
}
```

| Name | Value |
|---|---|
| `xs` | `360px` |
| `sm` | `425px` |
| `md` | `768px` |
| `lg` | `1200px` |
| `xl` | `1440px` |

### Fluid properties

```scss
.button {
    @include fluid-property(sm, 'padding', 12px, 24px);
}
```

The mixin emits pixel fallback values followed by viewport-width values based on the supplied breakpoint.
