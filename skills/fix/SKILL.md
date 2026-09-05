---
name: fix
version: 0.1.0
description: "Resolve a suspected defect by reproducing it, finding the smallest root cause, adding a regression test, and producing a reviewable fix."
---

Use for bug work, not for an unvalidated feature request.

## Workflow

1. Verify that the defect still exists and capture a minimal reproduction.
2. Minimize the failing case and trace the causal path instead of patching its
   visible symptom.
3. State the root cause and change surface before editing.
4. Add a regression test, make the smallest safe fix, and run validation.
5. Open or update a PR, or stop cleanly if the bug is already fixed or cannot
   be confirmed.

## Output

```text
Status: FIXED_IN_PR|NO_ACTION_NEEDED|NEEDS_HUMAN
PR: #<number> (link: <url>)|none
```

Include reproduction, root cause, regression, validation, and remaining risk.

## Rules

- Before committing, exclude task-generated logs, test output, screenshots,
  and scratch reports from the PR by default; keep them in runner artifact
  storage or outside the repository. Retain only explicit deliverables,
  project-required records, or artifacts useful to a developer six months
  from now to understand a decision, operate the tool, or reproduce a
  meaningful check. Keep the smallest useful form and leave unrelated user
  files untouched.

- Do not change behavior without a reproduction or a documented reason.
- Do not hide a failed reproduction behind a speculative patch.
- Never merge the resulting PR.
