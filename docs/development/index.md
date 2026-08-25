# Development

The usual development loop is short: save a file, paste the rebuilt bundle into Adobe Target, and refresh the preview.

## The inner loop

```
Edit source → Vite rebuilds → IIFE bundle → copied to clipboard → paste into Adobe Target → refresh preview
```

For browser-first iteration, `pnpm live` starts the same focused watcher, opens `targetUrl`, and reinjects after bundle changes.

## Sections

- [Watch Mode & Clipboard](/development/watch-mode) - `pnpm start 0`, clipboard mechanics, Adobe Target paste workflow
- [Variations](/development/variations) - adding v2/v3, the `-eN` flag, dedup guard
- [Configuration](/development/config) - `experiment.config.js` and `src/config.js` fields
- [Scaffold Template](/development/templates) - what the current generated project includes
- [AI Project Support](/development/ai-project-support) - version-matched guidance for coding agents
- [Run and Ship](/run-and-ship) - live injection, production builds, and handoff
