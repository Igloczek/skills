---
name: fix
description: "Apply the normal build workflow to a confirmed defect, with a reproduction and regression check added to the same reviewable change."
---

Use for confirmed bug work. `fix` is the bug-shaped entry point to `build`, not a
separate delivery process.

## Workflow

1. Follow `build` for the branch or worktree, project instructions, acceptance
   criteria, feedback checks, validation, review, and finish steps.
2. Before editing, reproduce the reported behavior with the smallest useful
   existing command or test and state the evidence-backed root cause.
3. Add a regression check that fails for the reproduced defect, make the smallest
   safe fix at the owning boundary, and rerun the regression plus the normal
   build checks.
4. If the defect cannot be reproduced, stop without a speculative patch and
   report the missing evidence or environment.

## Output

```text
Status: FIXED_IN_PR|NO_ACTION_NEEDED|NEEDS_HUMAN
PR: #<number> (link: <url>)|none
Reproduction: <command and before result|none>
Root cause: <mechanism and owning boundary|unconfirmed>
Regression: <test and result|none>
Validation: <normal build checks and results>
Remaining risk: <none or evidence-backed risk>
```

Include reproduction, root cause, regression, validation, and remaining risk.

## Rules

- Do not change behavior without a reproduction or a documented reason.
- Do not hide a failed reproduction behind a speculative patch.
- Do not invent a separate bug-only branch, review, verification, or release
  process; use the same `build` path.
- Never merge the resulting PR.
