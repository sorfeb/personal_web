# Complete: Phase 2 — Gamepad Input Layer
**Date**: 2026-08-16
**Status**: Complete
**Design record**: [Gamepad support — design record](https://linear.app/s11o/document/gamepad-support-design-record-ef7a734bbd2f) (Linear)
**Issue**: [SOR-133](https://linear.app/s11o/issue/SOR-133) (parent [SOR-131](https://linear.app/s11o/issue/SOR-131))
**Follows**: [Phase 1 — Focusability & Semantics](./phase1-focusability-complete.md)

## What was built

The input layer: a polling loop that reads the Gamepad API, normalises it into
hardware-agnostic intents, and routes those through a single scope stack. The dashboard is
wired to it end to end — blades on the stick and D-pad vertically, cards horizontally.

Phase 2 is additive by construction. Removing `<GamepadProvider>` from `layout.tsx` removes
the entire feature; nothing else depends on it existing.

## Changes

### `useGamepad` — the poll loop
Two platform facts shape the hook, and both are commented at the call site so they survive
the next refactor:

1. **There are no button events.** `navigator.getGamepads()` reports state, so edges are
   derived by diffing frames.
2. **Chrome returns frozen snapshots.** Caching the returned object silently freezes input,
   so `getGamepads()` is re-called every frame — deliberately, not accidentally.

Sparse `null` slots are filtered before use: a wireless receiver exposes four slots whether
or not they are populated, and after a hot-unplug the live pad can sit at a non-zero index.

All per-frame state lives in refs. `setState` fires on **connect and disconnect only** — a
resting controller costs zero renders. `requestAnimationFrame` also self-suspends on hidden
tabs, which a `setInterval` poll would not.

Auto-repeat is DAS/ARR — 400ms before the first repeat, 150ms between them after — and
applies **only to directional intents**. A held `A` must not re-activate the focused control
sixty times a second.

The left stick contributes only its **dominant** axis. Letting a diagonal push fire both
axes makes a menu feel like it is guessing.

### `GamepadProvider` — one router, not many listeners
Scopes form a stack; only the topmost receives intents, with **no fall-through between
scopes**. A modal that understands `up`/`down` but not `left` swallows `left` rather than
letting the dashboard behind it steer. That is exactly the property
`useKeyboardNavigation`'s `document.querySelector('[role="dialog"]')` guard was
approximating — Phase 3 migrates keyboard onto this stack and deletes the sniff.

**A scope is a region of the UI, not a component.** The dashboard's blade list and card
stack are siblings that each own half of the same navigation, so both *contribute* to one
`dashboard` scope instead of pushing two and competing for the top. Contributions merge;
the most recently mounted wins a conflict; the scope disappears when its last contributor
unmounts.

Handlers are read through a getter, so a component re-creating its callbacks every render
never re-registers — which would otherwise reorder the stack and hand control to the wrong
scope.

There is exactly one provider-level default: `confirm` clicks `document.activeElement` when
no scope claims it. DOM focus is already the single source of truth for selection, so A
works everywhere without every scope re-declaring it.

### Input mode is an attribute
`<html data-input="gamepad|pointer">` is written imperatively from event callbacks;
`setState` runs only on an actual flip. Styling keys off the attribute because
`:focus-visible` does not reliably fire on the programmatic `.focus()` calls the router
makes.

The pointer is hidden the instant the pad is used, and returns instantly on `mousemove` —
`cursor` is a binary property that cannot be transitioned, and delaying the cursor's return
is forbidden by convention anyway. The animated half is the **selection ring**:
`--duration-normal` in, `--duration-fast` out, matching the project's "exits animate faster
than entrances" rule, and disabled under `prefers-reduced-motion`.

### `?gamepad=debug` overlay
Live button, axis, and dispatched-intent readout. Every value updates at 60Hz and is
written **straight to the DOM** rather than through `setState` — a debug tool that
re-rendered the tree once per frame would change the very timing it exists to measure.

The flag is read from `window.location` after mount rather than through `useSearchParams`,
which would opt every page rendering it into dynamic rendering for a tool that is off by
default.

### The timing hazard is fixed
`useCardNavigation` committed its index after `STATE_UPDATE_DELAY` (100ms) while the
transition ran for `ANIMATION_DURATION` (400ms). For 300ms the state and the visible stack
disagreed, and a held direction landing in that window transformed cards from the previous
frame's layout — desyncing the stack.

An `isAnimating` re-entry guard now holds until the animation completes. The fix belongs in
the hook, not as a clamp in the input layer: **the bug is reachable today by holding an
arrow key, with no controller involved.**

### Both card hooks take refs
`useCardNavigation` and `useInitialCardAnimation` previously located their targets with
`document.querySelector` on CSS-module class strings — a document-wide query that finds
cards belonging to *any* mounted dashboard. `XboxDashboard` now owns a ref array and passes
it to both, so they are provably animating the same nodes it rendered. `useInitialCardAnimation`
no longer needs to own a section ref at all.

## Files

```
Created:  src/types/gamepad.ts
          src/constants/gamepadMap.ts
          src/hooks/useGamepad.ts
          src/hooks/useGamepadScope.ts
          src/context/GamepadContext.tsx
          src/components/GamepadDebugOverlay/GamepadDebugOverlay.tsx + .module.css
          .github/documentation/phase2-gamepad-input-layer-complete.md

Modified: src/app/layout.tsx           (mount GamepadProvider + overlay)
          src/app/page.tsx             (pass `disabled` through to the dashboard)
          src/app/globals.css          (input-mode cursor + selection ring)
          src/constants/dashboardNavigation.ts  (DASHBOARD_SCOPE_ID)
          src/hooks/index.ts
          src/hooks/useCardNavigation.ts        (guard + refs)
          src/hooks/useInitialCardAnimation.ts  (refs)
          src/components/XboxDashboard/XboxDashboard.tsx
          src/components/ScrollingMenu/ScrollingMenu.tsx
          CLAUDE.md
```

## Verification

| Check | Result |
|---|---|
| `tsc --noEmit` | Clean |
| `next lint` | 0 errors, 0 new warnings (the one I introduced — a ref read in a cleanup — is fixed, not suppressed) |
| `lint:useeffect` | 0 unapproved calls |
| `lint:css` | 0 warnings in `globals.css` and the new overlay module; project total unchanged |
| `next build` | Succeeds; all 21 routes prerender |

**Not yet verified:** anything requiring a physical controller. Every claim above is
established statically — types, lint, the spec, and reasoning about the DOM — not by
driving a pad. Before Phase 3, plug one in and load `/?gamepad=debug`, then confirm:

- The panel reports `connected` only after the first button press (browsers hide pads until then).
- D-pad and left stick light the right cells; the stick reads ±1.00 at full deflection.
- Held D-pad fires once, pauses ~400ms, then repeats ~every 150ms — and card navigation
  advances **one card per transition**, never skipping or stacking.
- The intent log names `dashboard` as the receiving scope.
- The cursor vanishes on the first pad input and returns on the first mouse move.
- Opening the profile modal silences the dashboard.

## Known limitations

- **No focus home.** `confirm` activates `document.activeElement`, which is `<body>` on a
  fresh load, so A does nothing until the user Tabs in. Phase 3's spatial navigation gives
  focus somewhere to start.
- **No modal scopes yet.** The dashboard is silenced while the profile modal is open via a
  `disabled` prop threaded from the page — a stand-in. Phase 3 replaces it with a real modal
  scope pushed on top of the stack, which silences everything beneath it without being told.
  Other modals (`BackgroundSelector`, `WMPPlayer`, `ChatWindow`) are not yet covered.
- **Keyboard still runs on its own listeners.** Migrating it onto this stack is deliberately
  the *last* step of Phase 3 — proving the gamepad stack first beats debugging two systems
  at once.
- **`gamepad` mode applies its selection ring to every `:focus`**, including form fields.
  Acceptable as a default for controller navigation; revisit if it reads badly anywhere.
- Guide button (index 16) is unmapped on purpose: XInput reserves it on Windows, so it never
  reaches the browser reliably and must not be load-bearing.

## Next

Phase 3 — [SOR-134](https://linear.app/s11o/issue/SOR-134): `useSpatialNavigation`, page and
modal scopes, the keyboard migration, and the two Phase 1 deferrals
([SOR-136](https://linear.app/s11o/issue/SOR-136), [SOR-137](https://linear.app/s11o/issue/SOR-137)).
