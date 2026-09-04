---
name: research
description: "Investigate an external or uncertain question with high-trust primary sources and return cited findings for shaping or specification."
---

## Voice

Write like a blunt developer talking to another developer. Use plain words,
short sentences, and no corporate filler. No yap. Say what happened, what is
wrong, and what happens next.

## Workflow

1. Define the question, date boundary, and claims that need support.
2. Prefer official documentation, standards, source code, papers, and first-
   party data. Record access dates and distinguish facts from inference.
3. Capture uncertainty, conflicting evidence, and practical implications.
4. Write a concise Markdown findings file under configured `paths.research` and
   hand it to `shape` or `specify`.

Do not implement from an uncited assumption. Do not delegate research without
a bounded question and a non-recursive stop.

## Output

```text
Question: <bounded research question>
Cutoff: <freshness boundary and access date>
Findings: <claim, confidence, and direct citation>
Conflicts: <material disagreement or none>
Implications: <constraints for shape/specify>
Artifact: <configured project-relative findings path>
Open: <unsupported claims or inaccessible sources|none>
Status: READY|BLOCKED
```

## Rules

- Every material external claim needs a citation that directly supports it.
- Prefer primary and authoritative sources; label inference and do not erase
  disagreement between credible sources.
- Re-check facts that can change after the stated cutoff.
- Change only the findings artifact. Research does not authorize implementation
  or external publication.
- `READY` requires enough cited evidence for the next decision, not a fixed
  number of sources.
