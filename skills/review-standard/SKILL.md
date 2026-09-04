---
name: review-standard
description: "Review a PR, branch, commit range, or working-tree diff for requested behavior, correctness, compatibility, security, data integrity, user impact, and test coverage, returning evidence-backed findings and a merge verdict."
---

Perform a complete, independent, read-only review. Optimize for a few findings
that can change the merge decision, not a long list of possibilities or style
preferences.

## Choose the review unit

Review exactly one PR, branch, commit range, or working-tree diff. Infer the
target when the request makes it clear; when no target is supplied, use the
current working tree against the merge base of the repository's default branch.

Resolve and record the base and head SHAs before reviewing. For a working-tree
review, capture staged, unstaged, and relevant untracked files as one explicit
snapshot and record a stable fingerprint of that content. If the target cannot
be resolved or the diff is empty, return `BLOCKED` with the missing prerequisite
instead of reviewing an accidental scope.

## Workflow

1. Establish intent and standards.
   - Read the request, linked issue or spec, acceptance criteria, and relevant
     product documentation.
   - Read repository instructions, contribution rules, architecture decisions,
     compatibility promises, and testing conventions that govern changed code.
   - Classify the changed files by layer and identify public or persisted
     contracts. Keep two questions separate: does the change satisfy its intent,
     and is the implementation sound for this repository? A missing formal spec
     is a limitation to report, not an automatic blocker.
2. Inspect the diff independently before reading existing review comments. Trace
   each material change through entry points, callers, state changes, external
   effects, failure paths, and tests. For deletions and renamed symbols, search
   for consumers that the diff does not show.
3. Check the applicable review lenses below. Follow data and contracts across
   package, process, language, storage, and network boundaries; do not stop where
   a text search stops.
4. Prove or dismiss each candidate finding. Identify a concrete trigger and
   consequence, cite the relevant path, and inspect the supposed bad path to its
   end. When cheap and safe, strengthen the evidence with a focused executable
   check. Record important risks that were investigated and cleared.
5. Run proportionate, read-only validation using commands already configured by
   the repository. Prefer the narrowest command that can disprove the risk, then
   broaden only when warranted. Use check or dry-run modes for commands that can
   rewrite files. Distinguish regressions introduced by the change from
   pre-existing or unrelated failures.
6. After the independent pass, inspect existing PR feedback when available.
   Reproduce unresolved claims before including them; comments are leads, not
   findings by authority.
7. Refresh the diff and line references. If the head changed, review the new
   delta before returning the verdict.

## Review lenses

Apply only the lenses relevant to the changed surface.

- **Intent and scope:** missing or partial requirements, behavior that contradicts
  the request, undocumented scope expansion, and intended changes whose wider
  implications were not handled.
- **Correctness and failures:** edge cases, invalid state transitions, error
  propagation, cleanup, retries, concurrency, ordering, timeouts, resource
  bounds, and behavior under realistic failure.
- **Contracts and blast radius:** exported APIs, HTTP and event payloads, CLI
  flags, configuration and environment variables, schemas and migrations,
  generated artifacts, feature gates, developer workflows, and downstream
  consumers. Check backward and rollout compatibility.
- **Security and data integrity:** trust-boundary validation, authentication,
  authorization and tenant scoping, injection, secret exposure, unsafe defaults,
  atomicity, idempotency, destructive migrations, and recovery from partial
  failure.
- **Tests and observability:** whether tests exercise the requested behavior and
  its credible failure modes, whether a bug fix has a focused regression check,
  and whether operators can detect and diagnose important failures. A test-gap
  finding must name the exact missing case and the defect it could conceal.
- **Architecture and maintenance:** consistency with established repository
  patterns, unnecessary dependencies or indirection, misplaced responsibility,
  leaky abstractions, and interfaces whose invariants or errors are unclear.
  Prefer repository evidence over generic design taste; do not duplicate checks
  already enforced mechanically by configured tooling.
- **User-facing behavior:** when UI changes, walk the affected task rather than
  judging a static frame. Check loading, empty, error, permission, disabled,
  long-content, and narrow-screen states as applicable, plus keyboard access,
  focus, labels, contrast, touch targets, responsive behavior, and reduced
  motion. Tie each recommendation to observed evidence, an existing project
  pattern, its trade-off, and a verifiable acceptance condition.

## Evidence and severity

Report a finding only when the changed code introduces or exposes a concrete,
actionable problem. Do not report unfinished research, speculative “might”
claims, intended behavior changes by themselves, pre-existing defects the change
does not worsen, or formatting and naming preferences.

- `BLOCKER`: credible security boundary failure, data loss or corruption,
  cross-tenant exposure, destructive incompatibility, or another issue that
  makes the change unsafe to ship.
- `MAJOR`: realistic incorrect behavior, broken contract or rollout path,
  significant accessibility regression, or missing regression coverage for a
  demonstrated bug.
- `MINOR`: limited-impact defect or maintenance/test gap worth fixing that does
  not make the change unsafe.

Use `CHANGES_REQUESTED` when any blocker or major remains, `PASS` when only
minor or no findings remain, and `BLOCKED` only when the review unit or evidence
needed for a responsible verdict is unavailable. Unverified non-critical facts
belong in `Open`, not in `Findings`, and do not block by default.

## Output

```text
Status: PASS|CHANGES_REQUESTED|BLOCKED
Review unit: target, base SHA, head SHA or worktree fingerprint, and paths inspected
Intent sources: task, issue, spec, or "not available"
Standards sources: repository instructions and relevant docs

Findings:
- [BLOCKER|MAJOR|MINOR] path:line — concise title
  Trigger: the concrete input, state, or sequence
  Consequence: observable user, system, or maintenance impact
  Evidence: code path, command result, or reproduced behavior
  Correction: the smallest viable direction, not a full patch

Cleared: important suspected risks investigated and disproved
Checks: exact command or interaction => result; include anything not run and why
Open: unverified facts, their effect on confidence, and the next check
Summary: finding counts and one concise merge rationale
Changes: none; reviewer is read-only
```

If there are no findings, write `Findings: none`. Keep file and line references
inside the reviewed diff whenever possible. Never edit files, mutate tracker or
PR state, install dependencies, push, approve, or merge.
