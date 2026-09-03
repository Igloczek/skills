---
name: wayfinder
description: "Turn work larger than one agent session into a small decision map with blocking edges, a resolved frontier, and resumable handoffs."
---

1. Define the destination, constraints, unknowns, and decisions that block
   progress.
2. Create only the decision items needed to expose the next frontier; avoid
   speculative task trees.
3. Resolve one blocking decision at a time and update the map.
4. Hand the resolved frontier to `specify` and keep the map available for
   future `build` sessions.

Stop when the path is clear. This add-on is for genuinely multi-session work,
not ordinary feature planning.
