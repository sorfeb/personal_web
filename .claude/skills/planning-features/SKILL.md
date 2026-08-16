---
name: planning-features
description: |
  Plan and document features before implementation using project templates.
  Use when planning new features, creating architecture docs, or when user mentions
  "plan", "design", "architect", "feature plan", "implementation plan", or "before coding".
---

# Feature Planning

Create structured planning documents before implementation.

## When to Plan

Create a plan for:
- New features with multiple components
- Changes affecting multiple files
- Backend + frontend integration work
- Architecture decisions
- Refactoring efforts

Skip planning for:
- Single-file bug fixes
- Minor styling tweaks
- Documentation updates

## Planning Workflow

```
- [ ] Step 1: Clarify requirements with user
- [ ] Step 2: Research existing patterns in codebase
- [ ] Step 3: Identify affected files/components
- [ ] Step 4: Create planning document
- [ ] Step 5: Get user approval before implementing
```

## Plan Location — Linear, not the repo

**Plans live in Linear. There is no `.github/plans/` directory; do not create one.**

- Team `s11o`, project `personal_web`, issue keys `SOR-*`
- **Issue** per unit of work. Multi-phase work gets a parent issue with a sub-issue per phase,
  wired with `blockedBy` so the sequence is explicit.
- **Document** attached to the project for the design record — decisions and their rationale,
  prior art, architecture — when the reasoning is substantial enough to outlive the issue.
- Issue descriptions carry what someone picking up that phase needs, plus a link to the
  document. They do not restate it.

Use the Linear MCP tools (`list_issues`, `save_issue`, `save_document`). Check for an existing
issue before creating one. Diagrams and other binary artifacts attach to the parent issue via
`prepare_attachment_upload`.

Conventions distilled from a design review belong in `/CLAUDE.md`; the reasoning stays in
Linear. Never both — they drift.

## Plan Template

See [TEMPLATE.md](TEMPLATE.md) for the section structure to use in the Linear document.

## Quick Plan Structure

```markdown
# Feature: [Name]
**Date**: YYYY-MM-DD
**Status**: Planning

## Objective
What problem does this solve?

## Technical Approach
- Architecture decisions
- Components to create/modify
- API endpoints needed

## Implementation Steps
1. [Step with file path]
2. [Step with file path]

## Testing Strategy
- Unit tests needed
- Manual testing checklist

## Checklist
- [ ] Audio integration considered
- [ ] Responsive design planned
- [ ] Error handling defined
- [ ] No new dependencies (or approval obtained)
```

## Architecture Considerations

Always address:

| Aspect | Question |
|--------|----------|
| Audio | What sounds should play? |
| Responsive | Mobile behavior at 768px? |
| State | Local state or context? |
| Data | tRPC query or static? |
| Auth | Protected or public? |
| Performance | Memoization needed? |

## After Implementation

Create completion doc at:
```
.github/documentation/feature-name-complete.md
```