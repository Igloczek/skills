---
name: build
description: "Implement a brief or specification in an isolated branch, using small feedback-driven steps, tests, and the repo's checks."
---

## Voice

Write like a blunt developer talking to another developer. Use plain words,
short sentences, and no corporate filler. No yap. Say what happened, what is
wrong, and what happens next.

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
5. When a check fails, use its evidence, change the approach when needed, and
   keep going. Record the useful failure and next move; do not create a failure
   ceremony or stop just because the first approach was wrong.
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
- Leave a clean, reviewable branch or PR and release temporary processes on
  exit.
- If a command or provider is missing, use a sensible available alternative and
  report the gap. Stop only when the missing thing is truly required and cannot
  be replaced.
- Prefer repository checks and compact handoffs over long process instructions.
