# Animation Standards

Timing values are tokens, never literals. Full token list and the reduced-motion requirement live
in the `styling-ui` skill; this file covers the dashboard-specific motion logic.

## Timing

| Animation type | Token | Value |
|---|---|---|
| Card transitions, panel slides | `--duration-slow` | 500ms |
| Hover states | `--duration-normal` | 300ms |
| Exit / dismiss | `--duration-fast` | 200ms |
| Micro-interactions | `--duration-instant` | 100ms |

Exits animate faster than entrances: `--duration-fast` out, `--duration-normal` in.

Easing tokens: `--ease-linear|in|out|in-out|smooth|bounce|sharp`. Prefer `--ease-smooth` for
dashboard chrome and `--ease-sharp` for anything that needs to feel mechanical.

## Transform Origin

Always set `transform-origin: center` for scaling animations.

## CSS Transitions

```css
.card {
  transform-origin: center;
  transition: transform var(--duration-slow) var(--ease-smooth);
}

.card:hover {
  transform: scale(1.05);
  transition: transform var(--duration-normal) var(--ease-smooth);
}

@media (prefers-reduced-motion: reduce) {
  .card,
  .card:hover {
    transition-duration: 0.01ms;
    transform: none;
  }
}
```

The `--transition-*` shorthands (`fast`, `normal`, `smooth`, `color`, `transform`, `opacity`)
cover most cases. Reach for explicit `property duration easing` when you need to animate one
property and leave others alone.

## Framer Motion Usage

For complex, orchestrated sequences. Keep durations aligned with the token scale and gate on the
user's motion preference.

```tsx
import { motion, useReducedMotion } from 'framer-motion';

const reduce = useReducedMotion();

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: reduce ? 0 : 0.5, ease: 'easeOut' }}  /* 0.5 == --duration-slow */
>
  Content
</motion.div>
```

## Xbox Dashboard Animation Logic

Driven by component tokens in `design-tokens.css`, not magic numbers:

- `--card-animation-initial-gap: 250px` — gap between stacked cards (desktop)
- `--card-animation-decrement-factor: 0.78` — per-card falloff
- `--menu-transform-z-default|hover|selected` — ScrollingMenu depth (50/75/100px)
- `--menu-perspective: 1000px`
- Z-index recalculates during transitions; use the `--z-*` scale, never numeric literals

## Audio-Animation Coordination

Sound fires on the interaction, animation follows. Valid sound names come from `AUDIO_FILES` in
`src/hooks/useAudioManager.ts`: `hover`, `click`, `navigation`, `back`, `panel`, `panelLeft`,
`ting`, `owawa`, `divine`, `unfold`, `channelUp`, `channelDown`, `swing`, `achievement`.

```tsx
const handleCardClick = useCallback(() => {
  playSound('click');
  setAnimating(true);
}, [playSound]);
```

Do not `setTimeout` between the sound and the animation. The audio pool pre-creates three elements
per sound specifically so playback has no latency to wait out.
