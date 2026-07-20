# Migration Guide

This checklist covers the migration from the legacy Gulp framework to the current Vite-based framework. It follows the tested `legacy-experiment-test` migration and keeps the experiment's existing behavior unchanged.

## 1. Record the current behavior

Before changing files, note these values:

- `package.json.name`;
- `targetUrl`, `globalObject`, and `includeEmergencyBrake` from `config.json`;
- the variation entry points;
- where the experiment mounts;
- the visible behavior and styles that must still work.

Commit or back up the project before continuing.

## 2. Replace the package setup

Add `"type": "module"`, Node and pnpm requirements, the current scripts, and the v2.1 dependencies:

```json
{
    "type": "module",
    "engines": {
        "node": ">=20.19.0",
        "pnpm": ">=10.26.0"
    },
    "scripts": {
        "start": "exp-start",
        "dev": "exp-build --watch",
        "build": "exp-build",
        "new-variation": "exp-new-variation",
        "add-e2e": "exp-add-e2e",
        "lint": "biome check src",
        "format": "biome check --write src",
        "live": "exp-live"
    },
    "dependencies": {
        "preact": "^10.29.2"
    },
    "devDependencies": {
        "@biomejs/biome": "^2.5.0",
        "@preact/preset-vite": "^2.10.5",
        "@sogody/experiment-framework": "^2.1.0",
        "esbuild": "^0.27.0",
        "sass": "^1.101.0",
        "vite": "^8.0.16"
    }
}
```

Add `.nvmrc` containing `24`.

## 3. Add the new build files

Copy these files from a project generated with the same framework version:

- `vite.config.js`;
- `biome.json`;
- `jsconfig.json`;
- `pnpm-workspace.yaml`;
- `.editorconfig` and `.gitignore`.

In `vite.config.js`, update the package name, global object, emergency-brake value, and CSS Module prefix for the experiment. Keep the standard aliases such as `@components` and keep Preact bundled.

The main file changes are:

| Legacy | Current |
|---|---|
| `Gulpfile.js` | `vite.config.js` |
| `config.json` | `experiment.config.js` |
| `yarn.lock` | `pnpm-lock.yaml` |
| `.babelrc`, ESLint, Stylelint | `biome.json`, `jsconfig.json` |
| imported `styles.scss` | `styles.module.scss` |

## 4. Convert the experiment config

Create `experiment.config.js` using the values from `config.json`. Runtime values must be inside `runtime`, and `targetUrl` must include the protocol:

```js
export default {
    targetUrl: 'https://www.sogody.com',
    runtime: {
        globalObject: 'sgd',
        includeEmergencyBrake: true,
    },
    live: {
        variation: 0,
        overlay: 'visible',
        profile: 'ephemeral',
    },
};
```

Standard entries under `src/js/*/index.jsx` are discovered automatically, so the old `entryPoints` list is normally unnecessary.

## 5. Update imports and styles

Import runtime helpers from the framework export and remove the old `withPreact` wrapper:

```js
import { render } from 'preact';
import { runScript } from '@sogody/experiment-framework/framework';

runScript(() => {
    render(<Experiment />, document.body);
});
```

Keep the experiment's existing mount and behavior. Moving to `mountExperiment` or adding tracking is a separate optional refactor.

When a stylesheet is imported as a class-name object, rename it to a CSS Module:

```diff
- import style from './styles.scss';
+ import style from './styles.module.scss';
```

Remove old Sass imports from `@sogody/experiment-framework/src/scss`. The Vite config loads the packaged Sass helpers automatically. Global styles can remain `styles.scss`, but import them without assigning the result:

```js
import './styles.scss';
```

## 6. Add live-preview selectors

`pnpm live` reads selectors from `src/config.js`. Add the experiment's real target, or use `body` when the experiment mounts directly there:

```js
export const selectors = {
    primary: 'body',
    fallbacks: [],
};
```

The entry point does not need to import these selectors unless it uses them at runtime.

## 7. Remove legacy files and validate

Remove the old build files and dependencies:

- `Gulpfile.js` and Gulp packages;
- `config.json` after copying its values;
- `.babelrc`, `.eslintrc`, `.eslintignore`, and `.stylelintrc`;
- Babel, Cross Env, legacy ESLint/Stylelint, and `@sogody/eslint-config` packages;
- `yarn.lock` and the old `node_modules` directory;
- empty or unused stylesheets.

Install and run the finite checks:

```bash
pnpm install
pnpm format
pnpm lint
pnpm build
```

Confirm that `dist/v1-index.jsx` is created and that the experiment still mounts, looks, and behaves as before. Test the watchers separately because they keep running until stopped:

```bash
pnpm start 0
pnpm live
```
