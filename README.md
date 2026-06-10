# Experiment Docs

Documentation for the Experiment Framework, an internal toolkit for scaffolding
and delivering Adobe Target experiments with Vite and Preact.

This repository contains the VitePress documentation site. The scaffolder,
runtime, templates, and command-line tools are maintained separately in
[experiment-framework-v2](https://github.com/andi-sogody/experiment-framework-v2).

## Documentation

Start with the [documentation home](docs/index.md) for framework setup, the
development workflow, API references, testing guidance, and troubleshooting.

The source repository for this site is
[Aldisogody/v2-docs-for-devs](https://github.com/Aldisogody/v2-docs-for-devs).

## Local Development

### Prerequisites

- Node.js 18 or newer. Node.js 24 is recommended.
- pnpm 10.

Install dependencies and start the VitePress development server:

```bash
pnpm install
pnpm docs:dev
```

Other available commands:

| Command | Purpose |
| --- | --- |
| `pnpm docs:dev` | Start the local documentation server with hot reload. |
| `pnpm docs:build` | Build the production documentation site. |
| `pnpm docs:preview` | Preview the production build locally. |

## Repository Structure

```text
.
├── docs/
│   ├── .vitepress/
│   │   ├── config.mts       # Site metadata, navigation, and sidebar
│   │   └── theme/           # Custom components and styles
│   ├── getting-started/     # Installation and onboarding
│   ├── development/         # Experiment development workflow
│   ├── framework-api/       # Runtime API reference
│   ├── e2e-testing/         # Playwright guidance
│   └── reference/           # Commands, markets, migration, and contributing
├── package.json
└── pnpm-lock.yaml
```

## Contributing

When adding or changing documentation:

1. Edit or create the relevant Markdown file under `docs/`.
2. Update `docs/.vitepress/config.mts` when navigation changes.
3. Link new pages from a related page.
4. Run `pnpm docs:build`.
5. Inspect the rendered page when changing navigation, code blocks, components,
   or layout.

Keep examples aligned with the current framework source, particularly the CLI,
templates, runtime helpers, generated commands, and market definitions. See the
[contributing guide](docs/reference/contributing.md) for the full workflow and
accuracy checklist.
