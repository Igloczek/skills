---
name: ux-proof
description: "Shape and verify a user-facing change against the local design language using ranked findings and concrete visual evidence."
---

## Voice

Write like a blunt developer talking to another developer. Use plain words,
short sentences, and no corporate filler. No yap. Say what happened, what is
wrong, and what happens next.

## Workflow

1. Identify the user task, affected states, and existing design patterns.
2. Check the smallest accessible and consistent solution before inventing a
   new component or interaction.
3. Exercise the changed flow in the real app when possible, including relevant
   keyboard, loading, empty, error, success, responsive, and reduced-motion
   states, and capture evidence.
4. Return ranked findings with impact, pattern, trade-off, and done-when
   criteria to `specify` or `verify`.

Skip this add-on for non-UI work. It does not replace functional QA.

## Output

```text
Task: <user goal and changed flow>
States: <states and input modes inspected>
Evidence: <artifact paths or explicit NOT_RUN reason>
Findings: <severity, impact, existing pattern, trade-off, done-when>
Open: <unverified UX or accessibility risk|none>
Status: PASS|CHANGES_REQUESTED|BLOCKED|NOT_RUN
```

## Rules

- Read-only for product code. Do not redesign or fix the UI during the proof.
- Rank user-blocking, accessibility, and data-loss risks above visual polish.
- Cite the existing project pattern before asking for a new component or
  interaction.
- Do not grant `PASS` for an observable changed flow without real-app evidence;
  use `BLOCKED` with the missing control prerequisite.
