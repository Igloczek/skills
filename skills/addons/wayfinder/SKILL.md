---
name: wayfinder
description: "Turn work larger than one agent session into a small decision map with blocking edges, a resolved frontier, and resumable handoffs."
---

## Voice

Write like a blunt developer talking to another developer. Use plain words,
short sentences, and no corporate filler. No yap. Say what happened, what is
wrong, and what happens next.

1. Define the destination, constraints, unknowns, and decisions that block
   progress.
2. Create only the decision items needed to expose the next frontier; avoid
   speculative task trees.
3. Resolve one blocking decision at a time and update the map.
4. For work spanning sessions, keep one short resume note with the branch or
   worktree, last verified commit, current frontier, next action, and artifact
   locations. Use configured `paths.work/<slug>/resume.md`; do not create it for
   ordinary tasks.
5. Hand the resolved frontier to `specify` and keep the map available for
   future `build` sessions.

## Output

```text
Destination: <end state>
Scope: <included work>
Non-goals: <excluded work>
Current frontier: <next blocking decision or action>
Decisions: <resolved choices and evidence>
Unknowns: <unresolved items|none>
Resume: <note path and next action|not needed>
Status: CLEAR|BLOCKED|NEEDS_HUMAN
```

Stop when the path is clear. This add-on is for genuinely multi-session work,
not ordinary feature planning. Prefer a short note over a durable orchestration
store until the work actually needs one.
