# Contributing

The scaffolder and documentation are separate repositories in the local workspace.

| Project | Repository |
|---|---|
| Scaffolder and runtime | [andi-sogody/experiment-framework-v2](https://github.com/andi-sogody/experiment-framework-v2) |
| Documentation site | [Aldisogody/v2-docs-for-devs](https://github.com/Aldisogody/v2-docs-for-devs) |

## Documentation workflow

```bash
cd v2-framework
nvm use 24
pnpm install
pnpm docs:dev
```

When adding a page:

1. Create the Markdown file under `docs/`.
2. Add it to `docs/.vitepress/config.mts`.
3. Link it from a related page.
4. Run `pnpm docs:build`.
5. Inspect the rendered page when the change affects navigation, code blocks, or layout.

Keep examples aligned with current source in `experiment-framework-v2`, especially:

- `cli.js` for interactive defaults.
- `template/` and `template-minimal/` for generated files.
- `runtime/framework.js` for API behavior.
- `bin/` for generated commands.
- `lib/markets.js` for E2E market choices.

## Scaffolder workflow

```bash
cd experiment-framework-v2
nvm use 24
pnpm install
pnpm test
```

The project uses ESM, Vitest, node-plop, 2-space indentation in repository source, and focused modules under `lib/` and `generator/`.

## Template changes

Update the source template rather than a generated sample:

- Shared files: `template/`
- Minimal overrides: `template-minimal/`
- File selection: `lib/scaffold-plan.js`
- Plop adapter: `generator/actions.js`

Add or update tests that generate real files in a temporary directory. Run the full suite before opening a pull request.

## Documentation accuracy checklist

- CLI defaults match `cli.js`.
- File trees match scaffold tests and templates.
- Runtime signatures match `runtime/framework.js`.
- Market codes and URLs match the current market references.
- Examples avoid legacy package names and copied runtime files.
- AI instruction files remain opt-in and their paths match the init binaries.
- Commands are run from the correct repository or generated project root.

## Pull requests

Use a Conventional Commit title such as `docs: update live injection guide` or `fix: correct minimal scaffold output`. Include the validation commands you ran and call out any behavior that exists on `main` but is not yet published.
