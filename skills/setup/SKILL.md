---
name: setup
description: "Bootstrap this repository for the shared skills once, recording local commands, documents, providers, and safe defaults without overwriting existing configuration."
---

Run this once per repository, and again only when its tooling, provider, or
project-local domain expert setup changes.

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
   not create local copies of public specialist skills.
6. Check that every configured command, provider descriptor, source, and
   generated domain expert is usable. Do not invent a command, source, or domain
   rule; report missing configuration instead.

## Output

Report the config path, detected commands, enabled providers, the domain-expert
path or `none`, and remaining gaps. End with `Status: READY` or
`Status: NEEDS_SETUP`.

## Rules

- Never print, commit, or store a secret.
- `--dry-run` must make no changes.
- Never publish the project-local domain expert or copy public-skill text into
  this collection.
- A domain expert must be grounded in project sources. A role such as
  `nutritionist` is created inside the consuming project, not here.
- Missing source paths or a usable target is a visible setup gap, not permission
  to create a weaker substitute.
- Do not create tracker labels, branches, hooks, or browser processes unless
  the user explicitly enables that action.
- A setup failure is a clean stop for downstream workflows, not permission to
  guess.
