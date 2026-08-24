# Component Templates

Starting points, not finished code. Two standing rules apply to everything below:

1. **Do not copy a `var()` name out of this file into real CSS.** Read
   `src/app/design-tokens.css` and use what is actually there. Token names in a template go stale;
   the ones here are illustrative.
2. **Never write `var(--token, #fallback)`.** A hex fallback silently paints the wrong color when
   the token name is wrong, which is exactly when you want a visible failure.

## Basic Interactive Component

If the thing you are building is a button, stop and use `src/components/ui/Button` instead. It
already carries audio, focus-visible, disabled handling and ARIA. This template is for a composite
surface that is not a primitive.

```tsx
// ComponentName.tsx
'use client';

import React, { memo } from 'react';
import { useAudioManager } from '@/hooks/useAudioManager';
import styles from './ComponentName.module.css';

interface ComponentNameProps {
  /** Component title displayed to user */
  title: string;
  /** Optional click handler */
  onClick?: () => void;
  /** Optional CSS class override */
  className?: string;
}

const ComponentName = memo<ComponentNameProps>(({ title, onClick, className }) => {
  const { playSound } = useAudioManager();

  const handleClick = () => {
    playSound('click');
    onClick?.();
  };

  return (
    <button
      type="button"
      className={`${styles.container} ${className || ''}`}
      onClick={handleClick}
      onMouseEnter={() => playSound('hover')}
    >
      <span className={styles.title}>{title}</span>
    </button>
  );
});

ComponentName.displayName = 'ComponentName';

export default ComponentName;
```

Use the native element that already means what you mean. A `<div role="button" tabIndex={0}>`
reimplements, badly, what `<button>` gives free: Tab order, Enter and Space activation, and the
disabled state. Routes use `next/link`, not an onClick handler.

## CSS Module Template

Declaration order is layout, dimensions, spacing, visual, motion last.

```css
/* ComponentName.module.css */
.container {
  /* Layout */
  display: flex;
  align-items: center;
  position: relative;

  /* Dimensions */
  width: 100%;

  /* Spacing */
  padding: var(--spacing-4);

  /* Visual */
  background: var(--color-bg-panel);
  border: var(--border-width-thin) solid var(--color-border-primary);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  cursor: pointer;

  /* Motion */
  transition: var(--transition-smooth);
  transform-origin: center;
}

.container:hover {
  background: var(--color-bg-panel-hover);
}

.container:focus-visible,
:global(html[data-input='gamepad']) .container:focus {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.title {
  font: var(--typography-subtitle-2);
}

@media (width <= 768px) {
  .container {
    padding: var(--spacing-3);
  }
}

@media (prefers-reduced-motion: reduce) {
  .container {
    transition-duration: 0.01ms;
  }
}
```

Every value above is a token. If `npm run lint:css` reports more warnings after your component
than before it, something in here became a literal.

## Barrel Export

```ts
// index.ts
export { default } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';
```

## Storybook Story Template

Storybook is the only interactive harness in this repo; there is no test runner. Wrap in whichever
providers the component actually consumes.

```tsx
// ComponentName.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { VolumeProvider } from '@/context/VolumeContext';
import ComponentName from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  decorators: [
    (Story) => (
      <VolumeProvider>
        <div style={{ padding: 'var(--spacing-6)', background: 'var(--color-bg-primary)' }}>
          <Story />
        </div>
      </VolumeProvider>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

export const Default: Story = {
  args: { title: 'Example' },
};
```

Providers live in `src/context/`. Read that directory for what exists rather than assuming a
provider from another project is present here.

## Navigating Component

`navigateWithSound` plays the sound and routes. Do not stack a second `playSound` in front of it,
and do not delay it behind a `setTimeout`.

```tsx
'use client';

import React, { memo } from 'react';
import { useNavigationSound } from '@/hooks/useNavigationSound';
import { useAudioManager } from '@/hooks/useAudioManager';
import styles from './NavComponent.module.css';

const NavComponent = memo<{ href: string; label: string }>(({ href, label }) => {
  const { navigateWithSound } = useNavigationSound();
  const { playSound } = useAudioManager();

  return (
    <button
      type="button"
      className={styles.navButton}
      onClick={() => navigateWithSound(href, 'navigation')}
      onMouseEnter={() => playSound('hover')}
    >
      {label}
    </button>
  );
});

NavComponent.displayName = 'NavComponent';

export default NavComponent;
```

Prefer `next/link` when the destination is a plain route: it gives a crawlable internal link and
native middle-click and modifier-click behavior that an onClick handler does not.

## Modal or Dialog

A modal owns the top of the gamepad scope stack. Register it with `useGamepadScope` rather than
adding a `window.addEventListener('keydown')` handler, and do not gate behavior on
`document.querySelector('[role="dialog"]')`. A scope that does not handle an intent swallows it,
which is what silences the UI beneath the modal.

Sound names come from `AUDIO_FILES` in `src/hooks/useAudioManager.ts`. Read it; there is no
`'open'`, `'close'` or `'select'`.
