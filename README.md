# Skills

Skills for taking a code change from request to working code.

## Purpose

This repo contains skills for a solo developer using an AI coding agent. They
cover the basic work: understand the request, keep the change small, write the
code, review it, run the right checks, and finish the PR.

This is not a company process, compliance tool, test runner, or replacement for
the tools already in a project. Do not use every skill on every task. Use the
shortest path that is safe for the change. Add more checks when the change is
risky or unclear. See [AGENTS.md](AGENTS.md) when changing this repo.

## Install in a project

Install the skills in the current project:

```bash
npx skills add igloczek/skills --skill '*' --agent '*' --yes
```

Then run `setup` once in the project. It looks at the repo and records the
commands and tools the agent should use. New work starts with `intake`.

## Skills

The core path turns a request into a small change, makes it, checks it, and
finishes it. Use the add-ons when the code, intent, UI, or task is harder to
understand.

| Skill | Layer | Purpose |
| --- | --- | --- |
| `setup` | Core | Find the repo commands, docs, tools, and safe defaults. |
| `intake` | Core | Turn a brief or issue into one piece of work. |
| `shape` | Core | Make the scope, assumptions, and non-goals clear. |
| `specify` | Core | Write the acceptance checks and next small slice. |
| `build` | Core | Make the change and run feedback checks. |
| `fix` | Core | Reproduce a bug, fix it, and add a regression check. |
| `review` | Core | Look for broken behavior, security problems, compatibility issues, missing tests, and needless complexity. |
| `verify` | Core | Run the checks that matter and show what passed. |
| `finish` | Core | Handle the PR, checks, QA, and merge decision. |
| `retro` | Core | Record what should change next time. |
| `how` | Add-on | Map existing code and data flow before changing it. |
| `why` | Add-on | Use the docs, code, and history to find the likely intent. |
| `prototype` | Add-on | Answer one design or interaction question with throwaway code. |
| `research` | Add-on | Research an uncertain question and cite the sources. |
| `deep-design` | Add-on | Check how the parts fit before a risky change. |
| `ux-proof` | Add-on | Check a user-facing change against the existing UI. |
| `wayfinder` | Add-on | Break big work into smaller pieces that can be resumed. |
| `review-gilfoyle` | Core | Look for problems in running code, logs, and security. |
| `review-ponytail` | Core | Look for code and dependencies we do not need. |
| `ui-dev` | Add-on | Build UI changes with basic accessibility and good interaction. |

## Setup (once per repository)

Run `setup` once in a repository. It finds the commands and tools already
there. It creates one local expert only when the work needs project-specific
rules.

```mermaid
%%{init: {"theme":"base","themeVariables":{"fontFamily":"ui-sans-serif,system-ui,sans-serif","lineColor":"#94a3b8","primaryColor":"#eef2ff","primaryTextColor":"#172033","primaryBorderColor":"#6366f1","secondaryColor":"#ecfdf5","tertiaryColor":"#fff7ed"}}}%%
flowchart LR
    setup["setup<br/>once per repository"] --> inspect["inspect<br/>commands + docs"]
    inspect --> configure["configure<br/>useful defaults"]
    configure --> domain{"domain-specific?"}
    domain -->|yes| domain_expert["project expert<br/>local only"]
    domain -->|no| ready(["repository ready"])
    domain_expert --> ready

    classDef core fill:#eef2ff,stroke:#6366f1,color:#1e1b4b,stroke-width:1.5px;
    classDef decision fill:#fff7ed,stroke:#f59e0b,color:#7c2d12,stroke-width:1.5px;
    classDef local fill:#fff7ed,stroke:#f59e0b,color:#7c2d12,stroke-width:1.5px,stroke-dasharray:5 5;
    classDef terminal fill:#f1f5f9,stroke:#475569,color:#0f172a,stroke-width:1.5px;
    class setup,inspect,configure core;
    class domain decision;
    class domain_expert local;
    class ready terminal;
```

## Sample workflow

Use the solid arrows by default. Use dashed arrows only when the task needs
them.

