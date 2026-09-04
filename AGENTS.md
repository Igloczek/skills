# Agent Instructions

These instructions apply to the whole repository.

## Purpose

This repo contains skills for a solo developer using an AI coding agent. They
cover the basic work: understand the request, keep the change small, write the
code, review it, run the right checks, and finish the PR.

Tools such as Cezar can run the skills as predefined workflow steps. Keep this
repo focused on those steps and the shared contracts they use.

## Working style

This is a solo repo. One owner, one agent, no committee.

Finish the job. Normal in-scope work needs no permission: read, edit, run
commands, install dependencies, create branches, commit, push, and open or
update PRs when the task calls for it.

Make a sensible assumption and continue. Ask only when a required credential or
decision is missing, the next action is destructive or irreversible, or the
request would materially expand scope. A missing optional tool is not a stop.

No approval theatre, role gates, fake handoffs, artificial reviewer selection,
or security-by-obscurity rules. Skill boundaries are routing hints, not walls.
Keep real validation, security, accessibility, and data-loss protection. Write
short, concrete instructions in plain words. No corporate prose.

## Repository rules

- Read `README.md` and the relevant `SKILL.md` files before changing behavior.
- Treat every `skills/*/SKILL.md` as a public contract. Keep valid frontmatter
  with a unique `name` and a clear `description`.
- Keep public skills generic and project-agnostic. Project-specific domain
  experts belong in the consuming repository, not here.
- Prefer composing existing skills over adding narrower or duplicate skills.
- Keep `setup` separate from the delivery workflow. It stays project-local and
  agent-neutral; installation stays project-scoped.
- Run every available review skill on every change, including the baseline
  `review-standard`, `review-gilfoyle`, and `review-ponytail` lanes. Do not omit
  a lane based on a heuristic; invoke external skills through `npx skills` and
  normalize their output only when joining the report.
- Preserve input validation, real security, accessibility, data-loss
  protection, and explicit human control over irreversible actions. Do not add
  process gates around them.
- Treat quality metrics as changed-surface signals. Use configured tools only;
  warnings are not blockers unless project policy or risk makes them gates.
- In TypeScript, avoid new unapproved `any`. Allow `unknown` at trust
  boundaries when it is narrowed before domain logic.
- Keep public skills under `skills/` and shared non-installable contracts in
  `internal/`. Update `README.md` when the public workflow or roster changes.
- Update `scripts/repo-check.ts` when a repository invariant changes; keep
  project preflight checks in `skills/setup/scripts/check.ts`.

## Validation

Before finishing a change, run:

```bash
git diff --check
bun run check
```

Inspect the final diff and keep unrelated changes untouched. Do not add a
dependency or workflow layer unless the existing collection cannot cover the
need.
