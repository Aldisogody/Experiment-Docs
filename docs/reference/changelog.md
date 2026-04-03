# Changelog

## v2.0.0

### Breaking changes

- **ESLint removed** — generated projects now use [Biome](https://biomejs.dev) for both linting and formatting. Do not add `.eslintrc` files to generated projects.
- **Node 20 minimum** — Node 16 and 18 are no longer supported. Node 24 is recommended.
- **pnpm 10.30.1 required** — the `packageManager` field in generated `package.json` files is locked to `pnpm@10.30.1`.

### New features

- Biome replaces ESLint: faster, zero-config, single tool for lint and format
- `noConsole: error` enforced at build time — prevents accidental `console.log` in production bundles
- `watchFor()` added to `lib/framework.js` — MutationObserver-based alternative to `waitFor` with auto-disconnect timeout
- 30+ Samsung markets available for E2E test configuration
- Multi-country market groups (SEBN, SENA, SEIB) for multi-locale E2E parametrisation
- Local search in documentation (`search.provider: 'local'`)

### Migration from v1

For step-by-step instructions including before/after code examples, see the [Migration Guide](/reference/migration).

**Summary:**

1. Remove `node_modules/` and any `.eslintrc*` files
2. Add `biome.json` (copy from a freshly scaffolded project)
3. Update `package.json` scripts: replace `eslint` commands with `biome check src`
4. Run `nvm use 24` and reinstall: `pnpm install`
5. Run `pnpm lint` and fix any Biome violations
