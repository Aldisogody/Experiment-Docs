# Migration Guide

Use this guide to align a legacy generated experiment with the current package-owned runtime and commands. Commit or back up the project before changing build files.

## 1. Align Node and pnpm

Add or update `.nvmrc`:

```text
24
```

Then run:

```bash
nvm use
corepack prepare pnpm@10.30.1 --activate
```

## 2. Install package-owned tooling

Current generated projects keep Preact as a runtime dependency and `create-experiment` as a development dependency:

```json
{
    "dependencies": {
        "preact": "^10.28.3"
    },
    "devDependencies": {
        "@biomejs/biome": "^1.9.4",
        "@preact/preset-vite": "^2.10.5",
        "create-experiment": "^2.0.2",
        "sass": "^1.99.0",
        "vite": "^6.4.1"
    }
}
```

Remove legacy framework packages only after imports and scripts have been migrated.

## 3. Replace generated command scripts

```json
{
    "scripts": {
        "start": "exp-start",
        "dev": "exp-build --watch",
        "build": "exp-build",
        "new-variation": "exp-new-variation",
        "init-claude": "exp-init-claude",
        "init-agents": "exp-init-agents",
        "init-skills": "exp-init-skills",
        "lint": "biome check src",
        "format": "biome check --write src",
        "live": "exp-live"
    }
}
```

Replace older command names:

| Old | Current |
|---|---|
| `sogody-start` | `exp-start` |
| `sogody-build` | `exp-build` |
| `sogody-new-variation` | `exp-new-variation` |

### Optional AI project support

Current projects expose `init-claude`, `init-agents`, and `init-skills`
scripts, but AI support remains opt-in. Upgrade the `create-experiment`
dependency first. If the older project's `package.json` does not contain those
scripts, invoke the package-owned binaries directly from the project root:

```bash
pnpm exec exp-init-claude
pnpm exec exp-init-agents
pnpm exec exp-init-skills
```

They create `CLAUDE.md`, `AGENTS.md`, or identical skills under
`.agents/skills/`, `.claude/skills/`, and `.cursor/skills/` after inferring the
experiment name, boilerplate type, and E2E setup from the existing project.
See [AI Project Support](/development/ai-project-support) before forcing an
update over customized files.

## 4. Import the package runtime

Replace local or scoped framework imports:

```js
import {
    mountExperiment,
    runScript,
    setupTracking,
} from 'create-experiment/framework';
```

The generated project no longer needs a copied `lib/framework.js`.

## 5. Use structured selectors

```js
export const selectors = {
    primary: '.target-selector',
    fallbacks: ['.alternate-selector', 'body'],
};
```

Mount with:

```js
const container = mountExperiment(selectors.primary, selectors.fallbacks, 'afterbegin');
if (!container) return;
```

## 6. Update experiment config

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

`includeEmergencyBrake` is retained as a scaffold setting, but the current package build/runtime does not consume it.

## 7. Move to Biome

Remove ESLint, Prettier, and Stylelint scripts or packages that are no longer used. Copy `biome.json` from a newly generated project so globals and rule groups match the current scaffold.

```bash
pnpm format
pnpm lint
```

Direct `console` calls fail the generated Biome rules. Use framework `log()` or `debug()` for diagnostics.

## 8. Verify Vite compatibility

Use the generated Vite configuration as the baseline. Important current settings include:

- Preact bundled into each IIFE.
- `@components` mapped to `src/components`.
- CSS Module names formatted as `<project-prefix>-[local]`.
- Runtime Sass helpers loaded from `create-experiment/runtime/scss`.

## 9. Reinstall and validate

```bash
pnpm install
pnpm lint
pnpm build
pnpm start 0
```

Preview the bundle in Adobe Target or with `pnpm live`. For E2E-enabled projects, also run `pnpm test:e2e`.
