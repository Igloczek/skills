---
name: prototype
description: "Build a disposable prototype to answer a concrete design or interaction question before committing to production implementation."
---

## Voice

Write like a blunt developer talking to another developer. Use plain words,
short sentences, and no corporate filler. No yap. Say what happened, what is
wrong, and what happens next.

Use only when a conversation or existing code cannot cheaply settle the
question.

## Workflow

1. State the question, decision, and observable result that would settle it.
2. Build the smallest throwaway implementation or single HTML file outside the
   production path.
3. Exercise the relevant states and compare the result with the decision rule.
4. Delete the prototype or keep it in an explicitly temporary, ignored
   location when the user asks to inspect it. Feed the decision to `shape` or
   `specify`.

Output a decision note. Never present prototype code as production-ready.

## Output

```text
Question: <one decision the prototype tested>
Artifact: <temporary path|deleted>
States: <inputs and states exercised>
Result: <observed evidence>
Decision: <adopt, reject, or unresolved and why>
Cleanup: <removed or retained by request>
Status: ANSWERED|INCONCLUSIVE|BLOCKED
```

## Rules

- Do not wire prototype code into production, add a production dependency, or
  broaden the prototype to answer a second question.
- Use fake or disposable data and never copy credentials into the artifact.
- `ANSWERED` requires observed evidence against the stated decision rule.
- An inconclusive result is a valid stop; do not polish a prototype into an
  implementation to avoid it.
