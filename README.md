# Skills

Small, intent-based agent workflows for a normal software delivery lifecycle.

This repository is an independent synthesis. It keeps the operational spine of
Open Mercato's skills and the engineering practices emphasized by Matt Pocock,
then rewrites them into a smaller collection with one public entry point per
intent. It is not affiliated with either project and does not copy their files
or wording.

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

The public surface is deliberately small:

| Layer | Entry points | Purpose |
| --- | ---: | --- |
| Core | 10 | The default SDLC menu: `setup`, `shape`, `intake`, `specify`, `build`, `fix`, `review`, `verify`, `finish`, `retro`. |
| Add-ons | 5 | `prototype`, `research`, `deep-design`, `ux-proof`, `wayfinder`; load only when the task needs them. |
| Internal | 9 | Shared primitives in [`internal/PRIMITIVES.md`](internal/PRIMITIVES.md); local profile contracts in [`internal/PERSONAS.md`](internal/PERSONAS.md), intentionally not installable skills. |

Modes such as autonomous, loop, resume, batch, dry-run, and tracker-less are
parameters of a workflow. They are not separate skills.

## Project-local expert pods

The public roster stays small. `setup` can create contextual profiles inside a
consuming project (default: `.agents/skills`) without publishing them here.

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

## Inspiration and attribution

The design was informed by:

- [open-mercato/skills](https://github.com/open-mercato/skills), maintained by Open Mercato — especially its pipeline contracts, PR state handling, QA gates, and provider descriptors.
- [mattpocock/skills](https://github.com/mattpocock/skills), maintained by Matt Pocock — especially its grilling, TDD, debugging, domain modeling, and deep-module practices.
- [axiomhq/gilfoyle](https://github.com/axiomhq/gilfoyle) and [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) — used as companion lenses for operational evidence and complexity reduction.
- [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) and [jakubkrehel/make-interfaces-feel-better](https://github.com/jakubkrehel/make-interfaces-feel-better) — used as optional companion guidance for the local UI developer profile.
- [Paszomistrz PR #100](https://github.com/Igloczek/paszomistrz/pull/100), used only as inspiration for repo-local specialist profiles and review routing. Its project-specific personas were not copied; the model was rewritten in English and generalized.

Both upstream repositories have their own licenses and authorship. This repo
is a new, separately authored set of instructions. It makes no claim of
endorsement or affiliation. If future contributions copy material from an
upstream project, they must preserve that project's license and attribution.

## Contributing

Before adding a skill, prove that an existing entry point or add-on cannot own
the intent. Prefer a mode, reference, or internal primitive. New public skills
must add a distinct user-visible capability, a clear output contract, and a
small check in `scripts/check.cjs` if the structure changes.

Run:

```bash
npm run check
```
