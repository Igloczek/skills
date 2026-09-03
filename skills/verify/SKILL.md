---
name: verify
description: "Verify a change with repository tests and, when it is user-facing, concrete browser or UI evidence from a controlled test environment."
---

## Workflow

1. Read the diff and derive the smallest scenario that proves the changed
   behavior.
2. Classify the proof needed:
   - low risk: focused checks for docs, formatting, or mechanical changes;
   - medium risk: the changed behavior through its matching CLI, API, job, or
     UI surface;
   - high risk: the real path plus an independent check of the resulting
     state for data, access, money, or destructive behavior.
3. Run the configured unit, type, lint, integration, or end-to-end checks.
4. When the change has an observable surface, exercise it with the configured
   environment and capture the smallest reproducible artifact.
5. Diagnose failures from their evidence. Do not turn an infrastructure
   failure into a pass.
6. Write a report and return the correct gate state.

## Output

```text
Risk: LOW|MEDIUM|HIGH
Scenario: <what was exercised>
Checks: <commands and observed results>
Evidence: <artifact paths or none>
Cleanup: <what was stopped or removed>
Skipped: <proof deliberately not run and why|none>
Status: VERIFIED|FAILED|NEEDS_QA|NEEDS_HUMAN
```

Include scenario, commands, observed result, artifacts, failure diagnosis, and
the reason a UI check was skipped when it does not apply.

## Rules

- Never expose credentials in output.
- Never grant `qa-approved` without evidence.
- Do not require screenshots, performance runs, or a full feature map when
  the changed surface does not justify them.
- For mutations, use a second read-only view of the resulting state when it
  is practical and materially increases confidence.
- Clean up processes and temporary resources even after a failed check.
- Do not modify source code unless the caller explicitly switches to `build`
  or `fix`.
