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

## Read These First

This skill deliberately does **not** list token names or component props. Those change; the files
do not lie.

| Before you… | Read |
|---|---|
| Write any CSS | `src/app/design-tokens.css` — every token, grouped, with comments on *why* each exists |
| Add an interactive element | `src/components/ui/` — the primitives and their prop docs |
| Attach a sound | `AUDIO_FILES` in `src/hooks/useAudioManager.ts` — the only valid names |
| Style a selected/focused state | `src/context/GamepadContext.tsx` — sets `<html data-input>` |

```bash
grep -n '^\s*--' src/app/design-tokens.css     # every token name, current
```

Read the token file before styling, not after a lint failure. It is short and the comments carry
rationale you cannot infer from the values.

## The One Rule

**Every color, radius, shadow, duration, easing and z-index is `var(--*)`.** If the token you need
does not exist, add it to `src/app/design-tokens.css` with a comment on why, then consume it.

Stylelint enforces this. It reports warnings rather than errors, so it exits 0 either way: compare
the count before and after your change, do not trust the exit code.

```bash
npm run lint:css                     # full count, compare against pre-change count
npx stylelint 'src/components/Foo/**'  # fast, just what you touched
```

Boy-scout rule from `CLAUDE.md`: any line you touch that has a hardcoded color gets tokenized.

## Names That Do Not Exist

The dominant failure is inventing a plausible token instead of reading the file. These look right
and are wrong:

`--color-primary` · `--color-secondary` · `--color-background` · `--color-accent` ·
`--spacing-xs|sm|md|lg|xl` · `--radius-medium` · `--radius-large` · `--font-size-normal` ·
`--transition-default` · `--shadow-card`

The real names use different axes: colors are namespaced by role (`--color-bg-*`, `--color-text-*`,
`--color-border-*`, `--color-brand-*`), spacing is numeric on an 8px scale, and typography is
exposed as composite `font` shorthands rather than separate size and weight. Read the file.

## Things the Token File Cannot Tell You

- **Use the composite typography shorthands.** `font: var(--typography-h3)` rather than
  re-deriving a size and a weight. Re-deriving is how two headings drift apart.
- **Some colors are deliberately off-brand.** The token file marks them in comments ("NOT warning",
  "NOT error"). Achievements, CRT/terminal accents, recording indicators and the per-skin ramps for
  Media Player, Now Playing and the DOS-games CRT bezel are intentional. Do not normalize them to
  brand green.
- **Never write a numeric `z-index`.** The `--z-*` scale exists so stacking stays orderable.
- **Media queries use range syntax**, matching the token file: `@media (width <= 768px)`, not
  `(max-width: 768px)`. The mobile breakpoint is 768px in both CSS and JS.

## Reach for a Primitive First

`src/components/ui/` holds the shared interactive primitives. `Button` covers the full range of
dashboard chrome through its `variant` prop, and already handles audio feedback, `:focus-visible`,
disabled state and ARIA (`aria-pressed`, `aria-busy`, `aria-label` enforcement on icon-only). A
hand-rolled `<button>` silently drops all four, and most buttons in this codebase are hand-rolled.
Do not add to that number.

Read `Button.tsx` for the current prop list rather than guessing at variant names. Note that
`ui/index.ts` does not barrel every primitive; check the folder for the correct import path.

Controller glyphs are always Xbox glyphs (A/B/X/Y) regardless of connected hardware. The site is an
Xbox replica; that premise wins.

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

  /* spacing */
  padding: var(--spacing-4) var(--spacing-5);
  gap: var(--spacing-3);

  /* visual */
  background: var(--color-bg-panel);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);

  /* motion */
  transition: var(--transition-smooth);
}
```

## Motion

Timing rules live in `CLAUDE.md` (card transitions slow, hover normal, exits faster than
entrances, `transform-origin: center` for scaling). The durations and easings are tokens; there
are prebuilt `--transition-*` shorthands for the common cases.

**Every animated component must honor reduced motion.** Most currently do not, so assume the file
you are editing needs the block added:

```css
@media (prefers-reduced-motion: reduce) {
  .card {
    transition-duration: 0.01ms;
    animation: none;
  }
}
```

Framer Motion is available for orchestrated sequences. Gate it on `useReducedMotion()` and keep
its durations aligned with the token scale so CSS and JS stay in step.

## Focus and Selection

DOM focus is the single source of truth for selection. Never paint a highlight from a React
`selectedIndex`. `:focus-visible` does not reliably fire on programmatic `.focus()`, so style
gamepad selection off the input-mode attribute as well:

```css
.item:focus-visible,
:global(html[data-input='gamepad']) .item:focus {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}
```

Anything clickable must be reachable by Tab: `next/link` for routes, `<button>` for actions, never
a `tabIndex={0}` div.

## Anti-Patterns

- **Inventing a token name.** Grep the token file first.
- **`transition: all 0.3s ease`.** Literals are the single biggest source of lint warnings here.
- **Hand-rolling a button, toggle or tooltip.** Check `src/components/ui/` first.
- **Normalizing a deliberate off-brand color to brand green.** The comments say which are intentional.
- **A raw `hsl()`/`rgb()` in a `.module.css`.** Those belong only in the token file and `globals.css`.
- **Shipping an animation without a `prefers-reduced-motion` block.**

## Checklist

```
- [ ] Read design-tokens.css rather than guessing a var() name
- [ ] Reused a ui/ primitive, or documented why a new one was needed
- [ ] Every color, radius, shadow, duration, easing, z-index is var(--*)
- [ ] New tokens added to design-tokens.css with a comment on why
- [ ] Interactive elements have audio feedback and a visible focus style
- [ ] Animations honor prefers-reduced-motion
- [ ] npm run lint:css warning count did not increase
- [ ] npm run compile and npm run lint pass
```
