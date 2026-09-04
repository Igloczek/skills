# Internal primitives

These are shared contracts, not installable skills. A public workflow owns the
primitive; the primitive must not become another user-facing command.

## context

Owner: `setup` and every workflow. Load project instructions and local config,
find useful project-local domain experts, and keep real input, security, and
data-loss checks. Do not turn normal work into an approval exercise.

## decision

Owner: `shape` and `specify`. Pick the smallest useful path. Assume and record
when the assumption is reversible. Ask only when the answer changes the
contract or the next action is destructive; otherwise keep moving.

## work-item-normalizer

Owner: `intake` and `fix`. Turn a brief or issue into a deduplicated,
classified, agent-ready work item without rewriting the original request.

## artifact-contract

Owner: `shape`, `specify`, and `build`. Keep briefs, specs, short-horizon
plans, terminal states, and compact handoff markers stable enough for the next
workflow to consume.

## change-executor

Owner: `build` and `fix`. Work in an isolated branch/worktree, take small
feedback-driven steps, run the configured validation, and leave a reviewable
branch or PR. `fix` uses the same executor and adds a reproduction and
regression check; it has no separate failure ceremony.

## tracker-lifecycle

Owner: workflows that mutate a tracker. Use the configured provider, avoid
duplicate comments or items, and do the requested mutation. Do not add team
lock ceremony to a solo workflow.

## review-engine

Owner: `review` and `finish`. Run every available review skill, including
`review-standard`, `review-gilfoyle`, and `review-ponytail`; invoke additional
project-local or external reviewers through the normal runner or `npx skills`.
Do not narrow a reviewer's scope or omit a lane based on a heuristic. Join the
results, normalize only the output shape, and keep disagreements visible.

## evidence-engine

Owner: `verify`. Run repo-native tests and proportionate configured checks. Use
UI/browser evidence when the change is user-facing. Keep credentials out of
reports and clean up test processes.

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
`BLOCKED` means a required input, tool, or decision is actually unavailable;
it does not mean a reviewer dislikes the risk or an optional check was skipped.

## pr-state-dispatcher

Owner: `finish`. Read the current PR state, do the next useful action, and
re-check after mutations. Never turn a readiness report into an implicit merge.
