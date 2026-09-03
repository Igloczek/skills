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

Owner: `shape`, `specify`, and `build`. Keep briefs, specs, plans, terminal
states, and handoff markers stable enough for the next workflow to consume.

## change-executor

Owner: `build` and `fix`. Work in an isolated branch/worktree, take small
feedback-driven steps, run the configured validation, and leave a reviewable
branch or PR.

## tracker-lifecycle

Owner: all workflows that mutate a tracker. Centralize provider operations,
claim locks, labels, idempotent comments, and lock cleanup.

## review-engine

Owner: `review` and `finish`. Review standards, requested behavior, security,
compatibility, tests, and architecture; route the public operational and
minimality add-ons and the local domain expert only when relevant; return a
bounded, severity-ranked report.

## evidence-engine

Owner: `verify`. Combine repo-native tests with UI/browser evidence when the
change is user-facing. Keep credentials indirect and clean up test processes.

## pr-state-dispatcher

Owner: `finish`. Read the current PR state, choose the next allowed gate,
re-check after each mutation, and never turn a readiness report into an
implicit merge.
