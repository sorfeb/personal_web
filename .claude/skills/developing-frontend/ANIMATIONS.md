# Animation Standards

## Timing Constants

| Animation Type | Duration | Easing |
|---------------|----------|--------|
| Card transitions | 0.5s | ease |
| Hover states | 0.3s | ease |
| Panel slides | 0.5s | ease |
| Micro-interactions | 0.15s | ease-out |

## Transform Origin

Always set `transform-origin: center` for scaling animations.

## CSS Transitions

```css
/* Major transitions */
.card {
  transition: all 0.5s ease;
  transform-origin: center;
}

/* Hover states */
.card:hover {
  transform: scale(1.05);
  transition: all 0.3s ease;
}
```

## Framer Motion Usage

Use for complex, orchestrated animations:

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: 'easeOut' }}
>
  Content
</motion.div>
```

## Xbox Dashboard Animation Logic

- Gap between cards: 250px (desktop)
- Animation factor: 0.78 decrement
- Timing: 100ms state updates, 500ms animations
- Z-index recalculation during transitions

## Audio-Animation Coordination

```tsx
const handleCardClick = useCallback(() => {
  playSound('select');
  // Wait for sound before animation
  setTimeout(() => {
    setAnimating(true);
  }, 50);
}, [playSound]);
```