---
name: styling-ui
description: |
  Style and design personal_web UI using design tokens, the ui/ primitives, CSS Modules, and the
  Xbox 360 dashboard visual language. Use when writing or editing any .module.css, adding a button,
  modal, panel, toast or card, picking colors, radii, shadows, spacing or animation timing, or when
  the user mentions "styling", "CSS", "design token", "theme", "hover state", "animation", "focus",
  or "make it look".
---

# Styling personal_web UI

The site is an Xbox 360 dashboard replica: dark, glossy, green-accented, operated by mouse, touch,
keyboard **and gamepad**. Visual values live in tokens. Interactive behavior lives in `ui/`
primitives. Neither belongs inline in a feature component.

## Canonical References

| Concern | File |
|---|---|
| Token source of truth | `src/app/design-tokens.css` |
| Global resets, shared utilities | `src/app/globals.css` |
| Token enforcement rules | `.stylelintrc.json` |
| Button primitive + variants | `src/components/ui/Button/Button.tsx`, `Button.module.css` |
| Other primitives | `src/components/ui/{Toggle,Tooltip,Clock}/` |
| Sound names | `AUDIO_FILES` in `src/hooks/useAudioManager.ts` |
| Input mode attribute | `src/context/GamepadContext.tsx` sets `<html data-input>` |

Read the token file before styling. It is 378 lines and heavily commented, including *why* a token
exists (see `--gradient-art-scrim`, `--color-wmp-accent`, `--np-*`).

## The One Rule

**Every color, radius, shadow, duration, easing and z-index is `var(--*)`.** If the token you need
does not exist, add it to `src/app/design-tokens.css` first, then consume it. A literal in a
`.module.css` file is a stylelint warning, and `npm run lint:css` warnings must not increase.

Current baseline: **1,296 warnings**, 751 of them raw `rgb()`/`hsl()` calls. Boy-scout rule from
`CLAUDE.md` applies: any line you touch that has a hardcoded color gets tokenized.

```bash
npm run lint:css                     # full count, compare against baseline
npx stylelint src/components/Foo/**  # just what you touched
```

## Token Map

Names are exact. Guessing a token name is the single most common failure: there is no
`--color-primary`, no `--spacing-md`, no `--radius-medium`.

**Color**
- Brand green: `--color-brand-primary`, `-dark`, `-light`, `-lighter`, `-darker`, `--color-brand-glow`
  (all derived from `--color-brand-hue: 95` / `--color-brand-saturation: 62%`)
