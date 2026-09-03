# Skills

Small, intent-based agent workflows for a normal software delivery lifecycle.

## Install in a project

Install the collection into the current project's skill directories for all
supported agents:

```bash
npx skills add igloczek/skills --skill '*' --agent '*' --yes
```

Then invoke `setup` in a project. Its bundled initializer checks the project
shape, creates `.ai` when needed, and installs the upstream companion skills
listed below into the project's skill directories. Projects may still use a
local `.ai/skills.json` for their own commands, tracker, or browser provider.

## Runtime companions

These are installed dependencies, not just references. The initializer checks
the project's agent skill directories before installing and keeps the upstream
skill folders intact, including their supporting files.

| Companion | Used by | Source |
| --- | --- | --- |
| `gilfoyle` | `review-gilfoyle` | [axiomhq/gilfoyle](https://github.com/axiomhq/gilfoyle) |
| `ponytail` | `review-ponytail` | [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) |
| `design-taste-frontend` | `ui-dev` | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `make-interfaces-feel-better` | `ui-dev` | [jakubkrehel/make-interfaces-feel-better](https://github.com/jakubkrehel/make-interfaces-feel-better) |

The manifest is [`skills/setup/references/external-skills.json`](skills/setup/references/external-skills.json),
and the deterministic initializer is [`skills/setup/scripts/init.cjs`](skills/setup/scripts/init.cjs).
Update installed companions with `npx skills update --project --yes`.

## Shape

The current collection contains:

| Layer | Entry points | Purpose |
| --- | ---: | --- |
| Core | 12 | The default SDLC menu: `setup`, `shape`, `intake`, `specify`, `build`, `fix`, `review`, `review-gilfoyle`, `review-ponytail`, `verify`, `finish`, `retro`. |
| Add-ons | 6 | `prototype`, `research`, `deep-design`, `ux-proof`, `wayfinder`, `ui-dev`; load only when the task needs them. |
| Internal | 9 | Shared primitives in [`internal/PRIMITIVES.md`](internal/PRIMITIVES.md); the local domain-expert contract in [`internal/DOMAIN-EXPERT.md`](internal/DOMAIN-EXPERT.md), intentionally not an installable skill. |

Modes such as autonomous, loop, resume, batch, dry-run, and tracker-less are
parameters of a workflow. They are not separate skills.

## Skill catalog

| Skill | Layer | Purpose |
| --- | --- | --- |
| `setup` | Core | Discover repository commands, documents, providers, and safe defaults. |
| `intake` | Core | Normalize a brief or issue into one actionable work item. |
| `shape` | Core | Turn a vague request into a small brief with assumptions and non-goals. |
| `specify` | Core | Produce an implementation-ready specification and dependency-aware plan. |
| `build` | Core | Implement a brief or specification with feedback and validation. |
| `fix` | Core | Reproduce, diagnose, and repair a confirmed defect with a regression check. |
| `review` | Core | Review behavior, standards, security, compatibility, tests, and complexity. |
| `verify` | Core | Verify changes with repository checks and UI evidence when needed. |
| `finish` | Core | Drive a PR through review, CI, QA, and merge gates. |
| `retro` | Core | Capture evidence-backed process improvements after delivery. |
| `prototype` | Add-on | Answer a concrete design or interaction question with disposable code. |
| `research` | Add-on | Investigate uncertain questions with cited, high-trust sources. |
| `deep-design` | Add-on | Examine boundaries, domain language, and architecture under change risk. |
| `ux-proof` | Add-on | Shape and verify user-facing changes against the local design language. |
| `wayfinder` | Add-on | Split large work into a decision map with resumable handoffs. |
| `review-gilfoyle` | Core | Review runtime reliability, observability, security, and operational risk. |
| `review-ponytail` | Core | Review over-engineering, YAGNI, and avoidable change surface. |
| `ui-dev` | Add-on | Implement interface changes with accessible states and polished interaction. |

## Setup (once per repository)

Run `setup` once for a repository. It discovers the local delivery surface and
creates one project-local domain expert only when domain-specific behavior needs
one. Every work item starts at `intake` after this graph reaches `ready`.

```mermaid
%%{init: {"theme":"base","themeVariables":{"fontFamily":"ui-sans-serif,system-ui,sans-serif","lineColor":"#94a3b8","primaryColor":"#eef2ff","primaryTextColor":"#172033","primaryBorderColor":"#6366f1","secondaryColor":"#ecfdf5","tertiaryColor":"#fff7ed"}}}%%
flowchart LR
    setup["setup<br/>once per repository"] --> inspect["inspect<br/>commands + providers"]
    inspect --> configure["configure<br/>safe defaults"]
    configure --> domain{"domain-specific?"}
    domain -->|yes| domain_expert["domain-expert<br/>project-local only"]
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

Solid arrows are the default path. Dashed arrows are optional routing based on
the work being done.

```mermaid
%%{init: {"theme":"base","themeVariables":{"fontFamily":"ui-sans-serif,system-ui,sans-serif","lineColor":"#94a3b8","primaryColor":"#eef2ff","primaryTextColor":"#172033","primaryBorderColor":"#6366f1","secondaryColor":"#ecfdf5","tertiaryColor":"#f8fafc"}}}%%
flowchart TD
    intake["intake<br/>normalize work"] --> shape["shape<br/>define scope"]
    shape --> specify["specify<br/>acceptance + plan"]
    specify --> kind{"new work or defect?"}
    kind -->|feature/change| build["build<br/>implement"]
    kind -->|confirmed bug| fix["fix<br/>reproduce + repair"]
    build --> review["review<br/>fan-out gate"]
    fix --> review

    subgraph review_threads["Review threads · parallel, separate tasks"]
        direction LR
        standard_review["standard review<br/>behavior + standards"]
        review_gilfoyle["review-gilfoyle<br/>operations + reliability"]
        review_ponytail["review-ponytail<br/>complexity + minimality"]
        review_join(("join findings"))
    end
    review --> standard_review
    review --> review_gilfoyle
    review --> review_ponytail
    standard_review --> review_join
    review_gilfoyle --> review_join
    review_ponytail --> review_join
    review_join --> verify["verify<br/>tests + evidence"]
    review_join -. changes requested .-> fix
    verify -. failed .-> fix
    verify --> finish["finish<br/>PR gates + merge decision"]
    finish --> retro["retro<br/>capture improvements"]

    subgraph optional["Optional add-ons · use only when needed"]
        direction LR
        research["research"]
        prototype["prototype"]
        wayfinder["wayfinder"]
        deep_design["deep-design"]
        ui_dev["ui-dev"]
        ux_proof["ux-proof"]
    end
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
    class research,prototype,wayfinder,deep_design,ui_dev,ux_proof optional;
```

`review` launches the three review threads in parallel. Each thread is
read-only and returns its own findings; the join happens before `verify`.
Changes requested by any lane return to implementation instead of being hidden
inside one combined review. The local domain expert from the setup graph is
consulted by `shape`, `specify`, `build`, and `review` when relevant.

## Project-local domain expert

`setup` creates exactly one project-local domain expert from confirmed sources
when domain-specific behavior cannot be safely inferred from general
engineering knowledge. It is not shipped or installable from this repository.

For example, in an invoicing application, `setup` might create a local
`domain-expert-billing-specialist` grounded in `docs/invoice-rules.md`,
`src/domain/invoices/`, and `docs/tax-provider.md`. If a change adds a “void
invoice” action, the expert checks which invoice states allow it, whether a paid
invoice needs a credit note instead, and which audit fields are mandatory. It
returns a sourced domain verdict; it does not write code, choose the component
structure, or review general code complexity.

Its contract is in [`internal/DOMAIN-EXPERT.md`](internal/DOMAIN-EXPERT.md), with
the setup template in
[`skills/setup/references/domain-expert.md`](skills/setup/references/domain-expert.md).

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
