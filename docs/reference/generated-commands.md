# Generated Project Commands

All commands available in a generated experiment project. Run them from the project root after `pnpm install`.

## Development

| Command | What it does |
|---|---|
| `pnpm start 0` | Watch variation 1 (`src/js/v1/`). Rebuilds on save and copies IIFE bundle to clipboard. |
| `pnpm start 1` | Watch variation 2 (`src/js/v2/`). Clipboard copy enabled. |
| `pnpm start N` | Watch variation N+1. The argument is zero-indexed. |
| `pnpm dev` | Watch all variations simultaneously. No clipboard copy. |

## Build

| Command | What it does |
|---|---|
| `pnpm build` | Production build. Runs Biome lint first. Builds all variations to `dist/`. Aborts on lint errors. |
| `pnpm live` | Opens `targetUrl`, watches the selected bundle, and injects it into the page. |
| `pnpm new-variation N` | Creates `src/js/vN/index.jsx` from `v1`. |

Build output:
```
dist/
├── v1/v1.js   ← IIFE bundle for variation 1
├── v2/v2.js   ← IIFE bundle for variation 2
└── vN/vN.js
```

## Linting

| Command | What it does |
|---|---|
| `pnpm lint` | Runs `biome check src/`. Reports violations. Exits non-zero if any errors are found. |
| `pnpm format` | Runs `biome check --write src/`. Auto-fixes formatting violations in place. |

## Live injection options

```bash
pnpm live -- --variation v2
pnpm live -- --url https://www.samsung.com/de/
pnpm live -- --overlay hidden
pnpm live -- --profile shared
```

CLI flags override the matching values in `experiment.config.js`.

## Testing

| Command | What it does | Available |
|---|---|---|
| `pnpm test:e2e` | Runs Playwright tests in `e2e/`. | Only when E2E was enabled at scaffold time |

## AI documentation

AI instruction files are not generated automatically. Create either optional, project-local file from the generated project root:

| Command | Created file |
|---|---|
| `pnpm init-claude` | `CLAUDE.md` |
| `pnpm init-agents` | `AGENTS.md` |

The commands infer the experiment name, boilerplate type, and E2E setup from the existing project files. Review the generated instructions and adjust them for the experiment.

If the destination file already exists, the command leaves it unchanged. Replace it intentionally with:

```bash
pnpm init-claude -- --force
pnpm init-agents -- --force
```

Run these commands from the project root, where `package.json` and either `experiment.config.js` or `src/config.js` are present.

Older generated projects may not have the package scripts. After upgrading `create-experiment`, run the package-owned binaries directly:

```bash
pnpm exec exp-init-claude
pnpm exec exp-init-agents
```

## Notes

- `pnpm build` aborts on lint errors.
- Watch commands block an invalid bundle but keep the watcher running for the next save.
- All commands require Node 18+ and pnpm 10+. Run `nvm use` first so the generated `.nvmrc` selects the project Node version.
