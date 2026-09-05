# Skills

A lightweight SDLC for solo developers and AI coding agents. It keeps the useful
engineering steps and drops the corporate process bullshit.

This is a system, not a bag of interesting tasks. A request enters the flow,
each step leaves something useful for the next one, and the flow ends with a
working, checked, reviewable PR.

## Why this exists

Many skill collections are prompt drawers. Pick a skill, run it, and work out
the rest yourself. The useful parts are there, but the handoff between them is
usually left to luck.

This repo gives the work a simple shape:

- small skills with clear jobs
- stable output for the next step
- one normal path from request to PR
- add-ons only when the work needs them
- project-specific rules kept in the project, not baked into the collection

## What is different

### Workflow first

The core is a delivery path, not a list of unrelated tricks:

```text
intake -> specify -> build -> verify -> review -> finish
```

The agent can take a request through the path and leave a working, checked,
reviewable change. `verify` comes right after code. It checks that the product
works, looks, and behaves as intended. `review` comes after that and checks the
implementation. A code review can send changed code back through `build`, but
the changed behavior must pass `verify` again.

### External skills stay upstream

This repo does not copy what the upstream [`npx skills`](https://github.com/vercel-labs/skills)
tool already does. Discover, install, and use external skills with that CLI.
There is no local registry, pin file, updater, or lifecycle wrapper here.

### Reviews are additive

Every change gets every available review skill. The baseline is:

- `review-standard` for normal correctness;
- `review-gilfoyle` for runtime, operations, and security;
- `review-ponytail` for code and dependency bloat.

They see the same request and diff. The joiner keeps all findings and only
normalizes their output shape. It does not pick one reviewer and pretend that
is enough. Review is a code-quality pass after product verification. It can
find real implementation defects, but it does not decide what the product
should do.

### One code path

`build` handles features, fixes, maintenance, refactors, and other code
changes. For a reported bug, it reproduces the current behavior, fixes the root
cause, and adds a regression check. Then it follows the same verify, review, and
finish path. There is no separate fix skill or bug-only process.

### Setup repairs itself

`setup` inspects the project, writes or repairs `.ai/skills.json`, and reruns
its check. There is no separate setup-verification skill.

## Install

Add the public skills to a project:

```bash
npx skills add igloczek/skills --skill '*' --agent '*' --yes
```

Then run `setup` once in that project. With
[Cezar](https://github.com/open-mercato/cezar), use the workflows below as the
default setup for this collection.

### Default setup with Cezar

Run this from the project root after installing the skills and running `setup`:

```bash
mkdir -p .ai/cezar/workflows
for workflow in plan-a-project ship-a-change deliver-a-project; do
  curl -fL "https://raw.githubusercontent.com/Igloczek/skills/main/workflows/$workflow.yaml" \
    -o ".ai/cezar/workflows/$workflow.yaml" || break
done
npx cezar-cli
```

Choose the workflow in Cezar, select the runner and model, and enter the request
or the path to your PRD. The skills installer does not install these YAML files.
You can also copy them from this repository's `workflows/` folder.

| Workflow | Choose it when | Result |
| --- | --- | --- |
| [plan-a-project](workflows/plan-a-project.yaml) | "Research and design this project. Give me a task plan before we code." | Research, design decisions, specs, and dependent tasks. Stops before production code. |
| [deliver-a-project](workflows/deliver-a-project.yaml) | "Here is the PRD. Build the whole thing." | Planning plus every implementation task, integrated verification, review, and PR readiness. |
| [ship-a-change](workflows/ship-a-change.yaml) | "Implement this one feature, fix, or refactor." | One scoped change, verified and reviewed, ready as a PR. |

For "here is a big PRD, deliver it", choose **deliver-a-project**. It tracks each
requirement through dependent tasks and evidence. It details the next ready
slices, implements and checks each one, then checks the integrated product.
Finishing one task does not count as finishing the PRD. Use **plan-a-project**
when you want the design and task plan first, then pass those artifacts to
**deliver-a-project** to continue.

The workflows inherit your runner and model. Keep the skills installed in the
project so Cezar finds this collection before same-named vendor skills. Review
runs every available reviewer. Merging happens only when your request calls for
it. See the [workflow guide](workflows/README.md) for phases, skill coverage,
resuming large work, and Cezar's execution limits.

For external skills, use the upstream CLI directly:

```bash
npx skills find <query>
npx skills add <source> --skill <name> --agent <agent> --yes
npx skills use <source> --skill <name>
```

## Setup

Setup is deliberately boring: inspect the repo, record useful commands and
paths, and add a local domain expert only when the project needs one.

```mermaid
%%{init: {"theme":"base","themeVariables":{"fontFamily":"ui-sans-serif,system-ui,sans-serif","lineColor":"#94a3b8","primaryColor":"#eef2ff","primaryTextColor":"#172033","primaryBorderColor":"#6366f1","secondaryColor":"#ecfdf5","tertiaryColor":"#fff7ed"}}}%%
flowchart LR
    setup["setup<br/>once per repository"] --> inspect["inspect<br/>commands + docs"]
    inspect --> configure["configure<br/>useful defaults"]
    configure --> domain{"project rules useful?"}
    domain -->|yes| domain_experts["project experts<br/>local only"]
    domain -->|no| ready(["repository ready"])
    domain_experts --> ready

    classDef core fill:#eef2ff,stroke:#6366f1,color:#1e1b4b,stroke-width:1.5px;
    classDef decision fill:#fff7ed,stroke:#f59e0b,color:#7c2d12,stroke-width:1.5px;
    classDef local fill:#fff7ed,stroke:#f59e0b,color:#7c2d12,stroke-width:1.5px,stroke-dasharray:5 5;
    classDef terminal fill:#f1f5f9,stroke:#475569,color:#0f172a,stroke-width:1.5px;
    class setup,inspect,configure core;
    class domain decision;
    class domain_experts local;
    class ready terminal;
```

## Workflow

Start with `intake`. From there, use the smallest path that fits the request.
`shape` and the add-ons are optional. `verify` and `review` are part of the
normal delivery path, in that order.

Each box is a skill. Arrow labels explain when to take that path. The `review`
group runs all available reviewers and combines their findings into one result.

```mermaid
%%{init: {"theme":"base","themeVariables":{"fontFamily":"ui-sans-serif,system-ui,sans-serif","lineColor":"#94a3b8","primaryColor":"#eef2ff","primaryTextColor":"#172033","primaryBorderColor":"#6366f1","secondaryColor":"#ecfdf5","tertiaryColor":"#f8fafc"}}}%%
flowchart TD
    intake["intake<br/>understand the request"]
    shape["shape<br/>clarify the scope"]
    specify["specify<br/>define behavior + checks"]
    build["build<br/>implement or repair"]
    verify["verify<br/>check the working product"]
    finish["finish<br/>deliver the PR"]
    retro["retro<br/>capture useful lessons"]

    subgraph review["review · run all reviewers and combine findings"]
        direction LR
        standard_review["review-standard<br/>behavior + rules"]
        review_gilfoyle["review-gilfoyle<br/>runtime + security"]
        review_ponytail["review-ponytail<br/>simplicity + dependencies"]
    end

    intake -->|scope unclear| shape
    intake -->|needs a contract| specify
    intake -->|ready to implement| build
    shape -->|needs a contract| specify
    shape -->|ready to implement| build
    specify -->|scope needs rethinking| shape
    specify -->|contract ready| build

    build -->|implementation ready| verify
    verify -->|wrong or broken| build
    verify -->|checks pass| review
    review -->|changes needed| build
    review -->|approved| finish
    finish -. after delivery .-> retro

    classDef core fill:#eef2ff,stroke:#6366f1,color:#1e1b4b,stroke-width:1.5px;
    classDef review fill:#ecfdf5,stroke:#059669,color:#064e3b,stroke-width:1.5px;
    classDef terminal fill:#f1f5f9,stroke:#475569,color:#0f172a,stroke-width:1.5px;
    class intake,shape,specify,build,verify core;
    class standard_review,review_gilfoyle,review_ponytail review;
    class finish,retro terminal;
```

## Concepts

The roster is not a menu. Start at `intake`. Add-ons plug into the flow only
when they solve a real need.

### Core skills

These make up the normal path. They are useful on most changes.

### Add-ons

These answer a specific need: understand old code, check outside facts, try a
UI idea, split long work, or inspect a design seam. Do not run them just because
they exist.

### Contracts

Every public skill has a name, a short description, a workflow, and an output
shape. That is enough for a runner to pass one step to the next without making
each agent rediscover the whole process.

Every public skill has a `version` in its frontmatter, initially `0.1.0`.
Use `MAJOR.MINOR.PATCH`: bump the changed skill's patch for corrections, minor
for backward-compatible additions, and major for breaking contract changes.
Changes to bundled references or scripts also count as changes to their skill.
Versions are independent of the repository package version.

### Evidence retention

Evidence belongs in runner artifact storage or temporary storage by default,
with commands and results in the handoff. Before keeping an artifact in a PR,
ask: **Would a developer six months from now need this to understand a decision,
operate the tool, or reproduce a meaningful check?** Keep the smallest useful
form when warranted or explicitly required. Exclude raw logs, test output,
and scratch reports by default. `verify` defines retention, `build` applies
it before committing, and `finish` checks the final diff.

### Project-local context

The collection stays generic. Repo-specific commands, paths, provider details,
and domain rules live in the consuming project. `setup` can create local domain
experts from that project's own docs.

## Skill roster

### Core

| Skill             | Does                                                 |
| ----------------- | ---------------------------------------------------- |
| `build`           | Implement or repair code and run checks.             |
| `finish`          | Take the PR to the requested end state.              |
| `intake`          | Classify the request and choose the next step.       |
| `retro`           | Record useful lessons after delivery.                |
| `review-gilfoyle` | Check runtime, operations, and security.             |
| `review-ponytail` | Find code and dependencies to cut.                   |
| `review-standard` | Check behavior, compatibility, security, and tests.  |
| `review`          | Run every reviewer after product verification.       |
| `setup`           | Find repo commands and repair project config.        |
| `shape`           | Make fuzzy work clear.                               |
| `specify`         | Write the contract and next small slice.             |
| `verify`          | Prove the product works before code review.          |

### Add-ons

| Skill         | Does                                            |
| ------------- | ----------------------------------------------- |
| `deep-design` | Check module boundaries before a risky change.  |
| `how`         | Trace existing code and data flow.              |
| `prototype`   | Answer one design question with throwaway code. |
| `research`    | Check outside facts with sources.               |
| `ui-dev`      | Build UI changes with basic accessibility.      |
| `ux-proof`    | Check a user flow in the real UI.               |
| `wayfinder`   | Split genuinely multi-session work.             |
| `why`         | Recover intent from code, docs, and history.    |

## Sources

Ideas and useful patterns came from:

- [Cursor's pstack skills](https://github.com/cursor/plugins/tree/main/pstack)
- [open-mercato/skills](https://github.com/open-mercato/skills)
- [mattpocock/skills](https://github.com/mattpocock/skills)
- [axiomhq/gilfoyle](https://github.com/axiomhq/gilfoyle)
- [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)
- [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)
- [jakubkrehel/make-interfaces-feel-better](https://github.com/jakubkrehel/make-interfaces-feel-better)
