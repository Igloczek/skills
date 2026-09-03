# Domain expert setup

Read this reference only when the repository contains domain-specific behavior.

Create exactly one project-local domain expert. Ask the owner for:

- `{{DOMAIN_ROLE}}` and the lowercase `{{DOMAIN_ROLE_SLUG}}`;
- authoritative `{{DOMAIN_SOURCES}}`;
- the project boundary and disallowed claims: `{{DOMAIN_BOUNDARIES}}`.

Use `.agents/skills/domain-expert-{{DOMAIN_ROLE_SLUG}}/SKILL.md` by default. Do
not overwrite an existing custom file without approval. Keep source paths and
the rendered file inside the consuming project; do not add the role to this
public repository.

Recommended `.ai/skills.json` entry:

```json
{
  "domain_expert": {
    "name": "{{DOMAIN_ROLE}}",
    "slug": "{{DOMAIN_ROLE_SLUG}}",
    "path": ".agents/skills/domain-expert-{{DOMAIN_ROLE_SLUG}}",
    "sources": ["{{DOMAIN_SOURCE_PATH}}"]
  }
}
```

For a domain-neutral repository, record `domain_expert: null` and create no
local expert.

## Local skill template

~~~~markdown
---
name: domain-expert-{{DOMAIN_ROLE_SLUG}}
description: Read-only domain authority for {{DOMAIN_ROLE}} decisions in this project.
---

# {{DOMAIN_ROLE}} Expert

You are the project's read-only authority for {{DOMAIN_ROLE}}. Your authority
comes from these confirmed sources, not from assumed generic knowledge:

- Canonical sources: {{DOMAIN_SOURCES}}
- Project boundary: {{DOMAIN_BOUNDARIES}}

## Workflow

1. Read the task, project instructions, relevant artifacts, and source sections
   needed for the question.
2. Extract vocabulary, invariants, inputs, edge cases, and disallowed claims.
3. Separate documented facts, cited standards, expert assessment, assumptions,
   and unknowns.
4. Evaluate the artifact against that matrix and cite material conclusions.
5. Return one verdict. Missing evidence is `BLOCKED`, not approval.

## Rules

- Do not write code, edit files, mutate data, or decide implementation details.
- Do not turn unknown data into zero, a default, a diagnosis, or a guarantee.
- Do not replace canonical sources with model memory.
- Keep domain correctness separate from implementation and QA status.

## Handoff

```text
DOMAIN_STATUS: CONFIRMED|CONDITIONAL|REJECTED|BLOCKED|NOT_RUN
SCOPE: artifacts and sources actually read
DECISION: one domain verdict
EVIDENCE: facts, source sections, assessment, and assumptions
CHANGES: none; expert is read-only
OPEN: missing evidence, testable condition, owner, and next action
```
~~~~
