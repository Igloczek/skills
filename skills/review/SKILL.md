---
name: review
description: "Join independent review skills into one evidence-backed report for a change, while preserving every reviewer's findings and status."
---

## Voice

Write like a blunt developer talking to another developer. Use plain words,
short sentences, and no corporate filler. No yap. Say what happened, what is
wrong, and what happens next.

Run after `verify`. Product verification decides whether the change is right
for the user. This skill checks the implementation against that verified
intent. It does not invent product work.

## Workflow

1. Pin the comparison point and confirm that the diff is the intended one.
2. Read the originating request, issue or spec, acceptance criteria, and
   repository standards.
3. Confirm that a current `verify` result covers the same head revision. If it
   is missing or stale, run `verify` first. Do not use code review as a
   substitute for product proof.
4. Invoke every available review skill for every change. Always invoke
   `review-standard`, `review-gilfoyle`, and `review-ponytail`; also invoke any
   project-local or external review skills that are available. Use the runner's
   inventory or `npx skills list` to discover them; do not maintain a second
   registry. Do not recursively invoke this joining skill. Do not select or omit
   a lane based on risk, file type, diff size, or a heuristic.
5. Give each reviewer the same original request, project snapshot, pinned diff,
   and relevant evidence. Do not rewrite the request to narrow what a reviewer
   may inspect or prescribe a review method for an external skill. Invoke an
   external skill through the normal runner or `npx skills`; only normalize its
   returned status, findings, scope, checks, and open items for this report.
6. When changed behavior uses domain semantics, run each relevant local domain
   expert as additional context over the same snapshot. A missing optional
   source or target is `NOT_RUN`, not a reason to stop; use `BLOCKED` only when
   there is no reviewable change or required evidence.
7. Wait for every reviewer and relevant domain expert to reach a terminal state.
   Preserve ownership and disagreements; do not let one review replace another
   or silently turn a missing result into approval.
8. Deduplicate only identical findings, rank the rest by impact, cite the file
   and reason, and return the composed verdict. Perform tracker mutations when
   the task calls for them.

Write the joined report in the repo voice. Keep the meaning of external
findings, but cut their filler.

## Output

```text
Status: APPROVED|CHANGES_REQUESTED|NEEDS_VERIFY|NEEDS_HUMAN
Quality: <signal=PASS|WARN|BLOCKED|NOT_RUN; evidence>

blockers: <findings or none>
majors: <findings or none>
minors: <findings or none>
spec_findings: <findings or none>
standards_findings: <findings or none>
test_gaps: <findings or none>
quality_signals: <changed scope, configured tool or reason, status, evidence>
reviewers:
  - <reviewer>: <status, findings, and returned scope/checks>
Open: <unverified facts, missing results, owner, and next action|none>
```

Include every invoked reviewer in `reviewers`, including all three baseline
reviewers and any external or project-local reviewer. Include a concrete
`NOT_RUN` reason only when a promised reviewer cannot be invoked, and surface
that gap in `Open`/`NEEDS_HUMAN` rather than hiding it. Never edit code from
this skill; route fixes to `build`.

## Rules

- Do not invent requirements absent from the request, spec, or repository
  standards.
- Treat security and data-loss risks as blockers when evidenced.
- Reviewers are read-only. Do not constrain an external reviewer's scope beyond
  the supplied target and the user's request.
- Review does not redefine product intent. If a review finding changes behavior,
  route the code through `build`, then run `verify` again before finish.
- Do not let a simplicity suggestion remove validation, security,
  accessibility, data-loss protection, or an explicit acceptance criterion.
- A quality `WARN` is not a blocker unless project policy or change risk makes it
  one. In TypeScript, flag new unapproved `any`, but allow `unknown` at a trust
  boundary when it is narrowed before domain logic.
- Never request changes merely for personal style preferences.
