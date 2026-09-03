---
name: verify
description: "Verify a change with repository tests and, when it is user-facing, concrete browser or UI evidence from a controlled test environment."
---

## Workflow

1. Read the diff, acceptance criteria, and QA procedure; derive the smallest
   scenario that proves the changed behavior.
2. Run fast configured unit, type, lint, integration, or end-to-end checks.
3. For substantial or risky changes, run already-configured quality gates such
   as coverage, complexity, mutation, or dependency checks. Do not add a tool
   just to satisfy this skill.
4. For UI changes, use the configured environment and semantic locators;
   capture screenshots or another reproducible artifact. Run the human/system
   QA procedure when it applies.
5. Diagnose failures from their evidence. Do not turn an infrastructure
   failure into a pass.
6. Write a report and return the correct gate state.

## Output

```text
Status: VERIFIED|FAILED|NEEDS_QA|NEEDS_HUMAN
Gates: <name=PASS|FAIL|SKIPPED|NOT_CONFIGURED; evidence>
```

Include scenario, commands, observed result, artifacts, failure diagnosis, and
the state of each applicable gate (`PASS`, `FAIL`, `SKIPPED`, or
`NOT_CONFIGURED`). Include the reason a UI or expensive check was skipped when
it does not apply or the project does not provide it.

## Rules

- Never expose credentials in output.
- Never grant `qa-approved` without evidence.
- Clean up processes and temporary resources even after a failed check.
- Keep expensive checks proportional to change risk and available feedback;
  never require enterprise tooling for a small project.
- Do not modify source code unless the caller explicitly switches to `build`
  or `fix`.
