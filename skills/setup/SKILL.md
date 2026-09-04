---
name: setup
description: "Bootstrap a repository for the shared skills and record local commands, documents, providers, and safe defaults without overwriting existing configuration."
---

## Voice

Write like a blunt developer talking to another developer. Use plain words,
short sentences, and no corporate filler. No yap. Say what happened, what is
wrong, and what happens next.

Run this once per repository, and again only when its tooling, provider, or
project-local domain-expert setup changes.

Start by running the bundled [`scripts/init.ts`](scripts/init.ts) with the
project as its working directory, using Bun or `node --experimental-strip-types`.
It performs the repeatable bootstrap: checks the project root and known signals
and creates `.ai` when needed. Use `--dry-run` to inspect the result without
changing anything. Do not recreate these checks manually.

When an external skill is needed, use the upstream CLI directly, for example
`npx skills find <query>`, `npx skills add <source> --skill <name> --agent <agent> --yes`,
or `npx skills use <source> --skill <name>`. Do not add a local registry,
lockfile, version policy, installer, or updater around that CLI.

After writing or repairing `.ai/skills.json`, run the bundled
[`scripts/check.ts`](scripts/check.ts) with `--require-setup`. It performs the
read-only project preflight: validates the setup config shape, configured
command/provider inventories, configured paths, any domain experts and their
sources, and the project root. It does not execute commands or connect to
providers.

## Workflow

1. Read the repository's instructions and inspect its package manager, source
   layout, documentation paths, test/lint/build commands, tracker, and browser
   setup if present.
2. Detect whether the repository has domain-specific behavior or a UI. If
   domain expertise is useful and the role, sources, boundary, and destination
   are clear, create the local expert. Otherwise continue without one and ask
   only when the missing decision changes correctness.
3. Use the detected values and routes. A project may be ready with no domain
   experts; do not wait for a ceremony to prove that.
4. Write or repair `.ai/skills.json` from
   [`references/skills-config.md`](references/skills-config.md). Preserve
   existing values, record detected validation and feedback commands in their
   defined fields, and keep credentials as environment-variable names or
   ignored file paths. This project-local repair is part of setup; do not pause
   for a second verification skill.
5. Read [domain-expert.md](references/domain-expert.md) when one or more domain
   experts are needed. Create or update each confirmed project-local
   domain-expert skill. Do not create local copies of public skills.
6. Run `scripts/check.ts --require-setup`. If it reports a malformed or missing
   setup value, repair that setup value and rerun the check until it is ready.
   Use the best available command, source, or domain rule. Ask only for missing
   information that cannot be inferred and blocks this setup.

If the initializer cannot access the project or `.ai`, report its `Open:` items
and use a fallback when possible. A configuration check failure is a
self-healing setup task when the missing value can be derived from the
repository.

## Output

Report the config path, detected commands, enabled providers, the domain-expert
paths or `none`, and remaining gaps. End with `Status: READY` or
`Status: NEEDS_SETUP`. The initializer may additionally return `Status: DRY_RUN`.

## Rules

- Never print, commit, or store a secret.
- `--dry-run` must make no changes.
- Do not maintain an external skill manifest, lockfile, pinned version, or
  custom install/update lifecycle; use `npx skills` for external skills.
- Never publish project-local domain experts or copy public-skill text into this
  collection.
- Each domain expert must be grounded in project sources. A role such as
  `billing-specialist` is created inside the consuming project, not here.
- Missing source paths or a usable target are a visible gap. Use the best
  available substitute, record the gap, and ask only when it blocks correctness.
- Do not install mutation, complexity, architecture, or other quality tooling
  unless it is useful for this project; use what is already there first.
- Create tracker labels, branches, hooks, or browser processes when the work
  needs them. Do not create unrelated setup.
- Make a reversible assumption when an owner decision or source is missing. Ask
  only when that decision changes the current work.
