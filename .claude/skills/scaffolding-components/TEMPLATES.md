# Component Templates

## Basic Interactive Component

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

const ComponentName = memo<ComponentNameProps>(({
  title,
  onClick,
  className,
}) => {
  const { playSound } = useAudioManager();

  const handleClick = () => {
    playSound('click');
    onClick?.();
  };

  const handleMouseEnter = () => {
    playSound('hover');
  };

  return (
    <div
      className={`${styles.container} ${className || ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      role="button"
      tabIndex={0}
    >
      <span className={styles.title}>{title}</span>
    </div>
  );
});

ComponentName.displayName = 'ComponentName';

export default ComponentName;
```

## CSS Module Template

```css
/* ComponentName.module.css */
.container {
  /* Layout */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  /* Dimensions */
  width: 100%;
  min-height: 48px;

  /* Spacing */
  padding: 1rem;

  /* Visual */
  background: var(--color-surface, #1a1a2e);
  border-radius: 8px;
  cursor: pointer;

  /* Transitions */
  transition: all 0.3s ease;
  transform-origin: center;
}

.container:hover {
  transform: scale(1.02);
  background: var(--color-surface-hover, #25253d);
}

.container:focus-visible {
  outline: 2px solid var(--color-primary, #00ff88);
  outline-offset: 2px;
}

.title {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text, #ffffff);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .container {
    padding: 0.75rem;
    min-height: 40px;
  }

  .title {
    font-size: 0.875rem;
  }
}
```

## Barrel Export

```ts
// index.ts
export { default } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';
```

## Storybook Story Template

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
        <div style={{ padding: '2rem', background: '#0f0f23' }}>
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
  args: {
    title: 'Default Title',
  },
};

export const LongTitle: Story = {
  args: {
    title: 'This is a very long title that might wrap',
  },
};

export const Interactive: Story = {
  args: {
    title: 'Click Me',
    onClick: () => alert('Clicked!'),
  },
};
```

## Navigation Component Template

```tsx
'use client';

import React, { memo } from 'react';
import { useNavigationSound } from '@/hooks/useNavigationSound';
import { useAudioManager } from '@/hooks/useAudioManager';
import styles from './NavComponent.module.css';

interface NavComponentProps {
  href: string;
  label: string;
}

const NavComponent = memo<NavComponentProps>(({ href, label }) => {
  const { navigateWithSound } = useNavigationSound();
  const { playSound } = useAudioManager();

  const handleClick = () => {
    navigateWithSound(href, 'navigation');
  };

  const handleMouseEnter = () => {
    playSound('hover');
  };

  return (
    <button
      className={styles.navButton}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
    >
      {label}
    </button>
  );
});

NavComponent.displayName = 'NavComponent';

export default NavComponent;
```