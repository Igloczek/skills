---
name: ui-dev
version: 0.1.0
description: "Implement interface changes with project contracts, accessible states, and polished interaction details."
---

Use for components, routes, forms, responsive layout, user-visible states, and
interaction. Companion guidance may come from `design-taste-frontend` and
`make-interfaces-feel-better` when those skills are installed; neither replaces
the project's framework or explicit requirements.

## Workflow

1. Read project instructions, acceptance criteria, existing UI patterns, and the
   exact API/schema contract.
2. Check the project manifest before importing a library. Reuse existing
   components, tokens, and styling conventions.
3. Implement the smallest UI change with explicit loading, empty, validation,
   error, success, disabled, responsive, and reduced-motion states where they
   apply.
4. Preserve accessibility: semantic controls, visible focus, keyboard paths,
   readable contrast, and touch targets of at least 44px where practical.
5. Prefer specific transitions on `transform` and `opacity`; never use
   `transition: all`. Use press feedback around `scale(0.96)` only when it fits
   the product, and keep animation interruptible and performance-bounded.
6. Run focused checks. Use browser evidence only for changed user flows and
   report `NOT_RUN` when no usable target exists.

## Boundaries

Do not invent API fields, calculate domain values, change persistence, or decide
product/domain semantics. Consult the project's relevant local domain experts
when the UI renders domain-sensitive content. Keep data ownership in the existing API and
shared contracts.

## Output

```text
Status: PASS|CHANGES_REQUESTED|BLOCKED|NOT_RUN
Scope: changed UI paths and contract consumed
Decision: one concise UI result
Evidence: checks, browser URL/actions/snapshots, or explicit NOT_RUN
Changes: components, states, and interaction details changed
Open: API, UX, domain, accessibility, or browser gates with owner and next action
```
