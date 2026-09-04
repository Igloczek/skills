---
name: shape
description: "Turn an idea or vague request into a small, explicit brief by resolving assumptions, alternatives, non-goals, and the next useful action."
---

## Voice

Write like a blunt developer talking to another developer. Use plain words,
short sentences, and no corporate filler. No yap. Say what happened, what is
wrong, and what happens next.

Use before creating an issue, specification, or code when the desired outcome
is not yet crisp.

## Workflow

1. State the problem and desired outcome in plain language.
2. Ask only when the answer changes the contract and cannot be safely assumed;
   otherwise record a reversible assumption and continue.
3. Consider doing nothing, reusing an existing capability, and the smallest
   reversible option.
4. Record alternatives, non-goals, risks, and unresolved questions.
5. Produce a short brief and choose exactly one next action.

## Output

Write an optional brief under configured `paths.briefs` and end with:

```text
Next: intake|specify|build|none
Brief: <repo-relative-path|none>
```

## Rules

- Shape the work, do not implement it. Create a tracker item when the request
  calls for one; otherwise do not create one for ceremony.
- Do not hide an assumption behind confident prose.
- If no meaningful work remains, use `Next: none`.
