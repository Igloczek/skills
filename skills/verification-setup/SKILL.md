---
name: verification-setup
description: "Create a project-local control recipe when a repository has no repeatable way to launch, drive, observe, and clean up its real CLI, API, service, desktop, or UI behavior."
---

Use this only when `verify` cannot exercise an observable surface through an
existing repository command or harness.

## Workflow

1. Identify the primary user surface and read the repository's documented run,
   test, seed, authentication, and cleanup paths. Ask only for facts the
   repository cannot provide.
2. Reuse an existing Playwright/Cypress test, CLI demo, PTY/Expect harness,
   HTTP endpoint, debug port, or project script when it can launch, drive, and
   observe the real behavior. Do not create a parallel framework.
3. Create `.agents/skills/verify-<app>/SKILL.md` with exact, project-grounded
   `Launch`, `Doctor`, `Drive`, `Evidence`, and `Cleanup` sections. Include a
   small `features/README.md` index of the user-facing paths the harness can
   prove. Leave no placeholder commands or selectors.
4. Prefer stable labels, selectors, prompt text, routes, and exit codes over
   coordinates, timing guesses, or internal setters. Capture the initiating
   action and observed result; independently inspect material side effects.
5. Run the generated recipe end to end against one indexed feature. For a
   reusable environment, prove a cold launch and a second healthy reuse. Run
   cleanup after failed attempts and confirm retained evidence still exists.
6. Record the generated skill name in `.ai/skills.json` as
   `providers.verification`, then route back to `verify`.

## Output

```text
Surface: <CLI|API|SERVICE|DESKTOP|UI|OTHER>
Skill: <project-relative path>
Launch: <exact command>
Doctor: <read-only readiness check>
Proof: <feature exercised and evidence path>
Cleanup: <exact scope cleaned>
Limits: <uncovered surfaces or none>
Status: READY|BLOCKED
```

## Rules

- Keep generated helpers inside the project-local verification skill and make
  every invocation explicit. Do not copy a public skill into the project.
- Drive the real user path. Use mocks only at an existing production boundary.
- Verify what dry-run or test mode actually avoids; do not trust its name.
- Isolate ports, profiles, data, and sessions. If isolation is impossible,
  refuse to drive a shared instance and report the concrete blocker.
- Stop only processes and resources started by the recipe. Never kill by name,
  remove shared data, or clean evidence artifacts.
- Do not edit product code to make the harness pass. Return `BLOCKED` and route
  a product defect to `fix` or missing capability to `build`.
- A generated recipe that has not completed its own proof is `BLOCKED`.
