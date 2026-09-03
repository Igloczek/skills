---
name: specify
description: "Turn an actionable brief or feature issue into an implementation-ready specification and a dependency-aware plan without mixing design and code."
---

## Workflow

1. Read the brief, repository conventions, relevant code, and existing
   vocabulary.
2. Define goal, non-goals, behavior, acceptance criteria, interfaces,
   compatibility constraints, risks, and open questions.
3. Resolve questions with the user or record explicit reversible assumptions.
4. Split the work into vertical, testable phases and note blocking edges.
5. Review the simplest viable design and publish the spec to the configured
   docs path. A design-only PR is optional and must contain no implementation.

## Output

```text
Spec: <repo-relative-path>
Next: build|shape|none
```

The spec must contain `goal`, `non_goals`, `acceptance_criteria`, `decisions`,
`tasks`, `dependencies`, and `open_questions`.

## Rules

- Do not smuggle code into a spec-only artifact.
- Do not mark an unresolved contract as complete.
- Prefer one small module or seam over speculative generality.
