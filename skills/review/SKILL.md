---
name: review
description: "Review a diff against repository standards and requested behavior, including security, compatibility, tests, complexity, and proportionate quality signals."
---

## Workflow

1. Pin the comparison point and confirm the diff is the intended one.
2. Read the originating issue or spec and the repository's standards.
3. Review separately for requested behavior, standards/design, security,
   backward compatibility, test gaps, and applicable quality signals.
4. Run `review-standard` for every change. Add `review-gilfoyle` when the diff
   affects runtime behavior, integrations, access/security boundaries,
   deployment/configuration, reliability, observability, or incident evidence.
   Add `review-ponytail` when it changes production code, dependencies, public
   APIs, control flow, architecture, or introduces an abstraction. Record each
   unselected lane as `NOT_RUN` with the concrete reason.
   Run selected lanes independently over the same project checkout, pinned diff,
   and repository instructions. Use separate threads only for parallel
   execution; do not create persona-specific branches, worktrees, or environments.
5. When changed behavior uses domain semantics, run each relevant local domain
   expert as additional context over the same snapshot. A missing source or
   target is `BLOCKED`/`NOT_RUN`, not approval.
6. Wait for every selected persona, and each domain expert when used, to reach a
   terminal state. Join the findings while preserving the reviewer that produced
   each one.
7. Rank findings by impact, cite the file and reason, return a composed verdict,
   and only perform tracker mutations when explicitly asked.

## Output

```text
Status: APPROVED|CHANGES_REQUESTED|NEEDS_HUMAN
Quality: <signal=PASS|WARN|BLOCKED|NOT_RUN; evidence>
```

The report must contain `blockers`, `majors`, `minors`, `spec_findings`,
`standards_findings`, `test_gaps`, `quality_signals`, and `reviewers`.
`quality_signals` must show the changed-code scope, the configured tool or
reason, the status, and evidence. `reviewers` must show the status, findings,
and focus for `review-standard`, `review-gilfoyle`, and `review-ponytail`, plus
the selection or `NOT_RUN` reason and each local domain expert when used.

## Rules

- Do not invent requirements absent from the spec or repository standards.
- Treat security and data-loss risks as blockers when evidenced.
- Keep each reviewer focused on its stated perspective. All reviewers are
  read-only and inspect the same base revision, head revision, project
  instructions, and relevant evidence.
- Do not let a Ponytail suggestion remove validation, security, accessibility,
  data-loss protection, or an explicit acceptance criterion.
- Do not turn a missing or failed selected lane into approval. Keep disagreements
  visible in the composed report.
- Documentation-only, comment-only, generated-artifact, or purely mechanical
  changes may omit specialist lanes when their focus cannot affect the verdict.
  Risk, not diff size, selects a lane.
- Measure the changed surface before considering legacy repository-wide
  findings. Do not add a metric tool just to satisfy this skill.
- A quality `WARN` is not a blocker unless project policy or change risk makes
  it one. In TypeScript, flag new unapproved `any`, but allow `unknown` at a
  trust boundary when it is narrowed before domain logic.
- Never request changes merely for personal style preferences.
