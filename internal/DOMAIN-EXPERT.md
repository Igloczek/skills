# Project-local domain experts

`setup` may create zero or more domain experts inside a project. Each role is
selected by the project owner (`billing-specialist`, `tax-specialist`, or
another domain role), and each expert is grounded in confirmed local source
paths. They are not part of this public skill collection.

Use blunt developer language in the expert too: plain words, short sentences,
no corporate filler, no yap.

## Lifecycle

1. Detect whether any domain-specific behavior needs expert context. If the
   role, sources, boundary, and local destination are clear from the project,
   use them. Ask only when a missing decision would change correctness.
2. Render each local skill from `skills/setup/references/domain-expert.md`.
3. Record the local paths and sources in `.ai/skills.json`; preserve existing
   custom experts and repair obvious config mistakes.
4. A project may have no domain experts. A missing optional expert is not a
   reason to stop unrelated work.

## Contract

The expert is read-only. It separates documented facts, cited standards,
expert assessment, assumptions, and unknowns; cites the source for material
claims; and never turns missing data into a default or a verdict.

Its handoff uses:

```text
DOMAIN_STATUS: CONFIRMED|CONDITIONAL|REJECTED|BLOCKED|NOT_RUN
SCOPE: artifacts and sources actually read
DECISION: one domain verdict
EVIDENCE: facts, source sections, assessment, and assumptions
CHANGES: none
OPEN: missing evidence, owner, and next action
```

All other roles use public skills. Do not create a local domain expert when a
public skill already covers the work. Multiple local experts are valid when a
project needs distinct authorities.
