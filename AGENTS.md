# AGENTS.md

## Purpose

This repo contains skills for a solo developer using an AI coding agent. They
cover the basic work: understand the request, keep the change small, write the
code, review it, run the right checks, and finish the PR.

This is not a company process, compliance tool, test runner, or project
template. Do not use every skill on every task. Use the shortest path that is
safe for the change. Add more checks when the change is risky or unclear.

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
