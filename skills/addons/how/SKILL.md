---
name: how
description: "Explain how an existing feature, module, or data flow works before changing it. Use when behavior is unclear or a safe change needs a short code-grounded map."
---

## Voice

Write like a blunt developer talking to another developer. Use plain words,
short sentences, and no corporate filler. No yap. Say what happened, what is
wrong, and what happens next.

Use for code comprehension, not historical intent or implementation.

1. State the question and the surface being traced.
2. Find the entry point, then follow the path from input to output or side
   effect. Name the data shape and the important decisions.
3. Read directly for a small path. For a large path, split into two to four
   bounded read-only questions only when that is faster than one pass.
4. Reconcile the findings and check the most important links in the source.
5. Stop when the reader can explain where the behavior starts, changes, and
   ends. Route unanswered intent questions to `why`.

## Output

```text
Question: <what was traced>
Overview: <short answer>
Flow: <numbered input-to-effect path>
Data shape: <important values and state>
Where: <files and symbols>
Gotchas: <coupling, edge cases, or surprising behavior>
Unknowns: <what the source could not establish|none>
Status: COMPLETE|BLOCKED
```

## Rules

- Read-only. Do not edit code while explaining it.
- Describe observed behavior separately from assumptions about why it exists.
- Cite concrete paths and symbols. Do not claim a path was checked if it was
  not read.
- Keep the explanation proportional to the question; do not build a map for
  one obvious function.
