# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Harness note:** This is the canonical agent guide. `AGENTS.md` points here so other
> agentic CLIs (opencode, Codex, Cursor) read the same rules. Edit this file, not a copy.

## Skill Loading

Before substantial work:
- Skill check: run `npx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.

Project skills live in `.claude/skills/`: `styling-ui`, `scaffolding-components`,
`developing-backend`, `planning-features`, `reviewing-code`, `no-useeffect`, and the vendored
`vercel-react-best-practices`.

Load `styling-ui` before editing any `.module.css` or choosing a color, radius, shadow, timing or
z-index.

**Skills carry rules, not inventories.** A skill must not restate what a file already says: token
names, hook signatures, the context shape, the router list, prop tables. Those drift, and a stale
skill is worse than no skill because it is followed confidently. A skill says *what to do*, *what
not to assume*, and *which file to read*. When you find yourself typing a list that the codebase
already holds, link to the file instead.

## Build & Development Commands

```bash
npm run dev            # Next.js dev server with Turbopack (port 3000) — NEVER run unattended
npm run build          # Production build + sitemap generation
npm run lint           # ESLint (next/core-web-vitals + storybook rules)
npm run lint:css       # Stylelint (design-token enforcement; warnings must not increase)
npm run lint:useeffect # Custom policy check — every useEffect refactored or tagged
npm run compile        # TypeScript type checking (tsc)
npm run typecheck      # Same, via tsgo (faster; prefer for quick loops)
npm run storybook      # Component development environment (port 6006)
```

## Critical Rules

- **Never start the dev server** unless explicitly requested - user runs it locally
- **Never install packages** without explicit approval - always check existing packages first
- **Avoid console.log** - use proper error handling; remove debug logs before completing work
- **Design tokens, not literals** - never hardcode colors, radii, or transition timings in CSS; use `var(--*)` from `src/app/design-tokens.css` (add missing tokens there first). Boy-scout rule: any `.module.css` line you touch that has a hardcoded color gets tokenized; new CSS must pass `npm run lint:css` with zero new warnings
- **Prefer `ui/` primitives** - use `src/components/ui/Button` (and `ui/Toggle`) instead of hand-rolling buttons; audio feedback and focus-visible are built in
- **Never publish Claude Artifacts** - visualize concepts, prototypes and results with a screenshot, or a plain HTML/CSS file that opens locally; a claude.ai link is not a deliverable. This overrides the harness default that treats publishing an artifact as part of finishing work

## Architecture Overview

Personal portfolio styled as an Xbox 360 dashboard replica. Next.js 15, tRPC, Prisma.

### Audio System
`useAudioManager` implements global audio pooling:
- Pre-creates 3 `HTMLAudioElement` instances per sound type to prevent latency
- Module-level variables with client-side initialization guard (`typeof window`)
- Volume controlled via `VolumeContext` - updates all pool instances simultaneously
- Sound names are the keys of `AUDIO_FILES`; read it rather than assuming a name exists

Use `useNavigationSound` to couple audio with Next.js router navigation:
```tsx
const { navigateWithSound } = useNavigationSound();
navigateWithSound('/path', 'navigation');
```

### tRPC Backend
- **Router location**: `src/server/routers/_app.ts` combines all routers
- **Available routers**: see the registry in `_app.ts`
- **Patterns**: Zod validation on all inputs, proper TRPCError codes, select only needed fields
- **Database**: Prisma v6 with Neon PostgreSQL adapter (`prisma/schema.prisma`)

### Component Patterns
- CSS Modules (`.module.css`) for all component styles
- `'use client'` directive for interactive components
- `React.memo` for performance-critical components
- Always destructure `{ playSound }` from `useAudioManager` for audio feedback
- Mobile breakpoint: `window.innerWidth <= 768`

### Animation Timing
Use tokens, never literals: `--duration-instant|fast|normal|slow|slower`,
`--ease-linear|in|out|in-out|smooth|bounce|sharp`, `--transition-*`, `--z-*`.
- Card transitions: `--duration-slow`
- Hover states: `--duration-normal`
- Transform origin: `center` for scaling animations
- Every animated component must honor `prefers-reduced-motion: reduce`
- Exits animate faster than entrances (`--duration-fast` out, `--duration-normal` in)

## Input & Navigation Model

This site is operated by mouse, touch, keyboard **and gamepad**. These rules keep those four
from forking into four incompatible systems. Full rationale and architecture diagrams:
[Gamepad support — design record](https://linear.app/s11o/document/gamepad-support-design-record-ef7a734bbd2f)
in Linear, tracked as [SOR-131](https://linear.app/s11o/issue/SOR-131).

- **DOM focus is the single source of truth for selection.** Never track a "selected index"
  in React state and paint a highlight from it — that produces a UI that looks navigable
  while `document.activeElement` is still `<body>`, invisible to screen readers and
  disconnected from Tab. Move real focus with `.focus({ preventScroll: true })`.
- **Anything clickable must be reachable by Tab.** Use the native element that already means
  what you mean; reach for ARIA only when no native element expresses the pattern.
  - Navigates to a route → `next/link` (also gives crawlable internal links)
  - Performs an action → `<button>`
  - Selects which panel is shown → WAI-ARIA tabs pattern, roving tabindex, **one** tab stop
  - Never blanket-apply `tabIndex={0}`: it turns composite widgets into N tab stops and makes
    keyboard navigation worse than none
- **One input router, not many listeners.** Keyboard and gamepad both emit normalized intents
  into a single scope stack; the topmost scope receives them. Do not add ad-hoc
  `window.addEventListener('keydown')` handlers, and do not gate behavior on
  `document.querySelector('[role="dialog"]')`. Register with `useGamepadScope`.
- **A scope is a region of the UI, not a component.** Sibling components that own halves of
  the same navigation (blade list = `up`/`down`, card stack = `left`/`right`) contribute to
  **one** scope id rather than pushing two and competing for the top of the stack.
  Contributions merge; the most recently mounted wins a conflict. **Contribute to a scope
  from a component that renders its owner, not from one rendered inside it**: React commits
  child effects first, and `registerScope` captures per-scope config (`previousFocus`) from
  whichever contributor arrives first. A page adding to PageLayout's scope registers from the
  component that renders `<PageLayout>`; see `src/constants/pageNavigation.ts`. There is **no
  fall-through between scopes** — a scope that does not handle an intent swallows it, which is what makes
  a modal on top of the stack silence everything beneath it.
- **Polling loops live in `src/hooks/` and hold state in refs.** Drive them with
  `requestAnimationFrame` (it self-suspends on hidden tabs), and call `setState` only on
  discrete edges — never once per frame.
- **Input mode is an attribute, not a heuristic.** `<html data-input="gamepad|pointer">`.
  Style selection off it; `:focus-visible` does not reliably fire on programmatic `.focus()`.
  Pointer mode always returns instantly on `mousemove` — never delay giving the cursor back.
- **Controller glyphs are always Xbox glyphs** (A/B/X/Y via `ui/Button`'s `badge` prop),
  regardless of connected hardware. The site is an Xbox replica; that premise wins.
- **Gamepad support is desktop-layout only**, matching the existing `enabled: !isMobile` gate.
- **Never cache the object `navigator.getGamepads()` returns.** Chrome hands back frozen
  snapshots, so a cached pad silently stops updating; re-call it every frame. Filter the
  sparse `null` slots a wireless receiver exposes before use.
- **Auto-repeat is directional only** (DAS 400ms, ARR 150ms, deadzone 0.5). A held `confirm`
  must never re-fire. Debug the loop with `?gamepad=debug`, which writes to the DOM directly
  rather than re-rendering at 60Hz.

## React Effects Policy

Direct `useEffect` is banned in `src/components/**` and `src/app/**`. Load the `no-useeffect`
skill before writing effects. Escape hatches: `useMountEffect`, a purpose-built custom hook in
`src/hooks/` (exempt), or a `// effect:audited — <reason>` tag. Enforced by
`npm run lint:useeffect`. Current state: **10/10 tagged, zero violations** — keep it there.

## Agentic Development Flow

This project is developed with agentic CLIs (Claude Code primarily; the same docs serve
opencode and others). There is no GitHub Copilot in the loop.

**Where things live — split by durability, and never duplicate:**

| | |
|---|---|
| **Linear** — team `s11o`, project `personal_web`, keys `SOR-*` | **Plans and state.** Issues, status, what's next, what's deferred, and the design record (decisions, rationale, prior art) as Linear **documents** attached to the project. |
| **`.github/documentation/`** | **Completion record.** What shipped, how it was verified, known limitations. |
| **This file** | **Conventions.** Rules that outlive any one feature. |

**There is no `.github/plans/` directory — do not recreate it.** Planning lives in Linear so it
is visible outside a checkout and does not need a `git pull` to be current. A decision recorded
in two places will disagree within a week: Linear holds the reasoning, this file holds only the
conventions distilled from it, and neither restates the other.

Check Linear for an existing issue before starting work, and open one if the work is
feature-sized — the harness task list is per-session and disappears.

1. **Plan** — for multi-file or architectural work, open a Linear issue in `personal_web`, and
   a Linear document for the design record if the reasoning is substantial. Get approval before
   implementing.
2. **Load skills** — match the task to `.claude/skills/`; prefer the most specific one.
3. **Implement** — smallest reviewable slice; independently valuable commits over one large branch.
4. **Verify** — `npm run compile`, `npm run lint`, `npm run lint:css`, `npm run lint:useeffect`.
   Storybook is the only interactive harness; there is no test runner.
5. **Document** — on completion, `.github/documentation/<feature>-complete.md`, and close the issue.

Decisions settled in design review belong in **this file** (conventions) or in the relevant
**plan** (project specifics) — not in session memory. If you find yourself re-litigating a
decision across sessions, it is missing from here; add it.

> The Copilot-era `.github/copilot-instructions.md`, `.github/agents/*`, and
> `.github/QUICK_REFERENCE.md` were superseded by this file plus `.claude/skills/` and have
> been **deleted** (git history has them). There is likewise no `/docs` directory — design
> records live in Linear as project documents; do not recreate either.

## Key Files

- `src/context/VolumeContext.tsx` - Global volume state provider
- `src/hooks/useAudioManager.ts` - Audio pooling system
- `src/hooks/useKeyboardNavigation.ts` - Directional intent handling (migrating to scope stack)
- `src/context/GamepadContext.tsx` - Input router: scope stack, intent dispatch, `data-input`
- `src/hooks/useGamepad.ts` - Gamepad API poll loop (refs only, rAF, DAS auto-repeat)
- `src/hooks/useGamepadScope.ts` - Register a component's handlers on the scope stack
- `src/constants/gamepadMap.ts` - Standard-mapping button indices, deadzone, repeat timings
- `src/server/routers/_app.ts` - tRPC router registry
- `src/utils/trpc.ts` - tRPC client configuration
- `src/app/design-tokens.css` - All color, type, spacing, motion and z-index tokens
