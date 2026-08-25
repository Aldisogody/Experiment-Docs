<!-- BEGIN:experiment-framework-agent-rules -->
# Experiment framework rules

Framework APIs and generated project conventions are version-specific. Before writing or reviewing experiment code:

1. Read the installed version from `node_modules/@sogody/experiment-framework/package.json`.
2. Read `node_modules/@sogody/experiment-framework/llms.txt` to discover the relevant installed documentation.
3. Follow only the relevant API reference or guide before changing code.
4. Verify framework behavior against installed declarations or source when documentation is not enough; do not rely on memory.
5. Inspect this experiment's existing source and configuration before choosing a pattern.
6. Run the applicable `pnpm lint`, `pnpm build`, and `pnpm test:e2e` checks after changes.

Treat the installed documentation as the source of truth instead of relying on remembered framework behavior.

## Team-wide source rules

- Preserve existing experiment behavior and conventions unless the requested task explicitly changes them.
- Keep market-specific copy, labels, selectors, URLs, and other experiment configuration in `src/config.js`.
- Keep reusable experiment utilities and tracking-label formatting in the generated `src/helpers.js`.
- Keep variation entry points focused on runtime orchestration, host-page DOM integration, rendering, and tracking setup. Keep components focused on rendering and interaction; pass configuration through props instead of embedding market data or reusable business logic.
- Put presentation styles in the appropriate `*.module.scss` file and use CSS Modules. Do not use inline style attributes, JSX `style` objects, or JavaScript-based presentational styling.
- Guard unsupported markets, missing configuration, missing DOM targets, and duplicate execution so experiment failures do not break the host page.
- Use semantic HTML and accessible controls, including accessible names, explicit button types, and keyboard-operable interactions.
- Follow the installed guides for selector fallbacks, market resolution, Adobe Target placeholders, analytics and impression tracking, DOM lifecycle, and verification. Track interactions owned by the experiment and disconnect one-shot observers after they fire.
<!-- END:experiment-framework-agent-rules -->

# Project-specific instructions

Framework refreshes keep content outside the managed block above.
