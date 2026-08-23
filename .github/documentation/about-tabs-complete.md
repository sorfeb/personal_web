# Feature: About page Guide tabs - Completed ✅

**Completion Date**: 2026-08-23
**Implementation Date**: 2026-08-23
**Agent**: Frontend
**Related issue**: [SOR-161](https://linear.app/s11o/issue/SOR-161) (Linear)

## Summary

`/about` was three inert paragraphs: an NXE encyclopedia blurb, a one-line tech-stack
credit, and a copyright notice that still read 2025. Both the Home blade and the achievement
tracker point people at that page, so it was worth more than static text.

It now carries the tab bar from the Xbox 360 Guide's Community pane: **About**, **System**,
**Roadmap**. The counts on the inactive tabs are the point of the original pattern (the Guide
let you see there were no messages waiting without opening the tab), so System carries the
version and Roadmap carries its open-item count. About stays a plain named tab because it has
no number worth reading.

The work also produced the repo's first reusable tabs primitive and retired a route-private
duplicate.

## What Was Built

### Components Created

- **`Tabs`** (`src/components/ui/Tabs/`)
  - Purpose: shared WAI-ARIA tabs primitive. The repo had none: `ScrollingMenu` implements
    the pattern correctly but is welded to the dashboard blade menu.
  - Props: `items`, `value`, `onChange`, `label` (required aria-label), `variant`
    (`guide` | `segmented`), `orientation`, `hoverSound`, `selectSound`, `className`,
    `listClassName`. Imperative handle: `TabsHandle` with `selectRelative(delta)` and
    `focusActive()`.
  - Compound: `Tabs.Panel` reads the id wiring from context, so consumers never invent
    `aria-controls` ids. Inactive panels render `null`.
  - Audio: `hover` on mouseenter, `panel` on select. Both overridable, both nullable.
  - Responsive: below 768px nothing collapses; every label stays visible and the bar
    scrolls.

- **`AboutView`** (`src/app/about/AboutView.tsx`) and three panels under
  `src/app/about/_panels/`.

### Data

- **`src/types/roadmap.ts`**, **`src/data/roadmap.ts`** — a curated public subset of the
  Linear backlog, grouped in progress / up next / someday / recently shipped.

## Files Changed

### Created

```
src/components/ui/Tabs/{Tabs.tsx,Tabs.module.css,Tabs.stories.tsx,index.ts}
src/constants/pageNavigation.ts
src/types/roadmap.ts
src/data/roadmap.ts
src/app/about/AboutView.tsx
src/app/about/About.module.css
src/app/about/_panels/{AboutPanel,SystemPanel,RoadmapPanel}.tsx
```

### Modified

```
src/app/about/page.tsx                  'use client' dropped; now the server loader
src/components/PageLayout/PageLayout.tsx  'page' literal -> PAGE_SCOPE_ID
src/context/GamepadContext.tsx          OR-merge restoreFocusOnPop
src/app/design-system/page.tsx          SegmentedControl -> ui/Tabs
src/app/design-system/DesignSystem.module.css  .navigationContainer simplified
```

### Deleted

```
src/app/design-system/_components/SegmentedControl/  (3 files)
```

## Decisions worth keeping

**`/changelog` stays its own route.** The System tab summarises (version, last updated,
release count, stack) and links out. It does not repeat the accordion: a changelog rendered
in two places diverges the first time one is edited.

**The roadmap is static, not fetched from Linear at build time.** A fetch would put an API
token in the deploy env, make the build depend on a private workspace being reachable, and
leak internal issue titles. The cost is drift, so `src/data/roadmap.ts` carries its own
maintenance rules in the file header: cap near ten entries, write themes rather than tickets,
prune shipped entries as they fall off CHANGELOG.md. Issue keys render as plain chips rather
than links, because `linear.app/s11o` is private and a link would land visitors on a login
wall.

**No `?tab=` URL state.** `useSearchParams()` would opt the route into dynamic rendering and
need a Suspense boundary, and tab history would fight PageLayout's B-closes-the-page model:
browser-back would mean "previous tab" while B means "close". If Roadmap ever deserves a
link, it should become its own route with real metadata.

## Input model

Three findings from the existing code shaped this, all verified rather than assumed:

1. **`registerScope` merges contributions by id, but the first registrant owns the entry's
   config.** `GamepadContext.tsx` built the entry only `if (!entry)`, reading
   `restoreFocusOnPop` from that first call. React commits child effects before parent
   effects, so a component inside `PageLayout.Body` registering `id: 'page'` would have
   created the entry with `restoreFocusOnPop: false` and silently dropped PageLayout's
   `true`. Two fixes: `AboutView` renders PageLayout rather than sitting inside it, and
   `registerScope` now OR-merges the flag so the next caller does not rediscover this.
2. **A roving tabindex hides inactive tabs from the d-pad, which is what we want.**
   `useSpatialNavigation`'s `isReachable` rejects `tabIndex < 0`. So LB and RB own tab
   switching (as in the real Guide) and d-pad left/right stay with spatial navigation, with
   no contention. Corollary: every panel needs a focusable element or d-pad `down`
   dead-ends, which is why `role="tabpanel"` carries `tabIndex={0}`.
3. **`dispatchIntent` searches only the top scope's contributions, newest-first.** No
   fall-through, so `pageLeft`/`pageRight` resolve to AboutView while everything else falls
   to PageLayout.

**No `useEffect`.** Every tab button stays mounted and only panels swap, so the target node
is live before React re-renders and focus moves synchronously inside the click and keydown
handlers. Keydown sits on the tab buttons rather than the tablist: with a roving tabindex
focus is always on a tab, and a focusable tablist would be a second tab stop for one widget.

## Verification

| Check | Result |
|---|---|
| `npm run typecheck` | pass |
| `npm run lint` | pass, no new warnings |
| `npm run lint:css` | **1296 → 1278 warnings**, 0 errors |
| `npm run lint:useeffect` | OK, 0 unapproved calls |
| `npm run build` | pass; `○ /about` still prerendered as static content |

Stylelint drops because the deleted SegmentedControl carried 18 warnings. Both new
stylesheets lint clean on their own.

Storybook stories cover both variants, a disabled tab, long labels, badges, and vertical
orientation.

## Known limitations

- **The roadmap will drift.** It is hand-maintained by design. If it has not been touched in
  two releases, the honest move is to delete the entries you no longer mean; a stale public
  roadmap is worse than none.
- **The design-system page changed loading behaviour.** Its five lazy chunks now load on
  first visit to each tab rather than all up front. This is what `lazy()` was for and the
  Suspense fallback already existed, but it is a real change on a page unrelated to /about.
- **Manual gamepad passes were not run** (no controller in the build environment). The LB/RB
  wiring is verified by reading the dispatch path, not by pressing buttons.
