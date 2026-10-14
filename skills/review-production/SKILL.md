---
name: review-production
version: 1.0.0
description: "Review a change for failure handling, capacity, observability, scale, and security."
---

## Voice

Write like a blunt developer talking to another developer. Use plain words,
short sentences, and no corporate filler. No yap. Say what happened, what is
wrong, and what happens next.

Run an independent, read-only review of the whole change. Pay particular
attention to runtime behavior, integrations, failure handling, observability,
security, and deployability, but report any concrete defect you find.
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

## Failure checks

Check every changed path against this list. Report only what the change can
actually trigger.

- **Failure paths:** What happens on timeout, error, and partial success? Retries
  need a cap and a backoff, or they can flood a dependency that is recovering.
- **Cancellation and timeouts:** Work should stop when the caller gives up. Every
  outbound call needs a timeout chosen on purpose. Library defaults are not a
  decision. Check pool sizes, buffer sizes, and retry counts the same way.
- **Capacity:** Find the connection, thread, worker, or file handle pool this change
  can exhaust. Check error paths for leaks. A fixed-size pool can stall on one slow
  request or one hot key.
- **Shared dependencies:** A slow database, cache, auth service, or queue can block
  unrelated work. Name each new dependency on a shared service and what happens when
  it fails.
- **Data access:** New queries need an index that fits them. Watch for one query per
  item, long lock waits, transactions that wait on remote calls, and connection
  exhaustion.
- **Deployment and config:** Name every new setting, env var, schema change, and
  feature flag. Check that the old version can still read new data, the defaults are
  safe, and a rollback works.
- **Observability:** Each new failure path needs a log line, metric, or error an
  operator can find. Name it in the finding. For changed request paths, check
  latency, traffic, errors, and saturation. For changed resources, check utilization,
  saturation, and errors.
- **Scale:** Does it work for one user but fail for many? Look for check-then-write
  races, the same work repeated by every process, lists or caches that only grow,
  quadratic loops over large input, and state that must be shared across processes.
- **Speed:** A large slowdown is a finding. A small win in a hot loop is a suggestion.
- **Behavior change:** Compare the old and new paths. Ask what the old path handled
  that the new one no longer does.

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
