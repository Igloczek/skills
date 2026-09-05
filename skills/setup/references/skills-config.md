# Skills configuration

`.ai/skills.json` is the shared contract between the installed skills. Commit it
with the project. Paths are project-relative, commands are complete shell
commands, and providers contain only non-secret descriptors or names.

```json
{
  "version": 1,
  "commands": {
    "validation": ["bun run check"],
    "feedback": ["bun test path/to/focused.test.ts"]
  },
  "providers": {
    "tracker": "github",
    "browser": "agent-browser"
  },
  "paths": {
    "briefs": ".ai/briefs",
    "specs": ".ai/specs",
    "research": ".ai/research",
    "work": ".ai/work"
  },
  "domain_experts": []
}
```

- `version` is the config schema version and is `1`; it does not pin external
  skills.
- `commands.validation` is the ordered validation command list and must contain
  at least one command. `commands.feedback` is optional and contains cheaper
  focused checks.
- `providers` is an object. Omit unavailable providers from that object; use an
  empty object when none are available. Values must be non-empty names or
  descriptors and must never contain credentials.
- `paths` values must be project-relative and stay inside the project. Skills
  use `briefs` for shaping, `specs` for specifications, `research` for findings,
  and `work` for resumable notes.
- `domain_experts` is optional. When present, use the contract in
  [domain-expert.md](domain-expert.md).
