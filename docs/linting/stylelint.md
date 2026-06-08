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

Generated projects load shared Sass helpers from `create-experiment/runtime/scss`:

```js
preprocessorOptions: {
    scss: {
        loadPaths: [resolve(__dirname, 'node_modules/create-experiment/runtime/scss')],
        additionalData: `
            @use "media-queries" as *;
            @use "fluid-property" as *;
        `,
    },
}
```

That means component SCSS can use the framework media-query and fluid-property helpers without adding local imports.

## Boilerplate differences

The `minimal` boilerplate keeps styling inside the shared button component.

The `product-card` boilerplate includes product-card component styles. Neither boilerplate currently generates per-variation SCSS.

Keep shared component styles in `src/components/*/styles.module.scss`. Use per-variation styles only when the variation needs layout or presentation changes that should not affect other variations.

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
