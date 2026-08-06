# Generated project commands

Run these commands from the root of a generated project after `pnpm install`.

## Development

| Command | What it does |
|---|---|
| `pnpm start 0` | Watch variation 1 (`src/js/v1/`). Rebuilds on save and copies IIFE bundle to clipboard. |
| `pnpm start 1` | Watch variation 2 (`src/js/v2/`). Clipboard copy enabled. |
| `pnpm start N` | Watch the variation at zero-based discovered order. Numeric `vN` folders come first, then named folders such as `control`. |
| `pnpm dev` | Watch all variations simultaneously. No clipboard copy. |

## Build

| Command | What it does |
|---|---|
| `pnpm build` | Production build. Runs Biome lint first. Builds all variations to `dist/`. Aborts on lint errors. |
| `pnpm live` | Opens `targetUrl`, watches the selected bundle, and injects it into the page. |
| `pnpm new-variation N` | Creates `src/js/vN/index.jsx` from `v1`. |
| `pnpm new-variation control` | Creates `src/js/control/index.jsx` from `v1`. |

The build writes:
```
dist/
├── v1-index.jsx   ← IIFE bundle for variation 1
├── v2-index.jsx   ← IIFE bundle for variation 2
├── vN-index.jsx
└── control-index.jsx
```

## Linting

| Command | What it does |
|---|---|
| `pnpm lint` | Runs `biome check src`. Reports violations without writing files. |
| `pnpm format` | Runs `biome check --write src`. Formats files and applies safe fixes. |

## Live injection options

```bash
pnpm live -- --variation v2
pnpm live -- --variation control
pnpm live -- --url https://www.samsung.com/de/
pnpm live -- --overlay hidden
pnpm live -- --profile shared
```

CLI flags override the matching values in `experiment.config.js`. `--variation`
accepts a zero-based index or a discovered folder name such as `v2` or `control`.

## Testing

| Command | What it does | Available |
|---|---|---|
| `pnpm test:e2e` | Runs Playwright tests in `e2e/`. | Only when E2E was enabled at scaffold time |

## AI project support

AI instruction files are optional. Create the file your tool uses from the generated project root:

| Command | Output |
|---|---|
| `pnpm init-claude` | `CLAUDE.md` |
| `pnpm init-agents` | `AGENTS.md` |

The commands infer the experiment name and E2E setup from the project files. Review the instructions before relying on them.

If a destination exists, the command stops without replacing it. Replace it
intentionally with:

```bash
pnpm init-claude -- --force
pnpm init-agents -- --force
```

Run these commands from the project root, where `package.json` and either `experiment.config.js` or `src/config.js` are present.

Older generated projects may not have the package scripts. After upgrading `@sogody/experiment-framework`, run the package-owned binaries directly:

```bash
pnpm exec exp-init-claude
pnpm exec exp-init-agents
```

See [AI Project Support](/development/ai-project-support) for generated
resources, local `.gitignore` behavior, and replacement behavior.

## Notes

- `pnpm build` aborts on lint errors.
- Watch commands block an invalid bundle but keep the watcher running for the next save.
- All commands require Node 20.19+ and pnpm >=10.26.0. Run `nvm use` first so the generated `.nvmrc` selects the project Node version. pnpm 11 requires Node 22 or newer.
