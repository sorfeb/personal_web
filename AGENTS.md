# AGENTS.md

Cross-harness entry point for agentic coding tools (opencode, Codex, Cursor, and others
following the `AGENTS.md` convention).

**Read [`CLAUDE.md`](./CLAUDE.md) — it is the canonical and complete guide for this repo.**
It covers build commands, critical rules, architecture, the input/navigation model, the React
effects policy, and the development flow. This file exists only so harnesses that look for
`AGENTS.md` find their way there; it is deliberately not a second copy, because two copies
drift.

Domain-specific guidance lives in `.claude/skills/` — these are plain `SKILL.md` files and are
readable by any harness, not just Claude Code.

<!-- intent-skills:start -->
## Skill Loading

Before substantial work:
- Skill check: run `npx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->
