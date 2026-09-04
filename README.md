# Skills

Small skills for one developer and an AI agent. They turn a request into code,
checks, review, and a PR.

## Working style

One owner. No committee.

The agent should finish the job. Normal work needs no permission: read, edit,
run commands, install what is needed, create branches, commit, push, and open
or update PRs when the task calls for it.

Make a reasonable assumption and keep moving. Ask only for a missing credential
or decision, a destructive or irreversible action, or a real scope change. A
missing optional tool is not a blocker.

No approval theatre, fake handoffs, role gates, review limits, or security by
obscurity. Keep real validation, security, accessibility, and data-loss
protection. Use plain words, short sentences, and concrete commands. No yap.
This voice applies to every skill, report, status, comment, and handoff.

## Install

```bash
npx skills add igloczek/skills --skill '*' --agent '*' --yes
```

Run `setup` once in the project. It finds the repo commands and writes or
repairs `.ai/skills.json`.

Use the upstream CLI for external skills:

```bash
npx skills find <query>
npx skills add <source> --skill <name> --agent <agent> --yes
npx skills use <source> --skill <name>
```

This repo does not keep another registry, lockfile, version pin, installer, or
updater for external skills.

## Setup

Run `setup` once in a project. It scans the repo, writes or repairs the local
config, and makes the next run easier.

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

## Flow

```text
intake -> specify -> build -> review -> verify -> finish
```

```mermaid
%%{init: {"theme":"base","themeVariables":{"fontFamily":"ui-sans-serif,system-ui,sans-serif","lineColor":"#94a3b8","primaryColor":"#eef2ff","primaryTextColor":"#172033","primaryBorderColor":"#6366f1","secondaryColor":"#ecfdf5","tertiaryColor":"#f8fafc"}}}%%
flowchart TD
    request["request"] --> intake["intake<br/>classify work"]

    intake -->|shape| shape["shape<br/>set scope"]
    shape -->|intake| intake
    shape -->|specify| specify["specify<br/>write checks + plan"]
    shape -->|build| build["build<br/>implement"]
    shape -->|none| done(["no code change"])

    intake -->|specify| specify
    intake -->|build| build
    intake -->|fix| fix["fix<br/>reproduce + repair"]
    intake -->|none| done

    specify -->|shape| shape
    specify -->|build| build
    specify -->|none| done

    build --> review["review<br/>required"]
    fix --> review

    subgraph review_stage["All reviewers · every change · same snapshot"]
        direction LR
        standard_review["review-standard<br/>behavior + rules"]
        review_gilfoyle["review-gilfoyle<br/>runtime + security"]
        review_ponytail["review-ponytail<br/>simplicity + scope"]
        review_result{"review result"}
    end

    review --> standard_review
    review --> review_gilfoyle
    review --> review_ponytail
    standard_review --> review_result
    review_gilfoyle --> review_result
    review_ponytail --> review_result

    review_result -->|approved| verify["verify<br/>required"]
    review_result -->|changes needed| rework["build / fix<br/>address findings"]
    rework --> review

    verify -. check failed .-> rework
    verify --> finish["finish<br/>PR + merge choice"]
    finish -. after delivery .-> retro["retro<br/>record what changed"]

    classDef core fill:#eef2ff,stroke:#6366f1,color:#1e1b4b,stroke-width:1.5px;
    classDef review fill:#ecfdf5,stroke:#059669,color:#064e3b,stroke-width:1.5px;
    classDef decision fill:#fff7ed,stroke:#f59e0b,color:#7c2d12,stroke-width:1.5px;
    classDef terminal fill:#f1f5f9,stroke:#475569,color:#0f172a,stroke-width:1.5px;
    class request,intake,shape,specify,build,fix,review,rework,verify core;
    class standard_review,review_gilfoyle,review_ponytail review;
    class review_result decision;
    class finish,retro terminal;
```

- Use `shape` before `specify` or `build` when the request is fuzzy.
- Use `fix` for a bug. It follows the `build` path and adds reproduction plus a
  regression check. It is not a second delivery system.
- Use add-ons only when they help: `how`, `why`, `research`, `prototype`,
  `deep-design`, `ux-proof`, `wayfinder`, or `ui-dev`.
- `setup` repairs its own config. There is no setup-verification skill.
- Merge only when the task calls for it.

## Skills

| Skill | Type | Does |
| --- | --- | --- |
| `setup` | Core | Find repo commands and repair project config. |
| `intake` | Core | Classify the request and choose the next step. |
| `shape` | Core | Make fuzzy work clear. |
| `specify` | Core | Write the contract and next small slice. |
| `build` | Core | Implement the change and run checks. |
| `fix` | Core | Reproduce and repair a bug on the normal build path. |
| `review` | Core | Run every reviewer and join the results. |
| `review-standard` | Core | Check behavior, compatibility, security, and tests. |
| `verify` | Core | Run the checks that matter and show evidence. |
| `finish` | Core | Take the PR to the requested end state. |
| `retro` | Core | Record useful lessons after delivery. |
| `review-gilfoyle` | Core | Check runtime, operations, and security. |
| `review-ponytail` | Core | Find code and dependencies to cut. |
| `how` | Add-on | Trace existing code and data flow. |
| `why` | Add-on | Recover intent from code, docs, and history. |
| `prototype` | Add-on | Answer one design question with throwaway code. |
| `research` | Add-on | Check outside facts with sources. |
| `deep-design` | Add-on | Check module boundaries before a risky change. |
| `ux-proof` | Add-on | Check a user flow in the real UI. |
| `wayfinder` | Add-on | Split genuinely multi-session work. |
| `ui-dev` | Add-on | Build UI changes with basic accessibility. |

## Review

Every change gets every available review skill. Always run:

- `review-standard`
- `review-gilfoyle`
- `review-ponytail`

Run project-local and external reviewers too. Give them the same request,
checkout, and diff. Do not choose lanes by risk, file type, or diff size. Do not
tell an external reviewer how to do its job. Normalize only the returned output
shape.

## Setup and project rules

Project-specific rules stay in the consuming project. `setup` can create local
domain experts from local docs. They are context for the work, not a reason to
stop unrelated work. Do not copy them into this repo.

## Checks

Before delivery:

```bash
git diff --check
bun run check
```

Use project-configured checks when they exist. Warnings are warnings. Missing
optional tooling is a note, not a fake blocker.

Steps leave only what the next step needs: changed files, commands, result,
status, and next action. No process diary.

## Sources

Ideas and useful patterns came from:

- [vercel-labs/skills](https://github.com/vercel-labs/skills)
- [Cursor's pstack skills](https://github.com/cursor/plugins/tree/main/pstack)
- [open-mercato/skills](https://github.com/open-mercato/skills)
- [mattpocock/skills](https://github.com/mattpocock/skills)
- [axiomhq/gilfoyle](https://github.com/axiomhq/gilfoyle)
- [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)
- [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)
- [jakubkrehel/make-interfaces-feel-better](https://github.com/jakubkrehel/make-interfaces-feel-better)
