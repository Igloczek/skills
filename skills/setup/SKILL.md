---
name: setup
description: "Bootstrap a repository for the shared skills, install missing upstream companions, and record local commands, documents, providers, and safe defaults without overwriting existing configuration."
---

Run this once per repository, and again only when its tooling, provider, or
project-local domain expert setup changes.

Start by running the bundled [`scripts/init.cjs`](scripts/init.cjs) with the
project as its working directory. It performs the repeatable bootstrap: checks
the project root and known signals, creates `.ai` when needed, checks project
skill directories, and installs missing upstream companions from
[`references/external-skills.json`](references/external-skills.json). Use
`--dry-run` to inspect the result without changing anything; pass `--agent` for
a narrower target than the default `*` (all supported agents). Do not recreate
these checks manually.

## Workflow

1. Read the repository's instructions and inspect its package manager, source
   layout, documentation paths, test/lint/build commands, tracker, and browser
   setup if present.
2. Detect whether the repository has domain-specific behavior or a UI. For a
   domain-specific repository, ask for exactly one domain expert's role,
   authoritative source paths, boundary, and local destination. Offer `none`
   for optional providers and domain expertise.
3. Show detected values and the proposed domain-expert route. Do not report
   setup ready until a domain-specific repository has a named expert and
   readable sources.
4. With confirmation, write `.ai/skills.json`. Preserve existing files and
   keep credentials as environment-variable names or ignored file paths.
5. Read [domain-expert.md](references/domain-expert.md) when a domain expert is
   needed. Create or update exactly one project-local domain-expert skill. Do
   not create local copies of public skills.
6. Check that every configured command, provider descriptor, source, and
   generated domain expert is usable. Do not invent a command, source, or domain
   rule; report missing configuration instead.

If the initializer exits non-zero or reports `Status: NEEDS_SETUP`, stop before
configuring downstream workflows and report its `Open:` items.

## Output

Report the config path, detected commands, enabled providers, the domain-expert
path or `none`, and remaining gaps. End with `Status: READY` or
`Status: NEEDS_SETUP`. The initializer may additionally return `Status: DRY_RUN`.

## Rules

- Never print, commit, or store a secret.
- `--dry-run` must make no changes.
- Never publish the project-local domain expert or copy public-skill text into
  this collection.
- A domain expert must be grounded in project sources. A role such as
  `billing-specialist` is created inside the consuming project, not here.
- Missing source paths or a usable target is a visible setup gap, not permission
  to create a weaker substitute.
- Do not create tracker labels, branches, hooks, or browser processes unless
  the user explicitly enables that action.
- A setup failure is a clean stop for downstream workflows, not permission to
  guess.
