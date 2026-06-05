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

The `product-card` boilerplate includes product-card component styles and can copy per-variation `src/js/vN/styles.module.scss` files when you add new variations.

Keep shared component styles in `src/components/*/styles.module.scss`. Use per-variation styles only when the variation needs layout or presentation changes that should not affect other variations.
