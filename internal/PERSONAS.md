# Project-local expert pods

The public collection owns reusable workflows. Project-specific expertise lives
in the project that needs it, so it can use private documentation and local
constraints without becoming another globally installed skill.

## Boundary

`setup` may render local profiles under the configured project directory
(default: `.agents/skills`). These files are contextual project artifacts, not
part of this repository's public skill roster. They must be created only from
confirmed project sources and user choices; never from guessed domain rules or
private values copied into a public file.

External companion skills are referenced by name. Their instructions are not
reproduced here:

- `gilfoyle` powers the runtime, reliability, security, observability, and
  operational-risk review lane.
- `ponytail` powers the over-engineering and minimality review lane.
- `design-taste-frontend` and `make-interfaces-feel-better` guide the UI
  implementation lane when they are installed.

## Profile map

| Local profile | Create when | Owns | Does not own |
| --- | --- | --- | --- |
| `persona-reviewer-gilfoyle` | Every repository with the companion skill, or when explicitly selected | Read-only operational and reliability evidence | Product, domain, or complexity verdicts; fixes |
| `persona-reviewer-ponytail` | Every repository with the companion skill, or when explicitly selected | Read-only deletion, YAGNI, and complexity findings | Correctness, security, accessibility, or domain verdicts; fixes |
| `persona-ui-dev` | The repository has a user interface or UI work is selected | UI implementation, states, accessibility, and UI evidence | API ownership, product decisions, or domain calculations |
| `persona-domain-expert` | The repository contains domain-specific behavior | Domain vocabulary, invariants, assumptions, and domain verdicts | Code changes, infrastructure, and generic correctness |

The domain profile is intentionally generic. During setup the project chooses a
role such as `nutritionist`, `tax-specialist`, or `clinical-reviewer`, supplies
authoritative source paths, and receives a local profile with that name. The
chosen role and its sources never become public assets in this repository.

## Routing

`review` keeps the panel bounded and independent:

1. Run the normal requested-behavior and repository-standards review.
2. Run Gilfoyle and Ponytail in separate lanes when configured.
3. Add the domain expert only when changed behavior uses domain semantics.
4. Use UI-specific review or evidence only for changed interface surfaces.
5. Keep every lens and disagreement visible; the operator composes the final
   verdict and routes fixes to `build` or `fix`.

Profiles are read-only reviewers unless their contract explicitly says they are
an implementation role. No profile merges, edits another profile, or silently
turns missing evidence into approval.

## Public workflow boundary

General architecture, implementation, QA, product, and UX work stays in the
public `shape`, `specify`, `build`, `verify`, and add-on workflows. A project
gets a local specialist only when its own sources or decision boundary justify
one.

## Local handoff

Every generated profile must declare:

- the scope and the conditions that activate it;
- the sources actually read and the freshness of those sources;
- the work it may and may not perform;
- a bounded output with `STATUS`, `EVIDENCE`, `CHANGES`, and `OPEN` fields;
- an explicit `NOT_RUN` or `BLOCKED` state when a required source, companion, or
  target is unavailable.
