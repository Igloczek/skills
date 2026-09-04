# Skills

Skills for taking a code change from request to working code.

## Purpose

I use this repo as a shared baseline workflow for a solo developer using AI
coding agents. Tools such as [Cezar](https://github.com/open-mercato/cezar) can
load these skills, put them into a predefined workflow, and run each step with
an agent.

The skills cover one code change from request to PR: understand the request,
set the scope, write a plan, change the code, review it, run checks, and finish
the PR. The runner handles execution; this repo holds the instructions for the
steps.

## Install in a project

Make the skills available to the agent runner in the project:

```bash
bunx skills add igloczek/skills --skill '*' --agent '*' --yes
```

Then run `setup` once in the project. It looks at the repo and records the
commands and tools the runner should use. New work starts with `intake`.

With Cezar, these Markdown files become workflow steps. A basic chain is:

```text
intake -> specify -> build -> review -> verify -> finish
```

When `intake` finds that the outcome or scope needs work, it routes to `shape`
before `specify` or `build`. For a bug, I use `fix` in place of `build`. I add
`how`, `why`, or `research` when a task needs more context.

## Skills

The Core skills are the path I use for most changes. Add-ons give a task more
context or design work when it needs them.

| Skill | Layer | Purpose |
| --- | --- | --- |
| `setup` | Core | Find the repo commands, docs, tools, and safe defaults. |
| `intake` | Core | Classify a brief or issue and choose the next step. |
| `shape` | Core | Make the scope, assumptions, and non-goals clear. |
| `specify` | Core | Write the acceptance checks and next small slice. |
| `build` | Core | Make the change and run feedback checks. |
| `fix` | Core | Reproduce a bug, fix it, and add a regression check. |
| `review` | Core | Look for broken behavior, security problems, compatibility issues, tests to add, and needless complexity. |
| `review-standard` | Core | Review requested behavior, repository rules, compatibility, and tests. |
| `verify` | Core | Run the checks that matter and show what passed. |
| `finish` | Core | Handle the PR, checks, QA, and merge decision. |
| `retro` | Core | Record what should change next time. |
| `how` | Add-on | Map existing code and data flow before changing it. |
| `why` | Add-on | Use the docs, code, and history to find the likely intent. |
| `prototype` | Add-on | Answer one design or interaction question with throwaway code. |
| `research` | Add-on | Research an uncertain question and cite the sources. |
| `verification-setup` | Add-on | Create a project-local way to launch, drive, observe, and clean up real behavior. |
| `deep-design` | Add-on | Check how the parts fit before a risky change. |
| `ux-proof` | Add-on | Check a user-facing change against the existing UI. |
| `wayfinder` | Add-on | Break big work into smaller pieces that can be resumed. |
| `review-gilfoyle` | Core | Look for problems in running code, logs, and security. |
| `review-ponytail` | Core | Find code and dependencies to remove. |
| `ui-dev` | Add-on | Build UI changes with basic accessibility and good interaction. |

## Setup (once per repository)

Run `setup` once in a repository. It finds the commands and tools already
there. It can create zero, one, or several local experts when the work needs
project-specific rules.

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

## Sample workflow

The solid path is the path I use for every code change. Dashed arrows are extra
steps I add when the task needs them.

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

    subgraph review_stage["Three reviewers · every change · same snapshot"]
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

The runner sends each box to an agent and passes the result to the next box.
`review` runs three separate, read-only reviewers after every `build` or `fix`:
`review-standard` checks behavior and project rules, `review-gilfoyle` checks
runtime and security, and `review-ponytail` checks simplicity and scope. All three
use the same pinned diff, project checkout, and instructions. They can run in
parallel and all three finish before the result goes to `verify`. Project
experts give `shape`, `specify`, `build`, and `review` the rules they need.

The other add-ons fit around the core path: `how` and `why` help before shaping,
`research` checks outside facts, `prototype` tries an idea, `wayfinder` splits
large work, `deep-design` checks how parts fit, `verification-setup` creates a
missing control surface, `ui-dev` handles UI changes, and `ux-proof` checks the
user flow.

## What I check

For each change, I do this:

- check the behavior that changed;
- for a UI or system change, check the UI or system too;
- add extra tests or analysis when the repo already has the tool or the change
  is risky.
- record the checks that ran and any checks left for later.

## Project-specific rules

For work with project-specific rules, `setup` can create one or more local
experts from the project docs and code. Each expert tells the other skills what
those rules are and says when the evidence is missing. Code changes stay in
`build` and `fix`, and general code review stays in `review`.

Example: an invoicing project might use `docs/invoice-rules.md`,
`src/domain/invoices/`, and `docs/tax-provider.md` to answer whether a paid
invoice can be voided, needs a credit note, or needs specific fields.

## What each step records

Each skill that changes files records:

- what it reads and writes, what it can change, and how it ends;
- a request for confirmation before destructive or irreversible actions;
- prompts, files, comments, and reports stay free of secrets;
- `Status:`, `Next:`, `Spec:`, `Issue:`, and `PR:` when another skill needs the result;
- a clear stop when a required tool, command, or file is missing.

Merging stays under the user's control. UI work gets UI checks; other changes
use the checks for their code and systems.

Quality numbers are signals for changed code. The existing repo tools provide
them, and review reports a warning or a missing check separately from a failed
check. In TypeScript, new `any` needs a reason. `unknown` is used at an input
boundary and narrowed before the domain code uses it.

## Sources

The core workflow started with ideas from:

- [Cursor's pstack skills](https://github.com/cursor/plugins/tree/main/pstack)
- [open-mercato/skills](https://github.com/open-mercato/skills)
- [mattpocock/skills](https://github.com/mattpocock/skills)
- [axiomhq/gilfoyle](https://github.com/axiomhq/gilfoyle)
- [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)
- [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)
- [jakubkrehel/make-interfaces-feel-better](https://github.com/jakubkrehel/make-interfaces-feel-better)
