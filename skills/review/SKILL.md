---
name: review
description: "Review a diff against the repository standards and requested behavior, including security, compatibility, tests, and unnecessary complexity."
---

## Workflow

1. Pin the comparison point and confirm the diff is the intended one.
2. Read the originating issue or spec and the repository's standards.
3. Review separately for requested behavior, standards/design, security,
   backward compatibility, and test gaps.
4. Run the standard lane for every change. Add `review-gilfoyle` when the
   change has meaningful operational, integration, security, or production
   risk, and add `review-ponytail` when scope or complexity makes it useful.
   Keep selected lanes independent and read-only; record omitted lanes as
   `NOT_RUN` with a reason.
5. When changed behavior uses domain semantics, run the project's one local
   domain expert as an additional lane. A missing source or target is
   `BLOCKED`/`NOT_RUN`, not approval.
6. Wait for every selected lane to reach a terminal state, then join the
   findings while preserving the lane that produced each one.
7. Rank findings by impact, cite the file and reason, return a composed verdict,
   and only perform tracker mutations when explicitly asked.

## Output

```text
Status: APPROVED|CHANGES_REQUESTED|NEEDS_HUMAN
```

The report must contain `blockers`, `majors`, `minors`, `spec_findings`,
`standards_findings`, `test_gaps`, and `review_lanes`. `review_lanes` must show
the status, findings, and selection reason for `standard`, `review-gilfoyle`,
and `review-ponytail`, plus `domain-expert` when used.

## Rules

- Do not invent requirements absent from the spec or repository standards.
- Treat security and data-loss risks as blockers when evidenced.
- Keep `review-gilfoyle` findings evidence-based and operational; keep
  `review-ponytail` findings limited to safe complexity reduction. All review
  lanes are read-only.
- Do not let a Ponytail suggestion remove validation, security, accessibility,
  data-loss protection, or an explicit acceptance criterion.
- Do not turn a missing or failed lane into approval. Keep disagreements visible
  in the composed report.
- Do not spawn specialist lanes for ceremony; a low-risk change may record them
  as `NOT_RUN` with a concrete reason.
- Never request changes merely for personal style preferences.
