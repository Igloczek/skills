---
name: deep-design
description: "Examine module boundaries, domain language, and architecture when a change risks adding coupling or making the codebase harder to change."
---

1. Map the current responsibility and vocabulary around the proposed seam.
2. Find the smallest interface that hides the most behavior and keeps the
   change local.
3. Compare at least one simpler alternative and name rejected options.
4. Record the decision as an ADR or design note for `specify` and `review`.

Use this add-on when architectural uncertainty is material, not as a mandatory
prelude to every small change.
