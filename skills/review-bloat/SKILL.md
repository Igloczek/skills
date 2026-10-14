---
name: review-bloat
version: 1.0.0
description: "Review a change for correctness and avoidable complexity, including unnecessary dependencies, speculative flexibility, and excess change surface."
---

## Voice

Write like a blunt developer talking to another developer. Use plain words,
short sentences, and no corporate filler. No yap. Say what happened, what is
wrong, and what happens next.

Run an independent, read-only review of the whole change. Pay particular
attention to deletion, standard-library and native alternatives, unnecessary
dependencies, speculative flexibility, and avoidable complexity, but report any
concrete defect you find.
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

## Lean checks

Look for these in the changed code:

- **Delete:** dead code, unused options, speculative features.
- **Reuse:** the repo already has a helper or pattern for this job. Name its path.
- **Platform:** the standard library or platform already does it. A new dependency
  for a few lines is a finding.
- **One-case abstraction:** an interface, layer, or config option with one
  implementation, or with no caller that sets it.
- **Merge:** near-copies that must change together.
- **Split:** one function that does unrelated jobs, so it is hard to read or test.
  Split by job, never by line count, and never into helpers that exist only to
  shorten a function.

## Before you report

- Every finding needs a concrete case: this input or state leads to this result. No
  case, no finding.
- Re-read the code. Confirm the caller exists, the value can really be empty, and the
  code really is unused.
- A `shortcut:` comment that names its limit is a decision. Report it only when the
  expected load already crosses that limit.
- Propose the smallest fix that works. Prefer fixes that delete code.
- Do not report style taste.

## Output

```text
Status: PASS|CHANGES_REQUESTED|BLOCKED
Review unit: base, diff, paths, and callers inspected
Intent sources: task, issue, spec, or "not available"
Findings:
- [BLOCKER|MAJOR|MINOR] path:line — title; cut or defect; replacement; evidence
Checks: exact command or interaction => result
Open: non-complexity findings routed elsewhere, owner, and next action
Summary: one concise complexity verdict. Lean: -<N> lines possible, or none.
Changes: none; reviewer is read-only
```

Report `BLOCKED` only when the review unit or necessary evidence is unavailable.
Do not remove validation, security, accessibility, data-loss protection, or an
explicit requirement merely to reduce lines.
