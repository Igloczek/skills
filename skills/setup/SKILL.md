---
name: setup
description: "Bootstrap a repository for the shared skills, install missing upstream companions, and record local commands, documents, providers, and safe defaults without overwriting existing configuration."
---

Run this once per repository, and again only when its tooling, provider, or
project-local domain-expert setup changes.

Start by running the bundled [`scripts/init.ts`](scripts/init.ts) with the
project as its working directory, using Bun or `node --experimental-strip-types`.
It checks the project root, known signals, `.ai`, and available upstream
companions from
[`references/external-skills.json`](references/external-skills.json). Use
`--dry-run` to inspect the result without changing anything; pass `--agent` for
a narrower target than the default `*` (all supported agents). Do not recreate
these checks manually.

Write `.ai/skills.json` using the complete
[`references/skills-config.md`](references/skills-config.md) contract, then run
the bundled [`scripts/check.ts`](scripts/check.ts)
with `--require-setup`. It performs the read-only project preflight: validates
the setup config shape, configured command/provider inventories, any configured
domain experts and their sources, and the project root. It does not execute
commands or connect to providers.

## Workflow

1. Read the repository's instructions and inspect its package manager, source
   layout, documentation paths, test/lint/build commands, tracker, and browser
   setup if present.
2. Detect whether the repository has domain-specific behavior or a UI. Select
   the `review` companion group for the core review workflow and add `ui` only
   when the repository has user-interface work. If
   domain expertise is useful, ask for each expert's role, authoritative source
   paths, boundary, and local destination. Allow no experts or multiple experts;
   offer `none` when domain expertise is unnecessary.
3. Show detected values and the proposed domain-expert routes. A project may be
   ready with no domain experts. For each configured expert, require a named
   role and readable sources.
4. Run `scripts/init.ts --companions review` and append `,ui` when UI companions
   are needed. Do not pause for confirmation: invoking `setup` authorizes the
   selected project-local installs. Commit the generated `skills-lock.json`;
   it records the resolved source ref and content hash used by the supported
   CLI. Use `--refresh` only when dependency refresh is part of the request,
   then review and commit the lock change.
5. Write `.ai/skills.json` from `references/skills-config.md` without pausing for
   confirmation; invoking `setup` authorizes this reversible project-local edit.
   Preserve existing values, record the detected validation and feedback
   commands in their defined fields, and keep credentials as environment-variable
   names or ignored file paths.
6. Read [domain-expert.md](references/domain-expert.md) when one or more domain
   experts are needed. Create or update each confirmed project-local
   domain-expert skill. Do not create local copies of public skills.
7. Run `scripts/check.ts --require-setup` and check that configured command and
   provider inventories, sources, and generated domain experts have usable
   descriptors and paths. Do not invent a command, source, or domain rule;
   report missing configuration instead.

If the initializer exits non-zero or reports `Status: NEEDS_SETUP`, stop before
configuring downstream workflows and report its `Open:` items.

## Output

Report the config path, detected commands, enabled providers, the domain-expert
paths or `none`, and remaining gaps. End with `Status: READY` or
`Status: NEEDS_SETUP`. The initializer may additionally return `Status: DRY_RUN`.

## Rules

- Never print, commit, or store a secret.
- `--dry-run` must make no changes.
- Install only selected companion groups. Do not silently refresh an existing
  install or ignore a changed `skills-lock.json` in the final diff.
- Never publish project-local domain experts or copy public-skill text into this
  collection.
- Each domain expert must be grounded in project sources. A role such as
  `billing-specialist` is created inside the consuming project, not here.
- Missing source paths or a usable target is a visible setup gap, not permission
  to create a weaker substitute.
- Do not install mutation, complexity, architecture, or other quality tooling
  by default; record what the project already supports and let later workflows
  choose checks proportionally.
- Do not create tracker labels, branches, hooks, or browser processes unless
  the user explicitly enables that action.
- A setup failure is a clean stop for downstream workflows, not permission to
  guess.
