# `.github/`

Completion records and CI config. **Planning and agent instructions are not here.**

| Looking for | It lives in |
|---|---|
| Agent instructions, conventions | [`/CLAUDE.md`](../CLAUDE.md) (+ `.claude/skills/`) |
| Plans, design records, issue tracking | **Linear** — team `s11o`, project `personal_web`, keys `SOR-*` |
| What shipped and how it was verified | `documentation/` in this directory |

## Layout

```
.github/
├── documentation/            # Completion docs, written AFTER implementation
│   ├── TEMPLATE.md
│   └── <feature>-complete.md
└── workflows/                # GitHub Actions (release-please)
```

## Workflow

1. **Plan** — open a Linear issue in `personal_web`; add a Linear **document** for the design
   record when the reasoning is substantial. Approved before implementation starts.
2. **Build** — smallest reviewable slice; prefer several independently valuable commits over
   one large branch.
3. **Verify** — `npm run compile`, `npm run lint`, `npm run lint:css`, `npm run lint:useeffect`.
   Storybook is the only interactive harness; there is no test runner.
4. **Document** — `documentation/<feature>-complete.md`, and close the issue.

Skip planning for single-file fixes, styling tweaks, and doc updates.

## Why plans are not in this repo

Planning artifacts went to Linear so they are visible without a checkout and current without a
`git pull`. Keeping a copy here as well would guarantee the two disagree. The repo keeps only
what benefits from living beside the code: conventions (`CLAUDE.md`), domain guidance
(`.claude/skills/`), and the record of what actually shipped (`documentation/`).

## Where the Copilot-era files went

This project moved from GitHub Copilot to agentic CLIs (Claude Code primarily; the docs are
harness-neutral and also serve opencode). The old `copilot-instructions.md`, `agents/*`,
`QUICK_REFERENCE.md`, and `SUMMARY.md` were replaced by `/CLAUDE.md` + `.claude/skills/` and
have been **deleted** — recover them from git history if ever needed. Design-record markdown
that used to live in `/docs` was likewise moved to Linear project documents.
