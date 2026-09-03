---
name: setup
description: "Bootstrap this repository for the shared skills once, recording local commands, documents, providers, and safe defaults without overwriting existing configuration."
---

Run this once per repository, and again only when its tooling or provider setup
changes.

## Workflow

1. Read the repository's instructions and inspect its package manager, source
   layout, documentation paths, test/lint/build commands, tracker, and browser
   setup if present.
2. Show detected values and ask only for choices that cannot be derived
   safely. Offer `none` for optional providers.
3. With confirmation, write `.ai/skills.json`. Preserve existing files and
   keep credentials as environment-variable names or ignored file paths.
4. Check that every configured command and provider descriptor is usable. Do
   not invent a command; report missing configuration instead.

## Output

Report the config path, detected commands, enabled providers, and remaining
gaps. End with `Status: READY` or `Status: NEEDS_SETUP`.

## Rules

- Never print, commit, or store a secret.
- `--dry-run` must make no changes.
- Do not create tracker labels, branches, hooks, or browser processes unless
  the user explicitly enables that action.
- A setup failure is a clean stop for downstream workflows, not permission to
  guess.
