---
name: specify
description: "Turn an actionable brief or feature issue into a stable contract and the next small, testable slice without mixing design and code."
---

## Voice

Write like a blunt developer talking to another developer. Use plain words,
short sentences, and no corporate filler. No yap. Say what happened, what is
wrong, and what happens next.

## Workflow

1. Read the brief, repository conventions, relevant code, and existing
   vocabulary.
2. Define goal, non-goals, behavior, acceptance criteria, interfaces,
   compatibility constraints, risks, and open questions.
3. Resolve questions with the user only when they change the contract and
   cannot be made reversible; otherwise record the assumption and continue.
4. Define the next one or two vertical, testable slices and note blocking edges;
   keep later tasks provisional until implementation feedback exposes what they
   actually need.
5. For observable behavior, express acceptance as Given/When/Then or an
   equivalent executable scenario and add a short human/system QA procedure
   when that flow needs end-to-end proof.
6. Review the simplest viable design and publish the spec to configured
   `paths.specs`. A design-only PR is optional and must contain no implementation.

## Output

```text
Spec: <repo-relative-path>
Next: build|shape|none
```

The spec must contain `goal`, `non_goals`, `acceptance_criteria`, `decisions`,
`next_slice`, `tasks`, `dependencies`, and `open_questions`. Include
`qa_procedure` when a user or system flow is in scope.

## Rules

- Do not smuggle code into a spec-only artifact.
- Do not mark an unresolved contract as complete.
- Specify enough to align and verify the next slice; do not pretend the whole
  implementation can be predicted up front.
- Prefer one small module or seam over speculative generality.
