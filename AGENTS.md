# Agent Instructions

This file is for AI agents working in this repo. Read it before changing
skills, docs, scripts, or shared contracts.

## North star

Make one solo developer faster.

Take a request to a working, checked, reviewable change with as little owner
input as possible. Every rule must earn its place: help ship better code, catch
a real problem, or keep the next step clear. If it only adds ceremony, delete
it.

## Voice

Use blunt developer language. Plain words. Short sentences. Direct verbs. No
corporate filler, polished round wording, fake certainty, or yap. Say the
result first. Then say what failed, what was checked, and what happens next.

This applies to every skill, report, status, comment, handoff, and commit
message. Keep the tone direct without hiding a real risk or making up facts.

Never use em dashes, semicolons, and other "complex" sentence constructions.

## Autonomy

- Do normal in-scope work without asking: inspect, edit, run commands, install
  what is needed, create branches, commit, push, and open or update PRs.
- Make a sensible, reversible assumption and keep moving.
- Ask only for a missing credential or decision, a destructive or irreversible
  action, or a real scope change.
- A missing optional tool, check, or artifact is a fallback and a note, not a
  blocker.
- Skill boundaries are routing hints, not permission walls. Switch routes when
  the work needs it.
- No approval theatre, role gates, fake handoffs, artificial wait loops, or
  security by obscurity.

## Workflow rules

- Read `README.md` and the relevant `SKILL.md` files before changing behavior.
- Every public skill in `skills/` is a contract. Keep valid frontmatter with a
  unique `name`, clear `description`, `## Voice`, and `## Output`.
- Keep public skills generic. Project-specific rules and domain experts belong
  in the consuming project.
- Use existing skills before adding a new one. Do not add a dependency,
  registry, pin, updater, or workflow layer unless the repo truly needs it.
- Keep `setup` project-local and self-healing. There is no separate setup
  verification skill.
- Use the upstream `npx skills` CLI for external skills. Do not reimplement its
  install, update, or version lifecycle here.
- `fix` uses the normal `build` path. Add a reproduction and regression check;
  do not invent a bug-only process.
- Run every available review skill on every change. Always run
  `review-standard`, `review-gilfoyle`, and `review-ponytail`. Run other local
  or external reviewers too. Give them the same request and diff. Do not pick
  a lane by heuristic or tell an external reviewer how to review.
- Normalize joined review output only enough to make it readable. Keep all
  findings and disagreements.

## Real safeguards

Keep input validation, real security, accessibility, and data-loss protection
when the code needs them. Security means actual controls such as validation,
auth, permissions, and secret hygiene. It does not mean vague warnings or
security-by-obscurity rules.

Warnings are warnings. Optional checks are optional. `BLOCKED` means a required
input, tool, credential, or decision is actually unavailable. Do not turn style
preferences, uncertainty that can be handled with a reversible assumption, or
missing optional evidence into a stop.

Do not bypass a real failing check, unresolved conflict, data-loss risk, or
provider-required approval. Do not invent extra gates. Do not merge unless the
task calls for it.

## Repo rules

- Keep public skills under `skills/` and shared non-installable contracts under
  `internal/`.
- Update `README.md` when the public workflow or skill roster changes. README is
  for humans; this file is for agents.
- Update `scripts/repo-check.ts` when a repository invariant changes. Keep
  project preflight checks in `skills/setup/scripts/check.ts`.
- In TypeScript, avoid new unapproved `any`. Use `unknown` at input boundaries
  and narrow it before domain logic.
- Keep unrelated changes untouched.

## Validation

Before finishing a change, run:

```bash
git diff --check
bun run check
```

Inspect the final diff. Report the result first, then checks, real open items,
and the next action. No process diary.
