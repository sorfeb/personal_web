# Xbox 360-Style Toast Notification System

## Overview
A reusable toast notification component that displays in the lower third of the screen with Xbox 360-style animations. Features a circular badge area with optional crossfade animations and a pill-shaped content area.

## Features
- ✨ **Two notification types**: Achievement (with badge crossfade) and System (single icon)
- 🎨 **Status-coded ring colors**: Success, Info, Warning, Error, Default
- ⚡ **Smooth animations**: Entrance fade, badge crossfade, exit sequence
- 📱 **Fully responsive**: Optimized for desktop and mobile
- ♿ **Accessible**: ARIA roles, screen reader support, `prefers-reduced-motion`
- 🎯 **Global state management**: Context-based queue system (max 3 toasts)
- 🔧 **Type-safe**: Full TypeScript support

## Installation
No additional dependencies required - uses existing project stack.

## Basic Usage

### 1. Provider Setup (Already Done in `layout.tsx`)
```tsx
import { ToastProvider } from '@/context/ToastContext';
import ToastContainer from '@/components/ToastNotification/ToastContainer';

<ToastProvider>
  {children}
  <ToastContainer />
</ToastProvider>
```

### 2. Show Toasts with Hook
```tsx
import { useToast } from '@/hooks/useToast';

function MyComponent() {
  const { showToast } = useToast();

  const handleClick = () => {
    showToast({
      type: 'achievement',
      badge: {
        primaryIcon: '/assets/icons/dashboard/xbox-logo.svg',
        secondaryIcon: '/assets/icons/dashboard/trophy.svg',
        ringColor: 'success',
      },
      title: 'Achievement unlocked',
      subtitle: '15G – Village of Adanti',
      duration: 5000,
      showProgressBar: true,
    });
  };

  return <button onClick={handleClick}>Show Achievement</button>;
}
```

### 3. Using Helper Utilities (Recommended)
```tsx
import { useToast } from '@/hooks/useToast';
import { createAchievementToast, createSystemToast } from '@/utils/toastUtils';

function MyComponent() {
  const { showToast } = useToast();

  const handleAchievement = () => {
    showToast(
      createAchievementToast(
        'Achievement unlocked',
        '15G – Explorer Badge',
        '/assets/icons/dashboard/trophy.svg'
      )
    );
  };

  const handleSuccess = () => {
    showToast(createSystemToast('Profile updated', 'success'));
  };

  const handleError = () => {
    showToast(createSystemToast('Connection failed', 'error'));
  };

  return (
    <>
      <button onClick={handleAchievement}>Achievement</button>
      <button onClick={handleSuccess}>Success</button>
      <button onClick={handleError}>Error</button>
    </>
  );
}
```

## API Reference

### `showToast(config: ShowToastConfig): string`
Shows a new toast notification and returns its unique ID.

#### ShowToastConfig
```typescript
{
  type: 'achievement' | 'system';
  badge: {
    primaryIcon: string;           // Icon URL (always visible)
    secondaryIcon?: string;         // Achievement crossfade icon
    ringColor: 'success' | 'info' | 'warning' | 'error' | 'default';
    size?: number;                  // Badge diameter (default: 72px)
  };
  title: string;                    // Main notification text (max 50 chars)
  subtitle?: string;                // Secondary text (max 80 chars)
  duration?: number;                // Display time in ms (default: 4000)
  showProgressBar?: boolean;        // Show countdown bar (default: false)
  onDismiss?: () => void;          // Callback when dismissed
}
```

### `dismissToast(id: string): void`
Manually dismiss a toast by its ID (triggers exit animation).

### Helper Functions

#### `createAchievementToast(title, subtitle, icon, duration?)`
Creates an achievement toast configuration with crossfade animation.

#### `createSystemToast(message, status, icon?, duration?)`
Creates a system notification with status-appropriate icon and ring color.

**Status types**: `'success' | 'error' | 'info' | 'warning'`

#### `validateToastConfig(config)`
Sanitizes and validates toast configuration (enforces character limits, strips HTML).

