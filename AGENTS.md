# Agent Instructions

These instructions apply to the whole repository.

## Purpose

This repo contains skills for a solo developer using an AI coding agent. They
cover the basic work: understand the request, keep the change small, write the
code, review it, run the right checks, and finish the PR.

Tools such as Cezar can run the skills as predefined workflow steps. Keep this
repo focused on those steps and the shared contracts they use.

## Repository rules

- Read `README.md` and the relevant `SKILL.md` files before changing behavior.
- Treat every `skills/*/SKILL.md` as a public contract. Keep valid frontmatter
  with a unique `name`, a `version` in `MAJOR.MINOR.PATCH` form, and a clear
  `description`. Bump the skill version when its instructions or bundled resources change.
- Keep public skills generic and project-agnostic. Project-specific domain
  experts belong in the consuming repository, not here.
- Prefer composing existing skills over adding narrower or duplicate skills.
- Keep `setup` separate from the delivery workflow. It stays project-local and
  agent-neutral; installation stays project-scoped.
- Treat this repo's skills as content being authored, not instructions for
  working on this repo. Do not execute their workflows or review personas
  against changes to the skills themselves unless the user explicitly asks.
- Do not spawn reviewers or run code-review personas for Markdown-only changes,
  including skill instructions, frontmatter, README, and AGENTS.md. Inspect the
  diff directly and run only the repository validation below. Executable-code
  changes get proportionate checks, not an automatic multi-reviewer workflow.
- Preserve input validation, security, accessibility, data-loss protection,
  and explicit human control over irreversible actions.
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

Inspect the final diff and keep unrelated changes untouched. Add a dependency
or workflow layer only when the existing collection cannot cover the need.
