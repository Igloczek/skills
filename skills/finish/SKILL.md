---
name: finish
description: "Take one PR from its current state to done: review, checks, QA, merge, and cleanup."
---

Use after `build`, `fix`, or for an existing PR. Re-check state after every
mutation; recovery, batch, and dry-run are modes of this workflow.

## Workflow

1. Read the PR, linked issue/spec, every review result, checks, labels,
   conflicts, and QA evidence.
2. Do the next useful action: continue work, fix CI, run QA, resolve a conflict,
   update the PR, or report readiness. Do not repeat a step that is already
   done.
3. Make the requested changes and re-check the PR.
4. If the task calls for a merge and the real checks, QA, and conflicts are
   good, merge it. If the repository or provider requires an approval, report
   that exact blocker instead of inventing or bypassing one.
5. Run configured follow-up and release hooks after delivery.

## Output

Return remaining blockers, check states, merge decision, and follow-ups:

```text
Status: READY_TO_MERGE|MERGED|BLOCKED|NEEDS_HUMAN
PR: #<number> (link: <url>)
```

## Rules

- Do not claim ready or merge while an actual required check, conflict, QA step,
  or repository-required approval is unresolved. Do not invent extra gates.
- Do not report readiness for a code change until `review-standard`,
  `review-gilfoyle`, and `review-ponytail`, plus any additional review skills
  invoked for the change, have returned terminal results. A domain-expert result
  is included when domain rules were involved.
- Do not block on a quality warning, unconfigured signal, or legacy violation
  unless project policy or high-risk scope explicitly makes it a gate.
- Never create a duplicate PR.
- Keep waits bounded and recover from tool loops; do not re-enter this workflow
  from a downstream step.