- Surfaces: `--color-bg-primary|secondary|tertiary|overlay|card|card-hover|subtle|hover|panel|panel-raised|panel-hover`
- Text: `--color-text-primary|secondary|tertiary|muted|disabled|inverse`
- Borders: `--color-border-primary|secondary|strong|focus|error`
- Semantic: `--color-success|error|error-bg|error-border|warning|info`
- Deliberate non-brand hues (do **not** replace with brand green):
  `--color-terminal-green` (CRT dots/clock), `--color-xbox-green` (official #107c10),
  `--color-gold` (achievements, *not* warning), `--color-accent-blue`,
  `--color-status-recording` (live dot, *not* error)
- Skin-local ramps that are intentionally off-brand: `--color-wmp-*` (Media Player),
  `--np-*` (Now Playing, the app's one light surface), `--tv-*` (DOS games CRT bezel)

**Type** — use the composite `font` shorthand tokens, not individual size/weight:
`--typography-display-1|2`, `-h1`..`-h6`, `-body-1|2|large`, `-subtitle-1|2`, `-button`,
`-caption`, `-overline`, `-label`, `-code`, `-code-inline`.

```css
.title { font: var(--typography-h3); }   /* correct */
.title { font-size: var(--font-size-xl); font-weight: 600; }  /* avoid: re-derives a token */
```

**Space / shape** — `--spacing-0..16` (8px scale, `--spacing-2` is the base unit),
`--radius-sm|base|md|lg|xl|full`, `--border-width-thin|medium|thick`.

**Depth** — `--shadow-xs|sm|base|md|lg|xl|2xl`, plus `--shadow-inset-light|medium|heavy`,
`--shadow-glow-green`, `--shadow-glow-green-hover`, `--shadow-text`, `--shadow-drop`.

**Motion** — `--duration-instant|fast|normal|slow|slower`,
`--ease-linear|in|out|in-out|smooth|bounce|sharp`, and the prebuilt
`--transition-fast|normal|smooth|color|transform|opacity`.

**Layering** — `--z-base|dropdown|sticky|overlay|modal|popover|tooltip|notification|max`.
Never write a numeric `z-index`.

**Effects** — `--blur-sm|base|md|lg|xl`, `--backdrop-blur`, `--backdrop-filter-glass`.

## Reach for a Primitive First

There are **85 hand-rolled `<button>` elements** in `src/` and only 3 files import the primitive.
Do not add to that number.

```tsx
import Button from '@/components/ui/Button';   // default export, NOT from '@/components/ui'
```

`ui/index.ts` only barrels `Tooltip` and `Clock`; `Button` and `Toggle` import from their folder.

```tsx
<Button variant="chrome" badge="A" onClick={onConfirm}>Confirm</Button>
<Button variant="metallic" size="sm" icon={<Play />} iconOnly aria-label="Play" />
<Button variant="ghost" clickSound="back" onClick={onDismiss}>Cancel</Button>
```

| Prop | Values |
|---|---|
| `variant` | `chrome` (controller-chrome row), `metallic` (WMP bevel), `glass`, `ghost`, `solid` (default), `danger` |
| `size` | `sm` \| `md` \| `lg` |
| `shape` | `rect` \| `pill` \| `circle` |
| `badge` | `A` \| `B` \| `X` \| `Y` — always Xbox glyphs regardless of connected hardware |
| `icon` / `iconPosition` / `iconOnly` | `iconOnly` requires `aria-label` |
| `loading` / `active` / `glow` / `fullWidth` | `active` emits `aria-pressed`, `loading` emits `aria-busy` |
| `hoverSound` / `clickSound` | `SoundType` or `null` to silence; `chrome` defaults hover to `owawa` |

The primitive already handles audio feedback, `:focus-visible`, disabled state and ARIA. A
hand-rolled button silently drops all four.

**Valid sound names** (from `AUDIO_FILES`, nothing else exists):
`hover`, `click`, `navigation`, `back`, `panel`, `panelLeft`, `ting`, `owawa`, `divine`,
`unfold`, `channelUp`, `channelDown`, `swing`, `achievement`.

## CSS Module Conventions

Declaration order: layout, dimensions, spacing, visual, motion last.

```css
.panel {
  /* layout */
  display: flex;
  position: relative;
  z-index: var(--z-overlay);

  /* dimensions */
  width: 100%;
  max-width: 42rem;

  /* spacing */
  padding: var(--spacing-4) var(--spacing-5);
  gap: var(--spacing-3);

  /* visual */
  background: var(--color-bg-panel);
  border: var(--border-width-thin) solid var(--color-border-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  color: var(--color-text-primary);

  /* motion */
  transition: var(--transition-smooth);
}

.panel:hover {
  background: var(--color-bg-panel-hover);
  transition: background var(--duration-normal) var(--ease-in-out);
}
```

Media queries use range syntax, matching `design-tokens.css`:

```css
@media (width <= 768px) { ... }   /* correct */
@media (max-width: 768px) { ... } /* legacy, do not add new ones */
```

The mobile breakpoint is 768px in both CSS and JS (`window.innerWidth <= 768`).

## Motion

Per `CLAUDE.md`: card transitions `--duration-slow`, hover states `--duration-normal`,
transform origin `center` for scaling, and **exits animate faster than entrances**
(`--duration-fast` out, `--duration-normal` in).

**Every animated component must honor reduced motion.** Only 19 of 88 `.module.css` files
currently do, and there are 79 hardcoded transition timings left in the codebase.

```css
@media (prefers-reduced-motion: reduce) {
  .card,
  .card::after {
    transition-duration: 0.01ms;
    animation: none;
  }
}
```

Framer Motion is available for orchestrated sequences. Drive its `duration` from the token scale
(`0.3` for `--duration-normal`, `0.5` for `--duration-slow`) so CSS and JS stay in step, and gate
it on `useReducedMotion()` from `framer-motion`.

## Focus and Selection

DOM focus is the single source of truth for selection. Never paint a highlight from a React
`selectedIndex`. Style selection off the input-mode attribute, because `:focus-visible` does not
reliably fire on programmatic `.focus()`:

```css
.item:focus-visible,
:global(html[data-input='gamepad']) .item:focus {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}
```

18 files use `:focus-visible` today. Anything clickable must be reachable by Tab; use `next/link`
for routes and `<button>` for actions rather than a `tabIndex={0}` div.

## Anti-Patterns

- **Do not invent token names.** `--color-primary`, `--spacing-md`, `--radius-medium` do not exist.
  Grep `design-tokens.css` before typing a `var()`.
- **Do not write `transition: all 0.3s ease`.** Use `var(--transition-normal)` or an explicit
  property with `var(--duration-*) var(--ease-*)`.
- **Do not hand-roll a button, toggle or tooltip.** Check `src/components/ui/` first.
- **Do not swap a deliberate off-brand color for brand green.** `--color-gold`,
  `--color-terminal-green`, `--color-status-recording` and the `--color-wmp-*` / `--np-*` / `--tv-*`
  ramps are intentional; the token file says so in comments.
- **Do not add a raw `hsl()`/`rgb()` to a `.module.css`.** Those functions are allowed only in
  `design-tokens.css` and `globals.css` (stylelint `overrides`).
- **Do not use a numeric `z-index`.** The `--z-*` scale exists so stacking stays orderable.
- **Do not ship an animation without a `prefers-reduced-motion` block.**
- **Do not add a `.module.css` line with a hardcoded color to a file you are already editing.**
  Boy-scout rule: tokenize the lines you touch.

## Checklist

```
- [ ] Reused a ui/ primitive, or documented why a new one was needed
- [ ] Every color, radius, shadow, duration, easing, z-index is var(--*)
- [ ] New tokens (if any) added to design-tokens.css with a comment on why
- [ ] Typography uses a --typography-* shorthand, not re-derived size + weight
- [ ] Interactive elements have audio feedback and a visible focus style
- [ ] Animations honor prefers-reduced-motion; exits faster than entrances
- [ ] Responsive at 768px using (width <= 768px) range syntax
- [ ] npm run lint:css warning count did not increase
- [ ] npm run compile and npm run lint pass
```
