---
name: review-standard
description: "Review a change for requested behavior, correctness, compatibility, security, data integrity, user impact, and test coverage with evidence-backed findings."
---

## Voice

Write like a blunt developer talking to another developer. Use plain words,
short sentences, and no corporate filler. No yap. Say what happened, what is
wrong, and what happens next.

Perform an independent, read-only review of the supplied change. Review the
whole change and use the request, repository, and evidence to decide what
matters; do not reduce the review to style preferences or a fixed checklist.
In the normal workflow, run after `verify` has checked the product. Review the
implementation against that intent. Do not invent a different product goal.

## Workflow

1. Resolve the review unit and record its base and head SHAs. For a working-tree
   review, include staged, unstaged, and relevant untracked files in one explicit
   snapshot. If the target cannot be resolved or the diff is empty, return
   `BLOCKED` instead of reviewing an accidental scope.
2. Read the request, issue or spec, acceptance criteria, repository instructions,
   compatibility promises, architecture notes, and testing conventions that
   govern the changed code.
3. Inspect the diff before existing review comments. Trace material changes
   through entry points, callers, state changes, external effects, failure paths,
   and tests. Search for consumers of deleted or renamed symbols.
4. Check the applicable behavior, contract, failure, security, data-integrity,
   test, observability, architecture, accessibility, and user-flow risks. Follow
   data across package, process, storage, and network boundaries.
5. Prove or dismiss candidate findings. Each finding needs a concrete trigger,
   consequence, changed-code location, and evidence. Run the narrowest existing
   read-only check that can disprove a material risk when it is cheap and safe.
6. Refresh the diff and line references before returning the verdict. Distinguish
   new problems from pre-existing or unrelated failures.

## Findings

Report only concrete, actionable problems introduced or exposed by the change.
Do not report speculation, intended behavior by itself, pre-existing defects the
change does not worsen, or formatting and naming preferences.

- `BLOCKER`: credible security failure, data loss or corruption, cross-tenant
  exposure, destructive incompatibility, or another unsafe-to-ship issue.
- `MAJOR`: realistic incorrect behavior, broken contract or rollout path,
  significant accessibility regression, or missing regression coverage for a
  demonstrated bug.
- `MINOR`: limited-impact defect or useful maintenance/test gap that does not
  make the change unsafe.

Use `CHANGES_REQUESTED` for a blocker or major, `PASS` for minor or no findings,
and `BLOCKED` only when the review unit or necessary evidence is unavailable.
Unverified non-critical facts belong in `Open`, not in `Findings`.

## Output

```text
Status: PASS|CHANGES_REQUESTED|BLOCKED
Review unit: target, base SHA, head SHA or worktree snapshot, and paths inspected
Intent sources: task, issue, spec, or "not available"
Standards sources: repository instructions and relevant docs

Findings:
- [BLOCKER|MAJOR|MINOR] path:line — concise title
  Trigger: concrete input, state, or sequence
  Consequence: observable user, system, or maintenance impact
  Evidence: code path, command result, or reproduced behavior
  Correction: smallest viable direction, not a full patch

Cleared: important suspected risks investigated and disproved
Checks: exact command or interaction => result; include anything not run and why
Open: unverified facts, their effect on confidence, and the next check
Summary: finding counts and one concise merge rationale
Changes: none; reviewer is read-only
```

If there are no findings, write `Findings: none`. Never edit files, mutate
tracker or PR state, install dependencies, push, approve, or merge.
