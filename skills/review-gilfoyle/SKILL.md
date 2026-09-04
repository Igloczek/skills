---
name: review-gilfoyle
description: "Review a change for correctness and operational risk, including runtime behavior, integrations, observability, and security."
---

## Voice

Write like a blunt developer talking to another developer. Use plain words,
short sentences, and no corporate filler. No yap. Say what happened, what is
wrong, and what happens next.

Run an independent, read-only review of the whole change. Pay particular
attention to runtime behavior, integrations, failure handling, observability,
security, and deployability, but report any concrete defect you find. If the
external `gilfoyle` skill is available, invoke it directly and preserve its
findings; only normalize its output into the contract below.
In the normal workflow, run after `verify` has checked the product. Review the
implementation against that intent. If a finding changes behavior, send it
back through `build`, then verify again.

## Workflow

1. Pin the base revision and read the request, spec, repository instructions,
   current diff, and relevant tests.
2. Trace changed paths through callers, configuration, failure handling,
   integrations, deployment, and observability.
3. Discover the configured telemetry or runtime target before querying it. If no
   usable target exists, record that evidence check as `NOT_RUN` and continue
   reviewing code, configuration, failure handling, and integrations.
4. Try to disprove operational hypotheses. Every finding needs an exact
   `path:line`, consequence, and reproducible evidence.
5. Refresh the diff and line references before the verdict. Do not edit code,
   install dependencies, deploy, or mutate tracker state.

## Output

```text
Status: PASS|CHANGES_REQUESTED|BLOCKED
Review unit: base, diff, paths, tools, and tests actually inspected
Intent sources: task, issue, spec, or "not available"
Findings:
- [BLOCKER|MAJOR|MINOR] path:line — title; consequence; evidence; correction
Checks: exact command or interaction => result
Open: unverified gates, NOT_RUN evidence checks, owner, and next action
Summary: one concise operational verdict
Changes: none; reviewer is read-only
```

Report `BLOCKED` only when the review unit or necessary evidence is unavailable.
Never infer production events from code alone, and never expose credentials,
tokens, or secrets.
