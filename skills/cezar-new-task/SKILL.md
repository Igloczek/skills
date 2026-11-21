---
name: cezar-new-task
version: 0.1.0
description: "Create a separate top-level Cezar task from an agent through Cezar's local HTTP API when the user explicitly asks to split work."
---

## Voice

Write plainly. Say what was created or why creation failed. Do not hide an
ambiguous project or a rejected request behind a guessed retry.

## Workflow

Use this skill only when the current request explicitly authorizes creating a
separate top-level Cezar task. Explicitly invoking this skill counts as that
authorization.

One invocation creates one task. The task is created through the same
`POST /api/v1/p/:projectId/runs` route used by Cezar's New task screen. Do not
use `cezar run`. That command starts a separate headless run instead of
submitting to the running cockpit.

1. Build the new task prompt from the current request and any completed plan.
   Do not include unresolved analysis when the requested task needs a concrete
   implementation brief.
2. Choose the project. Pass `--project <id>` when the request names a project
   or when more than one registered project could match. Otherwise the helper
   matches the current Git repository, including a Cezar task worktree, against
   the local project registry.
3. Send a JSON body through the bundled helper. It requires `task` and exactly
   one of `workflow` or `steps`. `quick-task` is the safe built-in workflow.
   Preserve other UI choices only when the request specifies them. Supported
   optional fields include `model`, `runner`, `agentProfile`, `variants`,
   `worktree`, `autonomous`, `generateFollowups`, `systemPrompt`, `images`, and
   `todoId`.

Run the helper with its absolute path from this skill directory:

```sh
node /absolute/path/to/cezar-new-task/scripts/create-task.mjs <<'JSON'
{"task":"Implement the approved plan","workflow":"quick-task"}
JSON
```

The helper discovers Cezar on ports 4321 through 4370 by default. Set
`CEZAR_URL` when discovery is not appropriate. Set `CEZAR_PROJECT_ID` or
`CEZAR_PROJECT_ROOT` when the environment already knows the intended target.
For a deliberately remote server, pass `--allow-remote` and provide
`CEZAR_TOKEN` if the reverse proxy requires a bearer token.

Do not retry a successful request. If the helper reports an ambiguous project,
missing server, or API rejection, report it and stop unless the user gives a
different target or body.

## Output

Return:

```text
Status: CREATED|NOT_CREATED|NEEDS_PROJECT|FAILED
Task: <run id>|none
Project: <project id>|none
URL: <cockpit task URL>|none
Reason: <one short explanation>|none
```
