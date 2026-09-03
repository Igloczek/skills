---
name: review-ponytail
description: "Review a change for over-engineering, unnecessary complexity, and avoidable change surface."
---

Use as the minimality review lane within `review`. It applies the public
`ponytail` skill's deletion-first lens and does not replace correctness,
security, performance, accessibility, product, or domain review.

## Workflow

1. Pin the base revision and read the task/spec, project guardrails, current
   diff, and relevant callers/usages.
2. Preserve acceptance criteria and hard guardrails before proposing a cut.
3. Inspect only deletion, standard-library, native, YAGNI, duplicate-machinery,
   and speculative-flexibility opportunities.
4. Refresh the diff and line references before reporting.

## Rules

- Do not remove validation, security, data-loss protection, accessibility, or an
  explicit requirement merely to reduce lines.
- Do not implement the proposed reduction, run unrelated application tests, or
  mutate the repository.
- Each finding has one location, one reduction, and one replacement:
  `path:line: TAG what to cut; replacement.`

## Output

```text
Status: PASS|CHANGES_REQUESTED|BLOCKED|NOT_RUN
Scope: base, diff, and paths inspected
Decision: one-line complexity verdict
Findings: path:line, tag, cut, replacement, and evidence
Changes: none; proposed simplifications remain unapplied
Open: non-complexity findings routed elsewhere, owner, and next action
Metric: net: -N lines possible. | Lean already. Ship.
```
