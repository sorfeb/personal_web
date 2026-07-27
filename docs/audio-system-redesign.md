# Audio System Redesign

## Problem

The current `useAudioManager` hook is imported into dozens of components, tightly coupling audio feedback to UI logic. Every component that plays a sound must:

1. Be a client component
2. Import and call the hook
3. Manually wire `playSound` to event handlers

This creates a wide dependency surface and prevents components from being server components.

## Recommendation

Replace per-component `useAudioManager` usage with a **declarative, attribute-based approach** using a single global event listener.

### Current Pattern (avoid)

```tsx
'use client';
import { useAudioManager } from '../../hooks/useAudioManager';

export function MenuItem({ label }: { label: string }) {
  const { playSound } = useAudioManager();
  return (
    <button
      onMouseEnter={() => playSound('hover')}
      onClick={() => playSound('click')}
    >
      {label}
    </button>
  );
}
```

### Recommended Pattern

```tsx
// Component — can be a server component now
export function MenuItem({ label }: { label: string }) {
  return (
    <button data-sound-hover="hover" data-sound-click="click">
      {label}
    </button>
  );
}
```

```tsx
// Single global listener — mounted once at the root
'use client';

import { useEffect } from 'react';
import { useAudioManager } from '../hooks/useAudioManager';

export function GlobalSoundProvider({ children }: { children: React.ReactNode }) {
  const { playSound } = useAudioManager();

  useEffect(() => {
    const handleMouseEnter = (e: Event) => {
      const target = (e.target as HTMLElement).closest('[data-sound-hover]');
      if (target) {
        const sound = target.getAttribute('data-sound-hover');
        if (sound) playSound(sound);
      }
    };

    const handleClick = (e: Event) => {
      const target = (e.target as HTMLElement).closest('[data-sound-click]');
      if (target) {
        const sound = target.getAttribute('data-sound-click');
        if (sound) playSound(sound);
      }
    };

    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('click', handleClick, true);
    };
  }, [playSound]);

  return children;
}
```

## Benefits

- Components no longer need `'use client'` just for audio
- Audio behavior is declarative and visible in markup
- Single place to modify audio logic (volume, muting, new event types)
- The existing audio pooling system (`useAudioManager`) stays unchanged — only the wiring changes

## Migration Strategy

1. Create `GlobalSoundProvider` and mount it in the root layout
2. Migrate one page at a time: replace `playSound` calls with `data-sound-*` attributes
3. Remove `useAudioManager` imports from migrated components
4. Keep `useAudioManager` available for edge cases that need imperative control (e.g., playing sound on data fetch completion)
