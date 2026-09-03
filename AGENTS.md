# Agent Instructions

These instructions apply to the whole repository.

## Purpose

This repository provides a small, portable, project-scoped collection of agent
skills for software delivery. Keep it composable and useful across projects.

## Repository rules

- Read `README.md` and the relevant `SKILL.md` files before changing behavior.
- Treat every `skills/*/SKILL.md` as a public contract. Keep valid frontmatter
  with a unique `name` and a clear `description`.
- Keep public skills generic and project-agnostic. Project-specific domain
  experts belong in the consuming repository, not here.
- Prefer composing existing skills over adding narrower or duplicate skills.
- Keep `setup` separate from the delivery workflow. It must remain project-local
  and agent-neutral; never introduce global or Codex-only installation.
- When changing the public skill roster or workflow, update the README catalog
  and graph. Update `scripts/repo-check.ts` when a repository invariant changes;
  keep project preflight checks in `skills/setup/scripts/check.ts`.

## Validation

Before finishing a change, run:

```bash
git diff --check
bun run check
```

Inspect the final diff and keep unrelated changes untouched. Do not add a
dependency or workflow layer unless the existing collection cannot cover the
requirement.
