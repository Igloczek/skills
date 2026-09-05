---
name: setup
version: 0.1.0
description: "Bootstrap a repository for the shared skills, install missing upstream companions, and record local commands, documents, providers, and safe defaults without overwriting existing configuration."
---

Run this once per repository, and again only when its tooling, provider, or
project-local domain-expert setup changes.

Start by running the bundled [`scripts/init.ts`](scripts/init.ts) with the
project as its working directory, using Bun or `node --experimental-strip-types`.
It performs the repeatable bootstrap: checks
the project root and known signals, creates `.ai` when needed, checks project
skill directories, and installs missing upstream companions from
[`references/external-skills.json`](references/external-skills.json). Use
`--dry-run` to inspect the result without changing anything; pass `--agent` for
a narrower target than the default `*` (all supported agents). Do not recreate
these checks manually.

After writing `.ai/skills.json`, run the bundled [`scripts/check.ts`](scripts/check.ts)
with `--require-setup`. It performs the read-only project preflight: validates
the setup config shape, configured command/provider inventories, any configured
domain experts and their sources, and the project root. It does not execute
commands or connect to providers.

## Workflow

1. Read the repository's instructions and inspect its package manager, source
   layout, documentation paths, test/lint/build commands, tracker, and browser
   setup if present.
2. Detect whether the repository has domain-specific behavior or a UI. If
   domain expertise is useful, ask for each expert's role, authoritative source
   paths, boundary, and local destination. Allow no experts or multiple experts;
   offer `none` when domain expertise is unnecessary.
3. Show detected values and the proposed domain-expert routes. A project may be
   ready with no domain experts. For each configured expert, require a named
   role and readable sources.
4. With confirmation, write `.ai/skills.json`. Preserve existing files and
   keep credentials as environment-variable names or ignored file paths.
5. Read [domain-expert.md](references/domain-expert.md) when one or more domain
   experts are needed. Create or update each confirmed project-local
   domain-expert skill. Do not create local copies of public skills.
6. Run `scripts/check.ts --require-setup` and check that configured command and
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
