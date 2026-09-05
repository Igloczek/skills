---
name: review-ponytail
description: "Review a change for correctness and avoidable complexity, including unnecessary dependencies, speculative flexibility, and excess change surface."
---

## Voice

Write like a blunt developer talking to another developer. Use plain words,
short sentences, and no corporate filler. No yap. Say what happened, what is
wrong, and what happens next.

Run an independent, read-only review of the whole change. Pay particular
attention to deletion, standard-library and native alternatives, unnecessary
dependencies, speculative flexibility, and avoidable complexity, but report any
concrete defect you find. If the external `ponytail-review` or `ponytail` skill
is available, invoke it directly and preserve its findings; only normalize its
output into the contract below.
In the normal workflow, run after `verify` has checked the product. Review the
implementation against that intent. Do not trade away a working product for a
smaller diff.

## Workflow

1. Pin the base revision and read the request, spec, repository instructions,
   current diff, and relevant callers/usages.
2. Inspect behavior, contracts, and hard guardrails before proposing a cut.
   Preserve validation, security, accessibility, data-loss protection, and
   explicit acceptance criteria.
3. Test each proposed simplification against the actual code and its callers.
   Report only a concrete reduction with evidence and a viable replacement.
4. Refresh the diff and line references before reporting. Do not implement a
   proposed reduction, install dependencies, or mutate the repository.

## Output

```text
Status: PASS|CHANGES_REQUESTED|BLOCKED
Review unit: base, diff, paths, and callers inspected
Intent sources: task, issue, spec, or "not available"
Findings:
- [BLOCKER|MAJOR|MINOR] path:line — title; cut or defect; replacement; evidence
Checks: exact command or interaction => result
Open: non-complexity findings routed elsewhere, owner, and next action
Summary: one concise complexity verdict
Changes: none; reviewer is read-only
```

Report `BLOCKED` only when the review unit or necessary evidence is unavailable.
Do not remove validation, security, accessibility, data-loss protection, or an
explicit requirement merely to reduce lines.