## Ring Colors
| Color | Use Case | Gradient |
|-------|----------|----------|
| `success` | Achievements, success messages | Green (#4ade80 → #22c55e) |
| `info` | Information, updates | Blue (#60a5fa → #3b82f6) |
| `warning` | Warnings, alerts | Yellow (#fbbf24 → #f59e0b) |
| `error` | Errors, failures | Red (#f87171 → #ef4444) |
| `default` | Neutral notifications | Gray (#9ca3af → #6b7280) |

## Animation Sequence

### Entrance (250-300ms)
1. Fade in from 0% → 100% opacity
2. Badge and pill appear together

### Badge Crossfade (600-1000ms, achievements only)
1. Primary icon (e.g., Xbox logo) visible
2. Crossfade to secondary icon (e.g., trophy)
3. Crossfade back to primary
4. Cycle 1-2 times for emphasis

### Active Display (3-5s default)
- Static display with optional progress bar countdown

### Exit Sequence (400-500ms)
1. Badge ring expands outward and fades (200ms)
2. Title fades out (200ms)
3. Subtitle fades out with stagger (200ms + 100ms delay)
4. Pill collapses right-to-left (350ms)
5. Badge fades out (200ms)

## Responsive Behavior

### Desktop (>768px)
- Badge: 64-72px diameter
- Pill: 480-520px max width
- Font: Title 18px, Subtitle 14px
- Position: `bottom: 20vh`

### Mobile (≤768px)
- Badge: 56-60px diameter
- Pill: 90vw (max 380px)
- Font: Title 16px, Subtitle 13px
- Position: `bottom: 15vh`

## Accessibility

- **ARIA**: `<output>` element with `aria-live="polite"` and `aria-atomic="true"`
- **Screen readers**: Announces title and subtitle content
- **Reduced motion**: Respects `prefers-reduced-motion` setting (no animations)
- **Keyboard**: Focus management doesn't steal from main content

## Examples

### Achievement Unlock
```tsx
showToast({
  type: 'achievement',
  badge: {
    primaryIcon: '/assets/icons/dashboard/xbox-logo.svg',
    secondaryIcon: '/assets/icons/dashboard/trophy.svg',
    ringColor: 'success',
  },
  title: 'Achievement unlocked',
  subtitle: '15G – First Steps',
  duration: 5000,
  showProgressBar: true,
});
```

### System Success
```tsx
showToast({
  type: 'system',
  badge: {
    primaryIcon: '/assets/icons/dashboard/check-circle.svg',
    ringColor: 'success',
  },
  title: 'Settings saved',
  subtitle: 'Your preferences have been updated',
  duration: 3000,
});
```

### System Error
```tsx
showToast({
  type: 'system',
  badge: {
    primaryIcon: '/assets/icons/dashboard/error-circle.svg',
    ringColor: 'error',
  },
  title: 'Upload failed',
  subtitle: 'File size exceeds limit',
  duration: 4000,
});
```

## Storybook
View all variants and interactive examples:
```bash
npm run storybook
```

Navigate to **Components → ToastNotification** to see:
- Achievement unlocked
- System notifications (success, error, info, warning)
- Long text handling
- Progress bar variants
- Interactive demo with `useToast()` hook

## Performance Notes

- ✅ **GPU-accelerated**: Uses `transform` and `opacity` for smooth 60fps animations
- ✅ **Portal rendering**: Separate React tree prevents main app re-renders
- ✅ **CSS-based animations**: No JavaScript overhead per frame
- ✅ **Auto-cleanup**: Toasts removed from DOM after exit animation completes
- ✅ **Queue management**: Max 3 toasts (oldest dismissed when limit reached)

## Future Enhancements

- [ ] **Audio integration**: Achievement chime sound (placeholder added in `useAudioManager`)
- [ ] **Action buttons**: Optional CTA in pill area
- [ ] **Swipe to dismiss**: Touch gesture support
- [ ] **Queue animations**: Smooth repositioning when toasts dismiss
- [ ] **Custom animations**: Per-toast animation overrides
- [ ] **Persistent toasts**: Manual-dismiss-only option (`duration: 0`)

## Files Structure
```
src/
├── components/ToastNotification/
│   ├── ToastNotification.tsx             # Main component
│   ├── ToastNotification.module.css      # CSS animations
│   ├── ToastContainer.tsx                # Portal wrapper
│   ├── ToastContainer.module.css         # Container styles
│   ├── ToastNotification.stories.tsx     # Storybook examples
│   ├── types.ts                          # TypeScript interfaces
│   └── index.ts                          # Public exports
├── context/
│   └── ToastContext.tsx                  # Global state management
├── hooks/
│   └── useToast.ts                       # Convenience hook
└── utils/
    └── toastUtils.ts                     # Helper functions
```

## License
Part of personal_web project by sorfeb.
