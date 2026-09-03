# Internal primitives

These are shared contracts, not installable skills. A public workflow owns the
primitive; the primitive must not become another user-facing command.

## context-and-safety

Owner: `setup` and every workflow. Load project instructions and local config,
discover and scope the one project-local domain expert, mark untrusted content,
redact secrets, and refuse unsafe or ambiguous mutations.

## decision-gate

Owner: `shape` and `specify`. Decide whether to build, ask, assume with a
record, or stop. A missing answer must never be silently invented when it
changes the contract.

## work-item-normalizer

Owner: `intake` and `fix`. Turn a brief or issue into a deduplicated,
classified, agent-ready work item without rewriting the original request.

## artifact-contract

Owner: `shape`, `specify`, and `build`. Keep briefs, specs, short-horizon
plans, terminal states, and compact handoff markers stable enough for the next
workflow to consume.

## change-executor

Owner: `build` and `fix`. Work in an isolated branch/worktree, take small
feedback-driven steps, reset an unproductive context trajectory with a compact
handoff, run the configured validation, and leave a reviewable branch or PR.

## tracker-lifecycle

Owner: all workflows that mutate a tracker. Centralize provider operations,
claim locks, labels, idempotent comments, and lock cleanup.

## review-engine

Owner: `review` and `finish`. Review standards, requested behavior, security,
compatibility, tests, and architecture; route the public operational and
minimality lanes and the local domain expert only when relevant. Run selected
review lanes on separate threads, join their terminal results, and return a
bounded, severity-ranked report with lane ownership preserved.

## evidence-engine

Owner: `verify`. Combine repo-native tests with proportionate configured quality
gates and UI/browser evidence when the change is user-facing. Keep credentials
indirect and clean up test processes.

## quality-signals

Owner: `review` and `verify`. Measure the changed, non-generated code first and
use project-configured tools only. Treat thresholds as warning triggers, not a
global cleanup mandate. Report `PASS`, `WARN`, `BLOCKED`, or `NOT_RUN` with the
tool or reason and its evidence.

- Cyclomatic or cognitive complexity `>=22`: warn and consider a smaller seam.
- A changed file at `>=500` lines: warn when a clear responsibility boundary
  exists, not because a number alone demands a split.
- CRAP `>=25`: use for high-risk changed functions when the project already
  has the metric.
- Mutation testing: require zero surviving mutants only for selected critical
  or bug-fix logic when a configured runner exists.
- Dead or redundant code: remove only when tool-proven or obvious in the
  changed area; do not promise global zero.
- TypeScript: no new unapproved `any` in production code. `unknown` is valid
  at trust boundaries but must be narrowed before domain logic.
- Halstead is advisory only when already configured; never install it for this
  workflow.

A warning is not a blocker unless project policy or change risk makes it one.
Legacy findings may remain, but new changed-code violations should be explicit.

## pr-state-dispatcher

Owner: `finish`. Read the current PR state, choose the next allowed gate,
re-check after each mutation, and never turn a readiness report into an
implicit merge.
