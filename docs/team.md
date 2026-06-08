---
title: Team
---

# Team

Create Experiment is maintained for the Samsung/Sogody experimentation workflow.

## Ownership areas

| Area | Repository location | Review focus |
|---|---|---|
| CLI prompts and answer normalization | `experiment-framework-v2/cli.js`, `lib/` | Defaults, validation, market resolution |
| Generated project shape | `template/`, `template-minimal/` | Output files, Preact patterns, config |
| Scaffold orchestration | `lib/scaffold-plan.js`, `generator/` | Template coverage and conditional files |
| Runtime helpers | `runtime/framework.js`, `runtime/scss/` | Browser behavior and compatibility |
| Package commands | `bin/` | Build, watch, live injection, variations |
| Documentation | `v2-framework/docs/` | Accuracy against current source |

## Review expectations

- Template changes include generator tests.
- Runtime changes include focused unit tests.
- Market content is checked against the team market reference.
- Documentation examples match generated files, not legacy experiments.
- Package command changes update both generated README content and this site.

See [Contributing](/reference/contributing) for the local workflow and pull request checklist.
