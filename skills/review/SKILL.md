---
name: review
description: "Review a diff against the repository standards and requested behavior, including security, compatibility, tests, and unnecessary complexity."
---

## Workflow

1. Pin the comparison point and confirm the diff is the intended one.
2. Read the originating issue or spec and the repository's standards.
3. Review separately for requested behavior, standards/design, security,
   backward compatibility, and test gaps.
4. For relevant changes, run the public `review-gilfoyle` and
   `review-ponytail` add-ons as separate, bounded review lanes. Consult the
   project's local domain expert only when the changed surface uses domain
   semantics.
5. Keep each lens separate, rank findings by impact, and cite the file and
   reason. A missing source or target is `BLOCKED`/`NOT_RUN`, not approval.
6. Return a composed verdict and only perform tracker mutations when explicitly
   asked.

## Output

```text
Status: APPROVED|CHANGES_REQUESTED|NEEDS_HUMAN
```

The report must contain `blockers`, `majors`, `minors`, `spec_findings`,
`standards_findings`, `test_gaps`, and, when used, separate findings from the
`review-gilfoyle`, `review-ponytail`, and domain-expert lanes.

## Rules

- Do not invent requirements absent from the spec or repository standards.
- Treat security and data-loss risks as blockers when evidenced.
- Keep `review-gilfoyle` findings evidence-based and operational; keep
  `review-ponytail` findings limited to safe complexity reduction. Neither
  reviewer edits code.
- Do not let a Ponytail suggestion remove validation, security, accessibility,
  data-loss protection, or an explicit acceptance criterion.
- Never request changes merely for personal style preferences.
