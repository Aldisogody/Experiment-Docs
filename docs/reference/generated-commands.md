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

## Testing

| Command | What it does | Available |
|---|---|---|
| `pnpm test:e2e` | Runs Playwright tests in `e2e/`. | Only when E2E was enabled at scaffold time |

## Notes

- `pnpm build` is the only command that enforces a clean lint gate (build aborts on lint errors).
- `pnpm lint` in watch mode reports errors but does not abort the watcher.
- All commands require Node 18+ and pnpm 10+. Run `nvm use` first so the generated `.nvmrc` selects the project Node version.
