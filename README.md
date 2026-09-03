# Skills

Small, intent-based agent workflows for a normal software delivery lifecycle.

## Install once

Install the collection into the global skill directory of your agent (or use
the installer's global option when it is available):

```bash
npx skills add igloczek/skills --skill '*'
```

Projects may still need a small local `.ai/skills.json` for their own commands,
tracker, or browser provider. That is project configuration, not a second skill
installation.

## Shape

The current collection contains:

| Layer | Entry points | Purpose |
| --- | ---: | --- |
| Core | 10 | The default SDLC menu: `setup`, `shape`, `intake`, `specify`, `build`, `fix`, `review`, `verify`, `finish`, `retro`. |
| Add-ons | 5 | `prototype`, `research`, `deep-design`, `ux-proof`, `wayfinder`; load only when the task needs them. |
| Internal | 9 | Shared primitives in [`internal/PRIMITIVES.md`](internal/PRIMITIVES.md); local profile contracts in [`internal/PERSONAS.md`](internal/PERSONAS.md), intentionally not installable skills. |

Modes such as autonomous, loop, resume, batch, dry-run, and tracker-less are
parameters of a workflow. They are not separate skills.

## Project-local expert pods

`setup` can create contextual profiles inside a consuming project (default:
`.agents/skills`). These profiles are project-local and are not part of this
repository's installable skill roster.

- `persona-reviewer-gilfoyle` is a dedicated, read-only operational review lane
  based on the public `gilfoyle` skill: runtime, reliability, security,
  observability, and incident evidence.
- `persona-reviewer-ponytail` is a dedicated, read-only minimality lane based on
  the public `ponytail` skill: deletion, YAGNI, stdlib/native alternatives, and
  avoidable complexity. It does not review correctness or apply fixes.
- `persona-ui-dev` is the UI implementation expert. Its pod references
  `design-taste-frontend` and `make-interfaces-feel-better` when installed, and
  keeps framework, accessibility, interaction, and performance decisions in one
  place.
- `persona-domain-expert` is generated per project from confirmed source paths
  and a user-selected role. A project may create a local `nutritionist`,
  `tax-specialist`, or another authority; that profile is deliberately not
  shipped or installable from this repository.

The `review` workflow composes the two review lanes independently and adds the
domain or UI lane only when the changed surface needs it. Missing companions or
domain sources produce a visible setup gap; they never become guessed guidance.
The profile templates and lifecycle contract live in
[`internal/PERSONAS.md`](internal/PERSONAS.md) and
[`skills/setup/references/expert-profiles.md`](skills/setup/references/expert-profiles.md).

## Contracts

Every mutating workflow must:

- state its inputs, outputs, side effects, and terminal states;
- preserve existing work and ask before destructive or irreversible actions;
- keep secrets out of prompts, files, comments, and reports;
- use `Status:`, `Next:`, `Spec:`, `Issue:`, and `PR:` markers when another workflow consumes the result;
- stop cleanly when a required provider, command, or artifact is missing.

`finish` never merges unless the user explicitly enables the merge action. UI
verification is evidence-based and optional for non-UI work.

## Contributing

Before adding a skill, prove that an existing entry point or add-on cannot own
the intent. Prefer a mode, reference, or internal primitive. New public skills
must add a distinct user-visible capability, a clear output contract, and a
small check in `scripts/check.cjs` if the structure changes.

Run:

```bash
npm run check
```

## Sources

This collection uses or is inspired by:

- [open-mercato/skills](https://github.com/open-mercato/skills)
- [mattpocock/skills](https://github.com/mattpocock/skills)
- [axiomhq/gilfoyle](https://github.com/axiomhq/gilfoyle)
- [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)
- [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)
- [jakubkrehel/make-interfaces-feel-better](https://github.com/jakubkrehel/make-interfaces-feel-better)

External skill instructions remain external dependencies; this repository
references their capabilities without bundling their skill files.
