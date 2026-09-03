# Project-local domain expert

`setup` creates exactly one domain expert inside a domain-specific project. The
role is selected by the project owner (`nutritionist`, `tax-specialist`, or
another domain role), and the expert is grounded in confirmed local source
paths. It is not part of this public skill collection.

## Lifecycle

1. Detect domain-specific behavior and ask for the role, slug, authoritative
   sources, boundary, and local destination.
2. Render the local skill from `skills/setup/references/domain-expert.md`.
3. Record the local path and sources in `.ai/skills.json`; preserve an existing
   custom expert unless the owner explicitly approves an update.
4. Require a named expert and readable sources before `setup` returns `READY`.
   A domain-neutral project records `domain_expert: null`.

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

All other roles use public skills. Do not create additional local role files
when `review-gilfoyle`, `review-ponytail`, or `ui-dev` already covers the work.
