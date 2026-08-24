---
name: developing-frontend
description: |
  Frontend development for Xbox 360-inspired portfolio using Next.js 15, React, CSS Modules, and audio integration.
  Use when building UI components, styling, animations, client-side logic, or when the user mentions
  "component", "UI", "frontend", "styling", "CSS", "animation", "responsive", or "audio feedback".
---

# Frontend Development

Specialized guidance for building Xbox 360-inspired React components with audio integration and responsive design.

## Critical Rules

1. **Audio Integration**: Every interactive element MUST have audio feedback
2. **CSS Modules Only**: Use `ComponentName.module.css` for all styling
3. **768px Breakpoint**: Mobile/desktop bifurcation at this breakpoint
4. **No Console Logs**: Use TypeScript error handling instead
5. **No Dev Server**: Never start unless explicitly requested

## Quick Start Pattern

```tsx
'use client';

import React, { memo } from 'react';
import { useAudioManager } from '@/hooks/useAudioManager';
import styles from './Component.module.css';

interface ComponentProps {
  /** Clear JSDoc description */
  title: string;
}

const Component = memo<ComponentProps>(({ title }) => {
  const { playSound } = useAudioManager();

  const handleClick = () => {
    playSound('click');
    // Implementation
  };

  return (
    <div className={styles.container} onClick={handleClick}>
      {title}
    </div>
  );
});

export default Component;
```

## Sound Types

Available sounds: `hover`, `click`, `navigation`, `back`, `panel`, `panelLeft`, `ting`, `owawa`, `divine`, `unfold`, `channelUp`, `channelDown`, `swing`, `achievement`

## Navigation with Sound

```tsx
import { useNavigationSound } from '@/hooks/useNavigationSound';

const { navigateWithSound } = useNavigationSound();
navigateWithSound('/path', 'navigation');
```

## CSS Conventions

Styling rules live in the **`styling-ui` skill** — load it before writing any `.module.css`.
The short version: declaration order is layout, dimensions, spacing, visual, motion last, and
every color, radius, shadow, duration, easing and z-index is a `var(--*)` token from
`src/app/design-tokens.css`.

```css
.container {
  /* layout */
  display: flex;
  position: relative;

  /* dimensions */
  width: 100%;

  /* spacing */
  padding: var(--spacing-4);

  /* visual */
  background: var(--color-bg-panel);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);

  /* motion */
  transition: var(--transition-normal);
}

@media (width <= 768px) {
  .container { padding: var(--spacing-2); }
}
```

## Reference Files

- **Tokens, primitives, motion, focus**: load the `styling-ui` skill
- **Component patterns**: See [PATTERNS.md](PATTERNS.md)
- **Animation timing**: See [ANIMATIONS.md](ANIMATIONS.md)
- **Context providers**: See [CONTEXTS.md](CONTEXTS.md)

## Pre-Completion Checklist

```
- [ ] Audio feedback on all interactive elements
- [ ] Responsive design at 768px breakpoint
- [ ] CSS Modules with descriptive class names, design tokens not literals
- [ ] `npm run lint:css` warning count did not increase
- [ ] No console.log statements
- [ ] TypeScript compiles (`npm run compile`)
- [ ] Storybook story (if major component)
```