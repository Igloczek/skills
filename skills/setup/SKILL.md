---
name: setup
description: "Bootstrap this repository for the shared skills once, recording local commands, documents, providers, and safe defaults without overwriting existing configuration."
---

Run this once per repository, and again only when its tooling, provider, or
project-local expert setup changes.

## Workflow

1. Read the repository's instructions and inspect its package manager, source
   layout, documentation paths, test/lint/build commands, tracker, and browser
   setup if present.
2. Detect whether the repository has domain-specific behavior or a UI. Ask only
   for choices that cannot be derived safely: the domain expert's role and
   authoritative source paths, optional companion skills, and local profile
   directory. Offer `none` for optional providers and domain expertise.
3. Show detected values and proposed local profile routes. For a
   domain-specific repository, do not report setup ready until a named domain
   expert and its sources are confirmed.
4. With confirmation, write `.ai/skills.json`. Preserve existing files and
   keep credentials as environment-variable names or ignored file paths.
5. Read [expert-profiles.md](references/expert-profiles.md) when local profiles
   are needed. Create or update only project-local profiles: the two dedicated
   review lanes when `gilfoyle`/`ponytail` are available, `persona-ui-dev` for
   UI work, and the user-named domain expert for domain work.
6. Check that every configured command, provider descriptor, companion skill,
   and generated profile is usable. Do not invent a command, source, or domain
   rule; report missing configuration instead.

## Output

Report the config path, detected commands, enabled providers, local profiles,
and remaining gaps. End with `Status: READY` or `Status: NEEDS_SETUP`.

## Rules

- Never print, commit, or store a secret.
- `--dry-run` must make no changes.
- Never publish a project-local profile or copy companion-skill text into this
  public collection.
- A domain expert must be grounded in project sources. A role such as
  `nutritionist` is created inside the consuming project, not here.
- Missing `gilfoyle`, `ponytail`, UI companion skills, source paths, or a usable
  target is a visible setup gap, not permission to create a weaker substitute.
- Do not create tracker labels, branches, hooks, or browser processes unless
  the user explicitly enables that action.
- A setup failure is a clean stop for downstream workflows, not permission to
  guess.
