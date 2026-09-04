---
name: build
description: "Implement or change code from a brief, specification, bug report, or direct request in an isolated branch, using feedback-driven checks and a reviewable PR."
---

## Voice

Write like a blunt developer talking to another developer. Use plain words,
short sentences, and no corporate filler. No yap. Say what happened, what is
wrong, and what happens next.

This is the one code path for features, fixes, maintenance, refactors, and
other code changes. Short, long, autonomous, resume, and loop runs are modes of
this skill, not separate commands.

## Workflow

1. Confirm the input, expected result, and acceptance criteria when they exist.
2. Read project instructions, select the smallest safe change surface, and
   create or reuse an isolated branch/worktree.
3. Work in the current vertical slice. For a reported bug, reproduce the
   current behavior before editing, identify the root cause, and add a
   regression check. For all other changes, preserve behavioral coverage and
   write tests before, alongside, or after implementation when that is the
   clearest route to a verified result.
4. Run the cheapest configured feedback after each meaningful slice and keep a
   concise progress record. When the code for the slice is written, hand it to
   `verify` before code review. For user-facing work, prove the real flow there
   before spending time on code-quality review.
5. When a check fails, use its evidence, change the approach when needed, and
   keep going. Record the useful failure and next move; do not create a failure
   ceremony or stop just because the first approach was wrong.
6. Commit coherent changes and open or update one reviewable PR.

When a change touches UI, use the public `ui-dev` skill. Consult the project's
relevant local domain experts before changing domain-sensitive behavior. Domain
experts add project context; they do not change public skill contracts.

## Output

Report changed files, tests, validation, remaining risks, and:

For a bug report, also include the reproduction, root cause, and regression
check result.

```text
PR: #<number> (link: <url>)
Status: READY_FOR_VERIFY|BLOCKED|NEEDS_HUMAN
```

## Rules

- Never merge the PR.
- Do not edit a spec PR with implementation code.
- Use this same path for features, fixes, maintenance, refactors, and other
  code changes. Do not create a separate bug workflow.
- For a reported bug, do not make a speculative patch. Reproduce it first when
  possible, record the evidence when it cannot be reproduced, fix the root
  cause, and leave a regression check.
- Leave a clean, reviewable branch or PR and release temporary processes on
  exit.
- If a command or provider is missing, use a sensible available alternative and
  report the gap. Stop only when the missing thing is truly required and cannot
  be replaced.
- Prefer repository checks and compact handoffs over long process instructions.
