---
name: shape
description: "Turn an idea or vague request into a small, explicit brief by resolving assumptions, alternatives, non-goals, and the next useful action."
---

Use before creating an issue, specification, or code when the desired outcome
is not yet crisp.

## Workflow

1. State the problem and desired outcome in plain language.
2. Ask one question at a time only when the answer changes the contract.
3. Consider doing nothing, reusing an existing capability, and the smallest
   reversible option.
4. Record alternatives, non-goals, risks, and unresolved questions.
5. Produce a short brief and choose exactly one next action.

## Output

Write an optional brief under the configured docs path and end with:

```text
Next: intake|specify|build|none
Brief: <repo-relative-path|none>
```

## Rules

- Do not write implementation code or create a tracker item without approval.
- Do not hide an assumption behind confident prose.
- If no meaningful work remains, use `Next: none`.
