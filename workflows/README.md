# Cezar workflows

Install these YAML files in the consuming project's `.ai/cezar/workflows/`.
Install the public skills and run `setup` first. These files compose the current
skill contracts. They do not install skills or replace project setup.

## Choose the job

- [plan-a-project](plan-a-project.yaml): "Work out what to build and how."
  Research, design, and task breakdown. Stops before production code.
- [deliver-a-project](deliver-a-project.yaml): "Build the whole PRD."
  Includes planning, every implementation task, integrated checks, and PR readiness.
- [ship-a-change](ship-a-change.yaml): "Make this one change."
  One feature, bug fix, or refactor through implementation, checks, and review.

If you installed the previous names, remove their YAML files from the consuming
project after installing the replacements so Cezar does not list both versions:
`skills-discovery.yaml` became `plan-a-project.yaml`, `skills-product.yaml` became
`deliver-a-project.yaml`, and `skills-delivery.yaml` became `ship-a-change.yaml`.

## Product phases

| Phase | Skills | Output |
| --- | --- | --- |
| Intake | `intake` | Original PRD, requested outcome, classification, scope, and installed skill paths. |
| Research | `how`, `why`, `research` | Code map, historical constraints, cited outside facts, and open questions. |
| Design | `shape`, `deep-design`, `prototype`, `ux-proof` | Product brief, user journeys, UI states, architecture decisions, and experiment results. |
| Plan | `wayfinder`, `specify` | Requirement coverage, dependent tasks, next slice specs, acceptance checks, and a resume note. |
| Deliver each slice | `build`, `ui-dev`, `verify`, `ux-proof`, `review` | Working code, product proof, every review result, and updated task state. |
| Verify the product | `verify`, `ux-proof` | Integrated behavior, cross-task journeys, and evidence for the full PRD. |
| Review the whole change | `review`, `review-standard`, `review-gilfoyle`, `review-ponytail`, every other available reviewer | Joined findings against the original request and cumulative diff. |
| Finish | `finish`, `retro` | PR readiness or requested merge, remaining blockers, and useful lessons. |

Each phase resolves the questions relevant to this product. It does not force
outside research when no external facts matter, architecture work when the
existing boundary fits, or a prototype when the decision is already clear.
`ui-dev` invokes available UI design companions directly. `setup` stays separate.
All 20 public skills have a place across setup and these workflows.

## Large PRDs and continuation

The product plan covers the full requested scope. Each task has a stable ID,
requirement links, dependencies, acceptance checks, state, and evidence.
Only the next one or two slices need detailed implementation specs. Later
details can change as code teaches us more. Agreed requirements cannot disappear
just because the first slice is easier to finish.

The delivery phase repeats `build -> verify -> review` for each ready task.
It updates the plan and configured `paths.work/<slug>/resume.md` after each
slice. The default is one implementation PR with coherent commits in Cezar's
worktree. Request separate PRs when needed. Design-only PRs stay separate.
Integrated verification and cumulative review catch defects between slices.

To resume, continue the Cezar run or give a new `deliver-a-project` run the original
PRD, plan, specs, and resume note. The note records the branch, last verified
commit, current frontier, and next task. Reuse current evidence and refresh
stale decisions. A partial run must report unfinished tasks and its next action.
It must not call the whole PRD delivered because one task or PR is done.

## Cezar format and limits

Cezar loads `.yaml` and `.yml` files directly from `.ai/cezar/workflows/`.
Each file has a `name`, optional `description`, and either `skills` shorthand
or explicit `steps`. An agent step has an `id` and `skill` and/or `prompt`.
Optional fields include `runner`, `model`, `allowedTools`, and `bashAllowlist`.
`{{task}}` expands to the original request. Results and installed skill paths
travel through the `CEZ_HANDOFF_FILE` journal and project artifacts.

A check step uses `command`. Exit zero passes. `onFail: { retry: build, max: 2 }`
can retry from an earlier step after a nonzero exit. It does not interpret a
skill's `Status:` or `Next:` output. These workflows let `verify` use each
project's actual checks instead of hardcoding a test runner.

Cezar's chain is sequential. Conditional phases and the product task loop are
agent instructions inside those steps, not native YAML branches or a durable
task scheduler. A successful Cezar step is not proof of successful delivery.
Read the skill status and evidence. Context limits or required missing inputs
can require continuation. Read-only reviewers need independent agent execution.
Missing promised reviewer results remain visible and cannot count as approval.

Format checked against Cezar revision `e8c95f3` (package `0.10.1`):
[format](https://github.com/open-mercato/cezar#workflow-format),
[schema](https://github.com/open-mercato/cezar/blob/e8c95f3a6e665e64605239daf303ad218a6c51ce/packages/cezar/src/workflows/types.ts),
[loader](https://github.com/open-mercato/cezar/blob/e8c95f3a6e665e64605239daf303ad218a6c51ce/packages/cezar/src/workflows/load.ts).
