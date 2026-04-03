# Contributing

This page covers how to contribute to the `experiment-framework-v2` scaffolder and its documentation. The project is an internal Sogody/Samsung tool — contributions are from team members only.

## Get the repository

```bash
git clone https://github.com/andi-sogody/experiment-framework-v2.git
cd experiment-framework-v2
```

All paths below are relative to this repository root.

## Repository layout

```
(repo root)/
├── experiment-framework-v2/  ← CLI scaffolder (main project)
├── v2-framework/             ← This VitePress documentation site
├── new-experiment/           ← Generated experiment used as a reference
└── old-experiment/           ← Legacy reference — read-only, do not modify
```

---

## Contributing to the documentation

### Run the docs site locally

```bash
cd v2-framework
nvm use 24
pnpm install
pnpm docs:dev
```

The dev server starts at `http://localhost:5173`. Changes to `.md` files hot-reload immediately.

### Add a new documentation page

1. Create the `.md` file in the appropriate section directory under `v2-framework/docs/` (e.g. `v2-framework/docs/development/my-page.md`).
2. Add a sidebar entry in `v2-framework/docs/.vitepress/config.mts` under the matching section key.
3. Link to the new page from at least one related existing page.
4. Run `pnpm docs:build` from `v2-framework/` and confirm the build passes with no errors.

### Edit an existing page

Edit the `.md` file directly under `v2-framework/docs/`. Follow the content style established in the existing pages:

- Second person ("you"), active voice, present tense
- Every code block must be syntactically correct and runnable
- No filler words: "simply", "just", "obviously"
- Use callout blocks (`::: tip`, `::: warning`, `::: danger`) sparingly — no more than 3 per page

### Submit a documentation PR

1. Create a feature branch: `git checkout -b docs/your-change-description`
2. Make your changes and verify locally with `pnpm docs:dev`
3. Run `pnpm docs:build` — the PR must not introduce build errors
4. Open a pull request against `main` on [GitHub](https://github.com/andi-sogody/experiment-framework-v2)
5. Request review from at least one other team member

---

## Contributing to the scaffolder

### Run the scaffolder locally

From the repo root:

```bash
cd experiment-framework-v2
nvm use 24
pnpm install
pnpm test          # vitest run (single pass)
pnpm test:watch    # vitest watch mode
```

### Adding a new CLI prompt

1. Edit `experiment-framework-v2/generator/index.js` — add the new prompt to the `prompts` array
2. Add a corresponding test in `experiment-framework-v2/test/generator.test.js`
3. Run `pnpm test` to confirm all existing tests still pass

### Modifying the template

The scaffolder copies files from `experiment-framework-v2/template/`. Changes here affect all future scaffolded projects.

1. Make your change in `experiment-framework-v2/template/`
2. Verify the generated output by scaffolding a test project: `node cli.js test-output`
3. Run `pnpm test` to check generated project assertions

---

## Reporting bugs

Open an issue at [github.com/andi-sogody/experiment-framework-v2/issues](https://github.com/andi-sogody/experiment-framework-v2/issues) with:

- A description of the expected and actual behaviour
- The exact command you ran
- Your Node and pnpm versions (`node --version`, `pnpm --version`)
- Any error output (full terminal output, not just the last line)

For documentation bugs (broken links, incorrect code examples, outdated instructions), label the issue `documentation`.
