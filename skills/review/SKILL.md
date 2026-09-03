---
name: review
description: "Review a diff against the repository standards and requested behavior, including security, compatibility, tests, and unnecessary complexity."
---

## Workflow

1. Pin the comparison point and confirm the diff is the intended one.
2. Read the originating issue or spec and the repository's standards.
3. Review separately for requested behavior, standards/design, security,
   backward compatibility, and test gaps.
4. Rank findings by impact and cite the file and reason. If no finding blocks
   the change, say what was checked.
5. Return a verdict and only perform tracker mutations when explicitly asked.

## Output

```text
Status: APPROVED|CHANGES_REQUESTED|NEEDS_HUMAN
```

The report must contain `blockers`, `majors`, `minors`, `spec_findings`,
`standards_findings`, and `test_gaps`.

## Rules

- Do not invent requirements absent from the spec or repository standards.
- Treat security and data-loss risks as blockers when evidenced.
- Never request changes merely for personal style preferences.
