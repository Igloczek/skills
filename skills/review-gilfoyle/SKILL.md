---
name: review-gilfoyle
description: "Review a change for runtime reliability, observability, security, and operational risk with evidence-first SRE discipline."
---

Use as the operational review lane within `review`. It applies the evidence-first
discipline of the public `gilfoyle` skill without replacing specification,
product, domain, or QA review.

Use the same project snapshot, pinned diff, and repository instructions as the
other review lanes. This skill has a different focus, not a different
environment or branch.

## Workflow

1. Pin the base revision, read the task/spec, repository instructions, handoff,
   current diff, and relevant tests.
2. Trace changed paths through callers, configuration, failure handling,
   integrations, deployment, and observability.
3. If telemetry is available, discover the configured tool, dataset, schema, or
   application before querying it. If no usable target exists, report `NOT_RUN`.
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
Status: PASS|CHANGES_REQUESTED|BLOCKED|NOT_RUN
Scope: base, diff, paths, tools, and tests actually inspected
Decision: one concise operational verdict
Findings: path:line, severity, consequence, evidence, and confidence
Changes: none; reviewer is read-only
Open: unverified gates, owner, and next action
```
