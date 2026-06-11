# AI Project Support

Generated experiments can opt into project-specific instructions for Claude Code,
Codex-compatible agents, and Cursor. Nothing is installed during normal scaffolding.
Run only the commands needed by your team from the generated project root:

```bash
pnpm init-claude
pnpm init-agents
pnpm init-skills
```

| Command | Output |
|---|---|
| `pnpm init-claude` | `CLAUDE.md` |
| `pnpm init-agents` | `AGENTS.md` |
| `pnpm init-skills` | The same reusable skill under `.agents/skills/`, `.claude/skills/`, and `.cursor/skills/` |

The commands infer the package name, boilerplate type, and E2E setup from the
existing project. The generated `.gitignore` excludes `CLAUDE.md`, `AGENTS.md`,
`.agents`, `.claude`, and `.cursor`, so these files remain local unless the team
deliberately changes that policy.

## Instruction files and project skills

`CLAUDE.md` and `AGENTS.md` provide repository-wide instructions that an
appropriate agent reads while working in the project. Use them for stable rules,
commands, architecture, and verification expectations.

`init-skills` installs a reusable, task-triggered experiment workflow for:

- Codex: `.agents/skills/<skill-name>/`
- Claude Code: `.claude/skills/<skill-name>/`
- Cursor: `.cursor/skills/<skill-name>/`

All three directories receive identical content. The skill is useful when the
tool supports project skills and should load focused experiment guidance only
for relevant tasks.

## Skill name

The directory and frontmatter name come from the string `name` in
`package.json`. Normalization:

1. Converts the name to lowercase.
2. Replaces each run of non-alphanumeric characters with `-`.
3. Removes leading, trailing, and repeated hyphens.
4. Limits the result to 64 characters and removes a trailing hyphen after truncation.
5. Falls back to `experiment-skill` when no letters or numbers remain.

For example, `@Scope/COE My Experiment!` becomes
`scope-coe-my-experiment`.

## Generated tree

Each native destination receives this tree. `references/e2e-testing.md` is
included only when the project has a `test:e2e` package script or
`playwright.config.js`.

```text
<tool-root>/skills/<skill-name>/
├── SKILL.md
└── references/
    ├── runtime-pattern.md
    ├── selectors-and-targeting.md
    ├── adobe-analytics.md
    └── e2e-testing.md                 # E2E projects only
```

| Resource | Purpose |
|---|---|
| `SKILL.md` | Skill frontmatter, project context, commands, workflow, code rules, and verification checklist |
| `references/runtime-pattern.md` | Entry-point order, module ownership, failure behavior, Preact, styles, and variation creation |
| `references/selectors-and-targeting.md` | Selector fallback chains, duplicate guards, Adobe Target placeholders, market targeting, and Samsung API guidance |
| `references/adobe-analytics.md` | Click and impression tracking with `eVar26` and `event26`, plus Adobe Web SDK cautions |
| `references/e2e-testing.md` | Bundle injection, host setup, API stubs, and Playwright assertions when E2E is configured |

Product-card skills describe `ExperimentCard`, model maps, translations,
Samsung product helpers, API stubbing, and anchor tracking. Minimal skills
describe `ExperimentButton`, `buttonText`, no product API dependency, and
explicit button tracking.

## Existing skills and `--force`

Before writing, `init-skills` checks all three destinations. If any target skill
directory exists, the command stops without changing any destination:

```text
Skill directory already exists: .claude/skills/<skill-name>
```

Replace all three copies intentionally with:

```bash
pnpm init-skills -- --force
```

Forced installation replaces each complete skill directory. This removes stale
files, including an old E2E reference after E2E support is removed and legacy
`assets/` or `scripts/` directories from earlier skill versions. It also
overwrites local edits.

Installation is transactional. The command renders all files in a temporary
directory, preflights destination parents, and then installs the three copies.
If a commit step fails, it removes newly installed copies, restores backups,
cleans temporary files, and reports:

```text
Unable to install skills without partial changes: <reason>
```

`init-claude` and `init-agents` also refuse existing files unless passed
`-- --force`, but each command manages only its single output file.

## Older projects

After upgrading the `create-experiment` dependency, an older generated project
without the package scripts can call the package-owned binaries directly:

```bash
pnpm exec exp-init-claude
pnpm exec exp-init-agents
pnpm exec exp-init-skills
```

Run them from a project root containing a valid `package.json` and either
`experiment.config.js` or `src/config.js`.

## Customize generated guidance

Review the `description` in `SKILL.md` frontmatter after installation. It
controls when compatible tools should activate the skill, so make it specific
to the tasks the skill should and should not handle. Keep `name` aligned with
the containing directory and within the normalized 64-character format.

Because the three copies start identical, apply shared changes to all three or
document which tool owns a deliberate difference. A later
`pnpm init-skills -- --force` regenerates every copy and removes custom or stale
files, so preserve intentional customizations before forcing an update.

To share AI support through Git, remove only the relevant entries from the
generated `.gitignore` and review the content for project-specific or sensitive
information before committing it.

See [Generated Commands](/reference/generated-commands) for the concise command
reference and [Error Reference](/error-reference) for setup failures.
