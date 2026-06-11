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
- `template/skills/` for opt-in project skill resources.
- `runtime/framework.js` for API behavior.
- `bin/` for generated commands.
- `lib/init-skills.js` for skill naming, destinations, preflight, staging, and rollback.
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
- Opt-in skill templates: `template/skills/`
- File selection: `lib/scaffold-plan.js`
- Plop adapter: `generator/actions.js`

Add or update tests that generate real files in a temporary directory. Run the full suite before opening a pull request.

Skill templates are package resources, not normal scaffold output.
`lib/scaffold-plan.js` must continue excluding `skills/**/*.hbs` along with
`AGENTS.md.hbs` and `CLAUDE.md.hbs`. A standard generated project must not
contain `.agents/skills/`, `.claude/skills/`, or `.cursor/skills/` until the
developer runs `init-skills`.

When changing `init-skills`:

- Keep `template/skills/scripts/new-variation-check.sh.hbs` executable after installation.
- Keep the checker read-only and validate its strict `vN` input behavior.
- Preserve identical output across the Codex, Claude Code, and Cursor destinations.
- Test minimal and product-card rendering, conditional E2E resources,
  duplicate preflight, `--force` stale-file removal, parent conflicts, rollback,
  metadata validation, and skill-name normalization.
- Run focused tests with `pnpm test test/init-skills.test.js` and scaffold
  exclusion tests with `pnpm test test/actions.test.js test/generator.test.js`
  before the full `pnpm test`.

## Documentation accuracy checklist

- CLI defaults match `cli.js`.
- File trees match scaffold tests and templates.
- Runtime signatures match `runtime/framework.js`.
- Market codes and URLs match the current market references.
- Examples avoid legacy package names and copied runtime files.
- AI instruction files and skills remain opt-in and their paths match `lib/init-skills.js`.
- Commands are run from the correct repository or generated project root.

## Pull requests

Use a Conventional Commit title such as `docs: update live injection guide` or `fix: correct minimal scaffold output`. Include the validation commands you ran and call out any behavior that exists on `main` but is not yet published.
