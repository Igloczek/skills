# AGENTS.md

## Purpose

This repository builds small, agent-neutral workflow skills for a solo
developer who wants to ship software with less friction. The skills help an
agent clarify a request, choose a small slice, implement it, review it,
verify the real behavior, and finish safely.

This is not an enterprise software process, compliance framework, test runner,
or project template. Prefer the smallest useful workflow. Make extra process
conditional on real uncertainty or risk.

## Change guidelines

- Add guidance only when it changes a decision or prevents a concrete failure.
- Reuse an existing skill or internal primitive before adding a new one.
- Keep public skills agent-neutral and project-scoped. Do not hardcode a vendor,
  model, forge, or global configuration path without a clear boundary.
- Preserve input validation, security, accessibility, data-loss protection,
  and explicit human control over irreversible actions.
- Treat quality metrics as changed-surface signals. Use configured tools only;
  warnings are not blockers unless project policy or risk makes them gates.
- In TypeScript, avoid new unapproved `any`. Allow `unknown` at trust
  boundaries when it is narrowed before domain logic.
- Keep public skills under `skills/` and shared non-installable contracts in
  `internal/`. Update `README.md` when the public workflow or roster changes.

## Validation

Run the smallest relevant check, then run:

```bash
npm run check
git diff --check
```

Do not add dependencies or global setup just to make a skill look complete.
