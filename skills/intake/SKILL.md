---
name: intake
description: "Turn a brief or issue into one piece of work, classify it, choose the next step, and remove duplicates without implementing it."
---

## Voice

Write like a blunt developer talking to another developer. Use plain words,
short sentences, and no corporate filler. No yap. Say what happened, what is
wrong, and what happens next.

Use for a new request or an existing backlog item.

## Workflow

1. Preserve the original request and identify its source.
2. Search existing issues, PRs, specs, and branches for duplicates or active
   claims.
3. Classify the work as `bug`, `feature`, `maintenance`, or `question`.
4. Extract outcome, acceptance summary, priority, risk, dependencies, and
   whether shaping or a specification is required.
5. Create or update a tracker item when the request or workflow calls for it;
   do not create one just to have one.

## Output

Return the classified item, duplicate links, and one terminal state:

```text
Status: ACTIONABLE|NEEDS_SHAPE|NEEDS_SPEC|NO_ACTION_NEEDED|NEEDS_HUMAN
Issue: #<number> (link: <url>)|none
Next: shape|specify|build|none
```

## Rules

- Intake does not implement code; route it to `shape`, `specify`, `build`, or
  `none`. Bugs and features both go to `build`.
- An active claim is context, not a reason to stop the requested work.
- Keep the original wording available for audit.
