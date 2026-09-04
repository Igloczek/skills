---
name: fix
description: "Resolve a suspected defect by reproducing it, finding the smallest root cause, adding a regression test, and producing a reviewable fix."
---

Use for bug work, not for an unvalidated feature request.

## Workflow

1. Build one red-capable feedback command that exercises the reported path and
   asserts the exact symptom. Run it once. Tighten it until it is deterministic,
   unattended, and as fast as the repository permits; for a flaky defect,
   increase and record the reproduction rate instead of claiming determinism.
2. Reproduce the reported failure, then remove inputs, steps, callers, and
   configuration one at a time until every remaining element is load-bearing.
3. Trace every caller through the owning boundary. For a hard or ambiguous bug,
   rank three to five falsifiable hypotheses, state each prediction, and test
   one variable at a time. Prefer a debugger or boundary probe; tag temporary
   logs with one unique searchable prefix.
4. For a performance regression, measure a baseline under fixed inputs before
   editing. Compare history or bisect with the same command when a known-good
   revision exists; use a profiler or query plan instead of broad logging.
5. State the evidence-backed root cause and smallest shared change surface.
   Turn the minimized reproduction into a failing test at a seam that preserves
   the real bug pattern. If no honest seam exists, document that testability gap
   rather than adding a shallow test that cannot catch the defect.
6. Make the smallest safe fix. Run the regression test, the original unminimized
   feedback command, nearby risk checks, and configured validation. Remove all
   tagged probes and throwaway harnesses.
7. Open or update a PR, or stop cleanly if the bug is already fixed or cannot
   be confirmed.

## Output

```text
Status: FIXED_IN_PR|NO_ACTION_NEEDED|NEEDS_HUMAN
PR: #<number> (link: <url>)|none
Feedback: <red-capable command and before/after result|none>
Root cause: <mechanism and owning boundary|unconfirmed>
Regression: <test and result|no honest seam: reason>
Cleanup: <temporary instrumentation and processes removed>
```

Include reproduction, root cause, regression, validation, and remaining risk.

## Rules

- Do not change behavior without a reproduction or a documented reason.
- Do not hide a failed reproduction behind a speculative patch.
- If no red-capable loop can be built, list the attempted paths and request the
  missing environment or redacted artifact; do not continue with a guessed fix.
- Preserve the before result so the after result proves a behavior change rather
  than a test that was never capable of failing.
- Never include credentials, auth headers, or raw production data in a captured
  fixture, transcript, log excerpt, or PR.
- Never merge the resulting PR.
