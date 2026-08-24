---
name: reviewing-code
description: |
  Code review with project-specific conventions for the Xbox 360 portfolio site.
  Use when reviewing code, checking PRs, auditing files, or when user mentions
  "review", "check code", "audit", "PR review", "code quality", or "best practices".
---

# Code Review

Review against the conventions in `/CLAUDE.md`, which is the source of truth. This skill covers
how to run the review, not what the rules are.

## Run the Gates First

Do not eyeball what a command can decide. Run these before reading a line:

```bash
npm run compile          # or typecheck (tsgo, same result, faster)
npm run lint
npm run lint:css
npm run lint:useeffect
```

**`lint:css` reports warnings, not errors, so it exits 0 even when it finds hundreds.** Compare
the warning count against the pre-change count. A review that says "lint passes" because the exit
code was 0 has checked nothing.

There is no test runner. Storybook is the only interactive harness.

## Blockers

These fail review regardless of anything else:

| Violation | How to spot it |
|---|---|
| Dev server started or committed as a step | `npm run dev` invoked outside the user's own terminal |
| New dependency without approval | Any addition to `package.json` |
| `console.log` left in | Grep the diff, not the tree |
| tRPC procedure with unvalidated input | `.query`/`.mutation` with no `.input()` |
| Raw Prisma error reaching the client | `throw err` inside a procedure |
| User id read from procedure input rather than context | `input.userId` used as the owner |
| Direct `useEffect` in `src/components/**` or `src/app/**` | `lint:useeffect` catches it; untagged is a blocker |
| Hardcoded color, radius or timing in a `.module.css` | `lint:css` count went up |

## What the Linters Cannot See

Spend review attention here, because the gates already cover the rest.

**Input model.** The site is driven by mouse, touch, keyboard and gamepad. Check that:
- Selection is real DOM focus, not a React `selectedIndex` painting a highlight
- Clickable things are `<button>` or `next/link`, not a div with `onClick`
- Nothing blanket-applies `tabIndex={0}` across a composite widget
- New keyboard handling registers a gamepad scope rather than adding a `window` keydown listener

**Reuse.** A new button, toggle, tooltip or modal that duplicates something in
`src/components/ui/` should use the primitive instead. The primitives carry audio, focus-visible
and ARIA that a hand-rolled element silently drops.

**Motion.** Anything animated needs a `prefers-reduced-motion: reduce` block.

**Authorization, not just authentication.** A `protectedProcedure` proves who the caller is. It
does not prove the row is theirs. Look for the ownership comparison before every update and delete.

**Query shape.** `select` present, relations projected rather than spread, list endpoints
paginated with a bounded limit.

See [SECURITY.md](SECURITY.md) for the full security pass.

## Report Format

```markdown
## Review: <scope>

### Blockers
- <file>:<line> — what is wrong and what breaks because of it

### Warnings
- <file>:<line> — what is wrong

### Suggestions
- <what and why>

### Gates
- compile: pass/fail
- lint: pass/fail
- lint:css: <n> warnings (was <m>)
- lint:useeffect: pass/fail
```

State the failure concretely. "Missing validation" is not reviewable; "`input.id` is unvalidated,
so a non-UUID reaches Prisma and surfaces as a 500" is.
