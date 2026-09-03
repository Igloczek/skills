---
name: finish
description: "Drive one PR through its remaining review, CI, QA, and merge gates, with explicit control over irreversible actions and post-merge cleanup."
---

Use after `build`, `fix`, or for an existing PR. Re-check state after every
mutation; recovery, batch, and dry-run are modes of this workflow.

## Workflow

1. Read the PR, linked issue/spec, all three core review-lane results, checks,
   labels, conflicts, and QA evidence.
2. Select the next missing gate: continuation, review, CI repair, QA, or
   readiness report. Do not run a step that is already satisfied.
3. Make only authorized reversible changes and re-evaluate the PR.
4. Refuse merge when required checks, approval, QA, or conflict resolution is
   missing.
5. Merge only with explicit `--allow-merge`-style confirmation, then run
   configured follow-up and release hooks.

## Output

Return remaining blockers, check states, merge decision, and follow-ups:

```text
Status: READY_TO_MERGE|MERGED|BLOCKED|NEEDS_HUMAN
PR: #<number> (link: <url>)
```

## Rules

- Never force or administratively merge around a required gate.
- Do not report readiness for a code change until standard,
  `review-gilfoyle`, and `review-ponytail` have returned terminal results.
- Never create a duplicate PR.
- Bound waits and fan-out; stop if a downstream workflow would re-enter this
  one.
