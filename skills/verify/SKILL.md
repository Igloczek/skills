---
name: verify
description: "Verify a change with repository tests and, when it is user-facing, concrete browser or UI evidence from a controlled test environment."
---

## Workflow

1. Read the diff and derive the smallest scenario that proves the changed
   behavior.
2. Run the configured unit, type, lint, integration, or end-to-end checks.
3. For UI changes, use the configured environment and semantic locators;
   capture screenshots or another reproducible artifact.
4. Diagnose failures from their evidence. Do not turn an infrastructure
   failure into a pass.
5. Write a report and return the correct gate state.

## Output

```text
Status: VERIFIED|FAILED|NEEDS_QA|NEEDS_HUMAN
```

Include scenario, commands, observed result, artifacts, failure diagnosis, and
the reason a UI check was skipped when it does not apply.

## Rules

- Never expose credentials in output.
- Never grant `qa-approved` without evidence.
- Clean up processes and temporary resources even after a failed check.
- Do not modify source code unless the caller explicitly switches to `build`
  or `fix`.
