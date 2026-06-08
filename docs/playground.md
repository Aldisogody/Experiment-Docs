---
title: Playground
---

# Playground

The framework does not ship a separate browser playground. Use a generated experiment plus live injection as the working playground because it exercises the same build and runtime path as Adobe Target.

## Create a disposable project

```bash
npx create-experiment framework-playground
cd framework-playground
nvm use
```

Choose `minimal` and one variation.

## Point it at a page

Set `targetUrl` and live options in `experiment.config.js`:

```js
export default {
    targetUrl: 'https://www.samsung.com/uk/smartphones/all-smartphones/',
    globalObject: 'sgd',
    includeEmergencyBrake: true,
    live: {
        variation: 0,
        overlay: 'visible',
        profile: 'ephemeral',
    },
};
```

Update `src/config.js` with a selector present on that page.

## Start live injection

```bash
pnpm live
```

The command starts the selected variation watcher, opens Chromium, injects the bundle, and reloads after bundle changes.

Useful overrides:

```bash
pnpm live -- --variation v2
pnpm live -- --url https://www.samsung.com/de/
pnpm live -- --overlay hidden
pnpm live -- --profile shared
```

`shared` preserves browser state in an OS cache directory. `ephemeral` uses a temporary profile removed when the command stops.

## Debug runtime decisions

Add `?expDebug=1` to the target URL and call `debug()` from the experiment. For a persistent toggle:

```js
localStorage.setItem('expDebug', '1');
```

Remove it with:

```js
localStorage.removeItem('expDebug');
```

Live injection verifies development behavior. Run `pnpm build` before using the final Adobe Target bundle.
