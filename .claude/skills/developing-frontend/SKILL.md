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

```css
.container {
  /* Layout first */
  display: flex;
  position: relative;

  /* Dimensions */
  width: 100%;

  /* Spacing */
  padding: 1rem;

  /* Visual */
  background: var(--color-primary);

  /* Transitions last - 0.3s for hover, 0.5s for major */
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .container { padding: 0.5rem; }
}
```

## Reference Files

- **Component patterns**: See [PATTERNS.md](PATTERNS.md)
- **Animation timing**: See [ANIMATIONS.md](ANIMATIONS.md)
- **Context providers**: See [CONTEXTS.md](CONTEXTS.md)

## Pre-Completion Checklist

```
- [ ] Audio feedback on all interactive elements
- [ ] Responsive design at 768px breakpoint
- [ ] CSS Modules with descriptive class names
- [ ] No console.log statements
- [ ] TypeScript compiles (`npm run compile`)
- [ ] Storybook story (if major component)
```