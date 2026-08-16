# Complete: Phase 1 — Focusability & Semantics
**Date**: 2026-08-16
**Status**: Complete
**Design record**: [Gamepad support — design record](https://linear.app/s11o/document/gamepad-support-design-record-ef7a734bbd2f) (Linear)
**Issue**: [SOR-132](https://linear.app/s11o/issue/SOR-132) (parent [SOR-131](https://linear.app/s11o/issue/SOR-131))
**Deferrals**: [SOR-136](https://linear.app/s11o/issue/SOR-136) WMPButton · [SOR-137](https://linear.app/s11o/issue/SOR-137) WMPSlider

## What was built

The first phase of gamepad support, which contains no gamepad code at all. Controller
navigation can only reach what a keyboard can already reach, so this phase makes the site
keyboard-navigable. It stands on its own as an accessibility and SEO improvement.

## Changes

### Homepage cards are real links
`XboxCard` was a `div` with `onClick` calling `router.push`. It is now `next/link`.

Beyond keyboard access this fixes a genuine SEO defect: **the homepage previously emitted no
crawlable internal links** to `/projects`, `/photos`, `/blog` and the rest. The sitemap listed
those routes, but internal linking is how crawl priority flows. Middle-click and ctrl-click
now work too.

Also removed dead `mousePosition` state that fired a React render on every `mousemove` while
discarding the value — the spotlight effect writes CSS custom properties through a ref.

### Blade menu is a tabs widget
`ScrollingMenu` became the WAI-ARIA tabs pattern — `role="tablist"`, `role="tab"`,
`aria-selected`, `aria-controls` — with a **roving tabindex** so the whole list is one tab stop
and arrows move within it. Blanket `tabIndex={0}` would have made eight tab stops and left
keyboard navigation worse than before.

The tab↔panel relationship crosses a component boundary, so ids are shared through
`src/constants/dashboardNavigation.ts` rather than props.

### Off-screen cards leave the tab order
`useCardNavigation` parks visited cards off-screen at `opacity: 0`. Invisible elements are
still tabbable, so making cards focusable would have created invisible tab stops. Cards behind
the current index now get `tabIndex={-1}` and `aria-hidden`.

### The a11y rules are now enforced
`next/core-web-vitals` ships `eslint-plugin-jsx-a11y` but leaves the interaction rules off,
which is how these accumulated silently. Four rules are now **errors** in `.eslintrc.json`.

This also corrected the estimate: the plan assumed ~40 clickable divs based on a crude grep.
The real number was **12**, because most `onClick`s were already on buttons.

| Site | Resolution |
|---|---|
| `ProfileCard` | → `<button>`; `h2`/`p` → `span` (a button may only contain phrasing content) |
| `WMPPlaylistDrawer` | `<li onClick>` → `<li><button>` with `aria-current` |
| `ui/Tooltip` | Added `onFocus`/`onBlur` so tooltips appear for keyboard users |
| `my-playlists` | Hover handler moved from wrapper div onto the button it wrapped |
| `BackgroundSelector`, `BladeNavigation`, `ChatWindow`, `GlobalWMPPlayer`, `LayerCarousel`, story backdrop | Pointer-only affordances (backdrop dismiss, drag handles, event containment) — documented suppressions; each has a keyboard path or nothing to activate |
| `WMPButton`, `WMPSlider` | Deferred to Phase 3, documented inline |

### Design tokens
Boy-scouted every CSS line touched. Added `--shadow-inset-medium`,
`--gradient-profile-card-hover`, and a `--color-wmp-*` group for the media player skin
(deliberately more saturated than the site brand, so not brand aliases).

## Files

```
Created:  src/constants/dashboardNavigation.ts
          .github/documentation/phase1-focusability-complete.md

Modified: .eslintrc.json
          src/app/design-tokens.css
          src/app/my-playlists/page.tsx
          src/components/XboxCard/card/XboxCard.tsx + .module.css
          src/components/ScrollingMenu/ScrollingMenu.tsx + .module.css
          src/components/XboxDashboard/XboxDashboard.tsx
          src/components/XboxDashboard/ResponsiveCardGrid/ResponsiveCardGrid.tsx
          src/components/ProfileCard/ProfileCard.tsx + .module.css
          src/components/WMPPlayer/WMPPlaylistDrawer.tsx + .module.css
          src/components/WMPPlayer/{WMPButton,WMPSlider,GlobalWMPPlayer}.tsx
          src/components/ui/Tooltip/Tooltip.tsx
          src/components/Chat/ChatWindow/ChatWindow.tsx
          src/components/BackgroundSelector/BackgroundSelector.tsx
          src/components/ProfileModal/components/BladeNavigation/BladeNavigation.tsx
          src/components/ProfileModal/.../LayerCarousel/LayerCarousel.tsx
          src/stories/useBodyScrollLock.stories.tsx
```

## Verification

| Check | Result |
|---|---|
| `tsc --noEmit` | Clean |
| `next lint` | **0 errors** (was 15 after enabling the a11y rules) |
| `lint:useeffect` | 0 unapproved calls |
| `lint:css` | Warnings **decreased** in every touched file: 56 → 32 |
| `next build` | Succeeds; all 21 routes prerender |

**Not yet verified:** an interactive browser keyboard pass. Correctness here was established
statically — lint rules, semantics, and tab-order reasoning — not by driving the UI. Before
Phase 2, tab through the homepage and confirm: one stop for the blade list, one per visible
card, none on off-screen cards, and a visible ring on each.

## Known limitations

- `WMPButton` and `WMPSlider` remain keyboard-inaccessible (deferred, documented inline)
- `WMPPlaylistDrawer` row transition moved 150ms → `--duration-fast` (200ms) to use a token
- Modal focus trapping is still absent; blades stay tab-reachable behind an open modal. This is
  Phase 3's scope stack, deliberately not patched here

## Next

Phase 2 — the input layer: `useGamepad` polling hook, `GamepadProvider` scope stack, the
`?gamepad=debug` overlay, and the `isAnimating` re-entry guard in `useCardNavigation`.
