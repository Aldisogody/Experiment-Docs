# AI Project Support

Generated experiments can opt into project-specific instructions for Claude Code,
Codex-compatible agents, and similar tools. Nothing is installed during normal scaffolding.
Run only the commands needed by your team from the generated project root:

```bash
pnpm init-claude
pnpm init-agents
```

| Command | Output |
|---|---|
| `pnpm init-claude` | `CLAUDE.md` |
| `pnpm init-agents` | `AGENTS.md` |

The commands infer the package name and E2E setup from the existing project.
The generated `.gitignore` excludes `CLAUDE.md`, `AGENTS.md`,
`.agents`, `.claude`, and `.cursor`, so these files remain local unless the team
deliberately changes that policy.

## Instruction files

`CLAUDE.md` and `AGENTS.md` provide repository-wide instructions that an
appropriate agent reads while working in the project. Use them for stable rules,
commands, architecture, and verification expectations.

Both commands refuse existing files unless passed `-- --force`.

## Older projects

After upgrading the `@sogody/experiment-framework` dependency, an older generated project
without the package scripts can call the package-owned binaries directly:

```bash
pnpm exec exp-init-claude
pnpm exec exp-init-agents
```

Run them from a project root containing a valid `package.json` and either
`experiment.config.js` or `src/config.js`.

## Customize generated guidance

Review the generated Markdown before relying on it. The files are intentionally
local by default, so teams can adjust commands, verification steps, or workflow
rules without changing the scaffolded project.

To share AI support through Git, remove only the relevant entries from the
generated `.gitignore` and review the content for project-specific or sensitive
information before committing it.

See [Generated Commands](/reference/generated-commands) for the concise command
reference and [Error Reference](/error-reference) for setup failures.
