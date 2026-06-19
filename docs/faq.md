---
title: FAQ
---

# FAQ

## Which boilerplate should I choose?

Use `minimal` for most UI, copy, button, and layout experiments. Use `product-card` when you need Samsung product data from the generated helpers.

## Why does `pnpm start 0` watch `v1`?

The command argument is a zero-based index. `0` maps to `v1`, `1` maps to `v2`, and so on.

## Does Preact need to exist on the target page?

No. Each IIFE bundle includes Preact and imported component styles.

## Where should selectors live?

Keep them in `src/config.js` as `selectors.primary` and ordered `selectors.fallbacks`. Pass both to `mountExperiment()`.

## Why did `setupTracking()` do nothing?

It returns silently when `options.selector` does not match inside the container. Call it after `render()` and verify the selector. The default is `'a'`; the minimal button scaffold passes `'button'`.

## Can I add E2E tests later?

Yes, but there is no add-on command. Scaffold a temporary E2E-enabled project with the same boilerplate and copy `playwright.config.js`, `e2e/`, the Playwright dependency, and the `test:e2e` script.

## What AI support can I add?

`CLAUDE.md` and `AGENTS.md` are repository-wide instructions for tools that
read those files. They are opt-in and ignored by Git in a generated project by
default. Create them with `pnpm init-claude` and `pnpm init-agents`. See
[AI Project Support](/development/ai-project-support).

## Does `includeEmergencyBrake` change the current bundle?

The scaffold records the field in `experiment.config.js`, but the current package build and runtime do not read it. Verify the deployment integration before relying on it as a kill switch.

## Why does `pnpm live` fail before opening a browser?

Common causes are a missing Chromium install, an invalid `targetUrl`, no matching selector, or a variation index that does not exist. Run `pnpm dlx playwright install chromium` for the browser.

## Can I use JavaScript template literals?

Yes. The generated Vite build follows normal JavaScript handling for template literals.

## Where is Stylelint?

It is not generated. Biome checks JavaScript, JSX, and JSON; Sass compiles SCSS during the build. Follow the [SCSS Modules conventions](/linting/stylelint).

See [Error Reference](/error-reference) for command-specific failures.