```mermaid
%%{init: {"theme":"base","themeVariables":{"fontFamily":"ui-sans-serif,system-ui,sans-serif","lineColor":"#94a3b8","primaryColor":"#eef2ff","primaryTextColor":"#172033","primaryBorderColor":"#6366f1","secondaryColor":"#ecfdf5","tertiaryColor":"#f8fafc"}}}%%
flowchart TD
    intake["intake<br/>start here"] --> shape["shape<br/>set scope"]
    shape --> specify["specify<br/>write checks + plan"]
    specify --> kind{"new work or defect?"}
    kind -->|feature/change| build["build<br/>implement"]
    kind -->|confirmed bug| fix["fix<br/>reproduce + repair"]
    build --> review["review<br/>check the diff"]
    fix --> review

    subgraph review_threads["Review tasks"]
        direction LR
        standard_review["standard review<br/>behavior + rules"]
        review_gilfoyle["review-gilfoyle<br/>when runtime risk applies"]
    review_ponytail["review-ponytail<br/>when code is too big"]
        review_join(("join findings"))
    end
    review --> standard_review
    review -. if needed .-> review_gilfoyle
    review -. if needed .-> review_ponytail
    standard_review --> review_join
    review_gilfoyle --> review_join
    review_ponytail --> review_join
    review_join --> verify["verify<br/>tests + proof"]
    review_join -. changes requested .-> fix
    verify -. failed .-> fix
    verify --> finish["finish<br/>PR + merge choice"]
    finish --> retro["retro<br/>note what to change"]

    subgraph optional["Extra skills · only if needed"]
        direction LR
        how["how"]
        why["why"]
        research["research"]
        prototype["prototype"]
        wayfinder["wayfinder"]
        deep_design["deep-design"]
        ui_dev["ui-dev"]
        ux_proof["ux-proof"]
    end
    intake -. existing behavior unclear .-> how
    how -. code map .-> shape
    shape -. intent unclear .-> why
    why -. historical constraints .-> specify
    intake -. uncertain external facts .-> research
    research -. cited findings .-> shape
    shape -. feasibility question .-> prototype
    prototype -. decision .-> specify
    shape -. large or parallel work .-> wayfinder
    wayfinder -. decision map .-> specify
    specify -. architecture risk .-> deep_design
    deep_design -. design result .-> specify
    build -. UI surface .-> ui_dev
    ui_dev --> review
    verify -. user-facing UI .-> ux_proof
    ux_proof --> finish

    classDef core fill:#eef2ff,stroke:#6366f1,color:#1e1b4b,stroke-width:1.5px;
    classDef review fill:#ecfdf5,stroke:#059669,color:#064e3b,stroke-width:1.5px;
    classDef optional fill:#f8fafc,stroke:#94a3b8,color:#334155,stroke-width:1px,stroke-dasharray:5 5;
    classDef decision fill:#fff7ed,stroke:#f59e0b,color:#7c2d12,stroke-width:1.5px;
    classDef join fill:#e0f2fe,stroke:#0284c7,color:#0c4a6e,stroke-width:1.5px;
    classDef terminal fill:#f1f5f9,stroke:#475569,color:#0f172a,stroke-width:1.5px;
    class intake,shape,specify,build,fix,review,verify core;
    class standard_review,review_gilfoyle,review_ponytail review;
    class review_join join;
    class kind decision;
    class finish,retro terminal;
    class how,why,research,prototype,wayfinder,deep_design,ui_dev,ux_proof optional;
```

`review` always runs the standard review. It adds the runtime and simplicity
reviews only when they can find something useful. The findings are combined
before `verify`. If review finds a problem, go back to `build` or `fix`. The
project expert is used by `shape`, `specify`, `build`, and `review` when its
rules matter.

## Default rules

Keep the default path small:

- Check the behavior that changed.
- For a UI or system change, check the UI or system too.
- Add extra tests or analysis when the repo already has the tool or the change
  is risky.
- Say when a check was skipped or could not run. Do not add a large process just
  to tick a box.

## Project-specific rules

For work with project-specific rules, `setup` can create one local expert from
the project docs and code. It tells the other skills what those rules are and
says when the evidence is missing. It does not write code or review general
code quality.

Example: an invoicing project might use `docs/invoice-rules.md`,
`src/domain/invoices/`, and `docs/tax-provider.md` to answer whether a paid
invoice can be voided, needs a credit note, or needs specific fields.

## Contracts

Every skill that changes files must:

- say what it reads and writes, what it can change, and how it ends;
- not erase or overwrite work without asking;
- keep secrets out of prompts, files, comments, and reports;
- use `Status:`, `Next:`, `Spec:`, `Issue:`, and `PR:` when another skill needs the result;
- stop if a required tool, command, or file is missing.

`finish` never merges unless the user explicitly allows it. UI checks are
optional for non-UI work.

Quality numbers are hints for changed code, not a cleanup project. Use tools
already in the repo. Report a warning or a missing check instead of making it a
failure by default. In TypeScript, do not add new `any` without a reason.
`unknown` is fine at an input boundary if the code checks it before using it.

## Sources

Inspired by and reusing work from:

- [open-mercato/skills](https://github.com/open-mercato/skills)
- [mattpocock/skills](https://github.com/mattpocock/skills)
- [axiomhq/gilfoyle](https://github.com/axiomhq/gilfoyle)
- [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)
- [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)
- [jakubkrehel/make-interfaces-feel-better](https://github.com/jakubkrehel/make-interfaces-feel-better)
