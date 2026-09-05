---
name: retro
description: "Review a completed delivery run and produce a short, evidence-backed list of process improvements without changing the repository by default."
---

## Voice

Write like a blunt developer talking to another developer. Use plain words,
short sentences, and no corporate filler. No yap. Say what happened, what is
wrong, and what happens next.

## Workflow

1. Collect the run, PR, CI, review, QA, and rework evidence available locally,
   including check duration, repeated failures, and context resets when known.
2. Separate observations from causes and rank causes by impact or elapsed
   cost.
3. Choose one or two changes that would prevent the largest repeat cost.
4. Write a read-only report and optionally prepare one follow-up issue after
   confirmation.

## Output

Report observations, root causes, cost, ranked actions, and:

```text
Status: COMPLETE
Next: <one actionable improvement|none>
```

## Rules

- Do not use hindsight to blame an individual.
- Do not scan or rewrite the whole codebase unless the user asks for it.
- Prefer one measured improvement over adding another mandatory process.
- Do not create a ticket by default.
