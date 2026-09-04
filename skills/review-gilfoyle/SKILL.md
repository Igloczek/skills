---
name: review-gilfoyle
description: "Review a change for runtime behavior, integration, observability, and security as one of the three review personas."
---

Use as one of the three review personas within `review`. Run it for every
change alongside `review-standard` and `review-ponytail`. It covers runtime behavior,
integration, observability, and security with evidence from the changed code
and controlled runtime targets.

Use the same project snapshot, pinned diff, and repository instructions as the
other review lanes. This skill has a different focus, not a different
environment or branch.

## Workflow

1. Pin the base revision, read the task/spec, repository instructions, handoff,
   current diff, and relevant tests.
2. Trace changed paths through callers, configuration, failure handling,
   integrations, deployment, and observability.
3. If telemetry is available, discover the configured tool, dataset, schema, or
   application before querying it. If no usable target exists, record the
   runtime-evidence check as `NOT_RUN` and continue reviewing code, configuration,
   failure handling, and integrations.
4. Try to disprove operational hypotheses. Every finding needs an exact
   `path:line`, consequence, and reproducible evidence.
5. Refresh the diff and line references before the verdict.

## Rules

- Never infer what happened in production from code alone; mark unverified
  claims explicitly.
- Never print, copy, transmit, or commit credentials, tokens, or secrets.
- Do not edit code, run mutations, install dependencies, deploy, or merge.
- Do not block for style-only preferences. Severity follows evidence and impact.

## Output

```text
Status: PASS|CHANGES_REQUESTED|BLOCKED
Scope: base, diff, paths, tools, and tests actually inspected
Decision: one concise operational verdict
Findings: path:line, severity, consequence, evidence, and confidence
Changes: none; reviewer is read-only
Open: unverified gates, `NOT_RUN` evidence checks, owner, and next action
```
