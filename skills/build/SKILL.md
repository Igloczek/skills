---
name: build
description: "Implement a brief or specification in an isolated branch, using small feedback-driven steps, tests, and the repository validation gate."
---

This is the implementation engine. Short, long, autonomous, resume, and loop
runs are modes of this skill, not separate commands.

## Workflow

1. Confirm the input and locate its acceptance criteria.
2. Read project instructions, select the smallest safe change surface, and
   create or reuse an isolated branch/worktree.
3. Work in the current vertical slice. Preserve behavioral coverage, but let
   the agent write tests before, alongside, or after implementation when that
   is the clearest route to a verified result.
4. Run the cheapest configured feedback after each meaningful slice and keep a
   concise progress record. Leave cleanup, hardening, and system proof to the
   appropriate review or verification step.
5. If the same check fails repeatedly without new evidence, stop that
   trajectory. Record the last successful check, current failure, attempts,
   next hypothesis, and resume location before starting a fresh focused
   context.
6. Commit coherent changes and open or update one reviewable PR.

When a change touches UI, use the public `ui-dev` skill. Consult the project's
relevant local domain experts before changing domain-sensitive behavior. Domain
experts add project context; they do not change public skill contracts.

## Output

Report changed files, tests, validation, remaining risks, and:

```text
PR: #<number> (link: <url>)
Status: READY_FOR_REVIEW|BLOCKED|NEEDS_HUMAN
```

## Rules

- Never merge the PR.
- Do not edit a spec PR with implementation code.
- Keep the work resumable and release claims/temporary processes on exit.
- Stop when a required command, provider, or acceptance criterion is missing.
- Prefer repository checks and compact handoffs over long process instructions.
