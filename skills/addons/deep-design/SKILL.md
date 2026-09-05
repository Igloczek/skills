---
name: deep-design
description: "Examine module boundaries, domain language, and architecture when a change risks adding coupling or making the codebase harder to change."
---

## Voice

Write like a blunt developer talking to another developer. Use plain words,
short sentences, and no corporate filler. No yap. Say what happened, what is
wrong, and what happens next.

## Workflow

1. Map the current responsibility and vocabulary around the proposed seam.
2. Find the smallest interface that hides the most behavior and keeps the
   change local.
3. Compare at least one simpler alternative and name rejected options.
4. Record a durable ADR only when the repository already uses ADRs or the
   decision is cross-cutting; otherwise return the decision directly to
   `specify` and `review`.

Use this add-on when architectural uncertainty is material, not as a mandatory
prelude to every small change.

## Output

```text
Decision: <chosen boundary or no change>
Current seam: <responsibilities, vocabulary, and coupling>
Alternatives: <simpler option first, trade-offs, rejection reasons>
Contracts: <public/data/runtime contracts affected|none>
Artifact: <ADR/design-note path|none>
Open: <unresolved architectural risk|none>
Status: READY_FOR_SPEC|NOT_NEEDED|BLOCKED
```

## Rules

- Do not create an interface, service, layer, or ADR merely to satisfy this
  skill. Prefer the current boundary when it remains coherent.
- Cite concrete paths and symbols. Keep speculative future requirements out of
  the decision.
- Do not implement production code; hand the bounded decision to `specify`.
- Finish only when the next workflow can proceed without guessing the owning
  responsibility or affected contract.
