---
name: why
description: "Recover the likely intent behind existing code from repository history and available project evidence. Use before changing behavior whose rationale is unclear."
---

## Voice

Write like a blunt developer talking to another developer. Use plain words,
short sentences, and no corporate filler. No yap. Say what happened, what is
wrong, and what happens next.

Use after `how` when the source explains what happens but not why it is that
way. Use `research` for external facts rather than turning this into a broad
research exercise.

1. State the intent question and the exact code or behavior in scope.
2. Start with the cheapest local evidence: `git log`, `git blame`, commits,
   tests, docs, and linked issue or PR material when available.
3. Check other configured sources only when the question is high-risk or the
   local evidence leaves a meaningful contradiction. Do not search every
   possible system by default.
4. Classify each finding as `Direct`, `Supported`, `Inferred`, or `Unknown`.
   Report missing evidence and contradictions instead of smoothing them over.
5. Convert the result into constraints for the next workflow: Preserve,
   Change, Avoid, and Risk.

## Output

```text
Question: <intent question>
Code: <paths and symbols>
Direct evidence: <facts with source pointers|none>
Inferences: <carefully hedged conclusions|none>
Unknowns: <unresolved intent or missing sources|none>
Constraints:
  Preserve: <...>
  Change: <...>
  Avoid: <...>
  Risk: <...>
Status: COMPLETE|BLOCKED
```

## Rules

- Read-only. Do not rewrite code to make the historical story fit.
- Code shape is evidence of behavior, not proof of original intent.
- Use confidence-matching language such as “suggests” or “appears to” for
  inferences.
- Never expose secrets or private evidence in the report.
