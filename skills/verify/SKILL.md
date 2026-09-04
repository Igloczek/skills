---
name: verify
description: "Verify a change with repository tests and, when it is user-facing, concrete browser or UI evidence from a controlled test environment."
---

## Voice

Write like a blunt developer talking to another developer. Use plain words,
short sentences, and no corporate filler. No yap. Say what happened, what is
wrong, and what happens next.

This is the first gate after `build`. Check the product before code
review. For user-facing work, check that it works, looks, and behaves as the
request expects.

## Workflow

1. Read the diff, acceptance criteria, and QA procedure; derive the smallest
   scenario that proves the changed behavior and product fit.
2. Classify the proof needed:
   - low risk: focused checks for docs, formatting, or mechanical changes;
   - medium risk: the changed behavior through its matching CLI, API, job, or
     UI surface;
   - high risk: the real path plus an independent check of the resulting
     state for data, access, money, or destructive behavior.
3. When the change has an observable surface, exercise it with the configured
   environment now. Check the real behavior, visual fit, interaction states,
   and the QA procedure before code review. Use `ux-proof` when that extra
   product or visual pass is useful.
4. Run fast configured unit, type, lint, integration, or end-to-end checks.
5. For substantial or risky changes, run already-configured quality gates such
   as coverage, complexity, mutation, or dependency checks. Do not add a tool
   just to satisfy this skill.
6. Capture the smallest reproducible artifact for the exercised surface. If
   the product is wrong, route back to `build` before code review.
7. Diagnose failures from their evidence. Do not turn an infrastructure
   failure into a pass.
8. Write a report and return the correct gate state.

## Output

```text
Risk: LOW|MEDIUM|HIGH
Scenario: <what was exercised>
Checks: <commands and observed results>
Gates: <name=PASS|FAIL|SKIPPED|NOT_CONFIGURED; evidence>
Quality: <signal=PASS|WARN|BLOCKED|NOT_RUN; evidence>
Evidence: <artifact paths or none>
Cleanup: <what was stopped or removed>
Skipped: <proof deliberately not run and why|none>
Status: VERIFIED|FAILED|NEEDS_QA|NEEDS_HUMAN
```

Include scenario, commands, observed result, artifacts, failure diagnosis, and
the state of each applicable gate (`PASS`, `FAIL`, `SKIPPED`, or
`NOT_CONFIGURED`). Include the reason a UI or expensive check was skipped when
it does not apply or the project does not provide it.

## Rules

- Never expose credentials in output.
- Never grant `qa-approved` without evidence.
- Do not require screenshots, performance runs, or a full feature map when
  the changed surface does not justify them.
- For mutations, use a second read-only view of the resulting state when it
  is practical and materially increases confidence.
- Clean up processes and temporary resources even after a failed check.
- Keep expensive checks proportional to change risk and available feedback;
  never require enterprise tooling for a small project.
- Report quality warnings separately from functional failures. A warning,
  unconfigured signal, or legacy violation is not a failure without project
  policy or high-risk scope.
- Do not modify source code unless the caller explicitly switches to `build`.
