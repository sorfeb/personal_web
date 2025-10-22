# Feature: Xbox 360-Style Toast Notification System
**Date**: 2025-10-22
**Status**: ✅ Completed (Implementation finished - ready for testing)
**Agent**: Frontend

## Objective
Create a reusable Xbox 360-style toast notification component that displays in the lower third of the screen. The notification features a circular badge area (left) with crossfade animations and a pill-shaped content area (right) with title/subtitle text. This will be used for system notifications and achievement unlocks with immersive animations matching the Xbox dashboard aesthetic.

## Technical Approach

### Component Architecture
```
ToastNotification/
├── ToastNotification.tsx          # Main component with animation orchestration
├── ToastNotification.module.css   # Scoped styles with keyframe animations
├── ToastNotification.stories.tsx  # Storybook examples (both notification types)
└── types.ts                       # TypeScript interfaces
```

### Core Technologies
- **React 18**: Client component with `useState`, `useEffect` for animation timing
- **CSS Modules**: Scoped styles with CSS keyframes for smooth animations
- **Framer Motion** (optional): Consider for complex orchestration, but CSS may suffice
- **Audio Integration**: `useAudioManager` hook for entrance chime (new sound to be added later)
- **TypeScript**: Strict typing for toast variants and props

### Data Flow
```typescript
// Global toast management
ToastContext (new) → manages toast queue
  ├── showToast(config) → adds to queue
  ├── dismissToast(id) → triggers exit animation
  └── ToastContainer → renders active toasts

// Component structure
<ToastContainer>
  <ToastNotification
    type="achievement" | "system"
    badge={{ primary, secondary, ringColor }}
    title="Achievement unlocked"
    subtitle="15G – Village of Adanti"
    duration={4000}
  />
</ToastContainer>
```

## Implementation Steps

### Phase 1: Core Component Structure
1. **Create component files** (`src/components/ToastNotification/`)
   - `ToastNotification.tsx` - Main component
   - `ToastNotification.module.css` - Styles
   - `types.ts` - TypeScript interfaces
   
2. **Define TypeScript interfaces** (`types.ts`)
   ```typescript
   interface BadgeConfig {
     primaryIcon: string;      // Main logo/icon
     secondaryIcon?: string;   // Achievement icon for crossfade
     ringColor: 'success' | 'info' | 'warning' | 'error' | 'default';
     size?: number;            // 56-72px, responsive
   }
   
   interface ToastConfig {
     id: string;
     type: 'achievement' | 'system';
     badge: BadgeConfig;
     title: string;
     subtitle?: string;
     duration?: number;        // Default 4000ms
     showProgressBar?: boolean;
     onDismiss?: () => void;
   }
   ```

3. **Build static layout** (`ToastNotification.tsx`)
   - Wrapper container (positioned in lower third, horizontally centered)
   - Badge area (circular, 56-72px, overlaps left edge)
   - Content pill (rounded, dark semi-transparent background)
   - Text stack (title + subtitle with proper spacing)
   - Optional progress bar at bottom edge

### Phase 2: Styling & Visual Design
4. **Implement CSS Module** (`ToastNotification.module.css`)
   - **Badge styling**:
     - Circular shape with `border-radius: 50%`
     - Configurable ring colors (green/blue/yellow/red/default)
     - Bevel effect: `box-shadow: inset 0 2px 4px rgba(255,255,255,0.3)`
     - Outer glow: `box-shadow: 0 4px 12px rgba(0,0,0,0.4)`
     - `z-index: 2` to overlap pill edge
   
   - **Content pill styling**:
     - `border-radius: 12-16px`
     - Background: `rgba(31, 35, 40, 0.9)` (dark graphite, 90% opacity)
     - Top highlight: `linear-gradient(to bottom, rgba(255,255,255,0.08), transparent)`
     - Max width: `420-520px`, auto height
     - Padding: `16px 20px 16px 48px` (left padding accounts for badge overlap)
   
   - **Typography**:
     - Title: `font-weight: 600; font-size: 16-18px; color: rgba(255,255,255,0.95);`
     - Subtitle: `font-size: 13-14px; color: rgba(255,255,255,0.7);`
     - Line spacing: `6-8px`
   
   - **Positioning**:
     - Fixed position, lower third: `bottom: 20vh; left: 50%; transform: translateX(-50%);`
     - Responsive adjustments for mobile (smaller badge, shorter pill)

5. **Progress bar component** (optional)
   - Thin bar (2-3px) along bottom edge of pill
   - CSS animation: `width: 100% → 0%` over toast duration
   - Subtle gradient matching ring color

### Phase 3: Animation Implementation
6. **CSS Keyframe animations** (`ToastNotification.module.css`)
   ```css
   /* Entrance: fade in */
   @keyframes fadeIn {
     from { opacity: 0; }
     to { opacity: 1; }
   }
   
   /* Badge crossfade: cycle between icons */
   @keyframes badgeCrossfade {
     0%, 100% { opacity: 1; }
     45%, 55% { opacity: 0; }
   }
   
   /* Exit: ring expansion */
   @keyframes ringExpand {
     to {
       transform: scale(1.3);
       opacity: 0;
     }
   }
   
   /* Exit: pill collapse right-to-left */
   @keyframes pillCollapse {
     to {
       width: 0;
       padding: 0;
       opacity: 0;
     }
   }
   ```

7. **Animation orchestration** (`ToastNotification.tsx`)
   - Use `useState` for animation phase tracking:
     ```typescript
     type Phase = 'entering' | 'badge-crossfade' | 'active' | 'exiting';
     const [phase, setPhase] = useState<Phase>('entering');
     ```
   
   - **Entrance sequence** (`useEffect`):
     - Apply `fadeIn` animation (250ms)
     - Trigger badge crossfade after entrance completes
   
   - **Badge crossfade cycle**:
     - Swap `primaryIcon` ↔ `secondaryIcon` with opacity crossfade
     - Cycle 1-2 times (600-1000ms total)
     - Use dual `<img>` elements with staggered opacity
   
   - **Exit sequence** (triggered by timeout or manual dismiss):
     - Ring expansion animation (200ms)
     - Staggered text fade: title then subtitle (100ms gap)
     - Pill collapse animation (300ms)
     - Badge fade out (200ms)
     - Call `onDismiss` callback when complete

### Phase 4: Global State Management
8. **Create Toast Context** (`src/context/ToastContext.tsx`)
   ```typescript
   interface ToastContextValue {
     showToast: (config: Omit<ToastConfig, 'id'>) => string;
     dismissToast: (id: string) => void;
     toasts: ToastConfig[];
   }
   ```
   
   - Queue-based system (max 3 toasts visible)
   - Auto-dismiss after duration
   - Z-index stacking for multiple toasts (unlikely but handled)

9. **Create Toast Container** (`src/components/ToastNotification/ToastContainer.tsx`)
   - Renders all active toasts from context
   - Portal-based rendering using `ReactDOM.createPortal`
   - Position stacking (if multiple toasts, offset vertically by 120px)

### Phase 5: Integration & Utilities
10. **Add utility functions** (`src/utils/toastUtils.ts`)
    ```typescript
    // Helper to show achievement toast
    export const showAchievement = (title: string, subtitle: string, icon: string) => {
      // Uses context to show toast with achievement preset
    };
    
    // Helper to show system notification
    export const showSystemNotification = (message: string, status: 'success' | 'error' | 'info') => {
      // Uses context with system preset
    };
    ```

11. **Update global layout** (`src/app/layout.tsx`)
    - Wrap with `ToastProvider` context
    - Ensure it's inside `VolumeProvider` for audio integration

12. **Audio integration placeholder**
    - Add comment in `useAudioManager.ts` for future chime sound
    - Document sound file naming convention: `achievement-chime.wav` or similar
    - Hook up `playSound('achievement')` when new sound is added

### Phase 6: Storybook & Testing
13. **Create Storybook stories** (`ToastNotification.stories.tsx`)
    - **Story 1**: Achievement unlock (with badge crossfade)
    - **Story 2**: System notification (success)
    - **Story 3**: System notification (error)
    - **Story 4**: Long text stress test
    - **Story 5**: Mobile responsive view
    - Controls for: title, subtitle, badge icons, ring color, duration

14. **Component testing checklist**
    - [ ] Entrance animation (250ms fade-in)
    - [ ] Badge crossfade cycle (1-2 times)
    - [ ] Text rendering (title + subtitle)
    - [ ] Exit sequence (ring expand → text fade → pill collapse → badge fade)
    - [ ] Progress bar countdown (if enabled)
    - [ ] Multiple toasts stacking (offset correctly)
    - [ ] Responsive behavior (768px breakpoint)
    - [ ] Manual dismiss functionality
    - [ ] Queue system (max 3 toasts)

## Component API Design

### Basic Usage
```tsx
// Via context hook
const { showToast } = useToast();

showToast({
  type: 'achievement',
  badge: {
    primaryIcon: '/assets/icons/xbox-logo.svg',
    secondaryIcon: '/assets/icons/trophy.svg',
    ringColor: 'success',
  },
  title: 'Achievement unlocked',
  subtitle: '15G – Village of Adanti',
  duration: 4000,
});

// Via utility
showAchievement(
  'Achievement unlocked',
  '15G – Village of Adanti',
  '/assets/icons/trophy.svg'
);
```

### Standalone Component (for Storybook)
```tsx
<ToastNotification
  type="achievement"
  badge={{
    primaryIcon: '/assets/icons/xbox-logo.svg',
    secondaryIcon: '/assets/icons/trophy.svg',
    ringColor: 'success',
  }}
  title="Achievement unlocked"
  subtitle="15G – Village of Adanti"
  duration={4000}
  onDismiss={() => console.log('Toast dismissed')}
/>
```

## Responsive Behavior

### Desktop (>768px)
- Badge: 64-72px diameter
- Pill max-width: 480-520px
- Font sizes: Title 18px, Subtitle 14px
- Position: `bottom: 20vh`

### Mobile (≤768px)
- Badge: 56-60px diameter
- Pill max-width: 90vw (max 380px)
- Font sizes: Title 16px, Subtitle 13px
- Position: `bottom: 15vh`
- Reduced padding: 12px horizontal

## Accessibility Considerations
- **ARIA roles**: `role="alert"` for system notifications, `role="status"` for achievements
- **Screen reader**: Announce title + subtitle, respect `prefers-reduced-motion`
- **Keyboard**: Manual dismiss with Escape key (if focused)
- **Focus management**: Don't steal focus, but allow tab to interactive elements (if any)

## Performance Considerations
- **CSS-based animations**: Prefer CSS keyframes over JS for better performance
- **GPU acceleration**: Use `transform` and `opacity` (not `width`/`height` where avoidable)
- **Portal rendering**: Separate React tree prevents re-renders of main app
- **Cleanup**: Remove toast from DOM after exit animation completes
- **Image optimization**: Use Next.js `Image` component for badge icons with proper sizes

## Animation Timing Summary
| Phase | Duration | Description |
|-------|----------|-------------|
| Entrance | 250-300ms | Fade in (badge + pill) |
| Badge crossfade | 600-1000ms | Icon swap cycle (1-2 times) |
| Active display | 3000-5000ms | Static display (default 4000ms) |
| Exit - Ring expand | 200ms | Badge ring scales & fades |
| Exit - Text fade | 300ms | Title → Subtitle staggered |
| Exit - Pill collapse | 300ms | Right-to-left collapse |
| Exit - Badge fade | 200ms | Final badge fade out |
| **Total lifecycle** | ~5-7s | Entrance → Active → Exit |

## Files to Create/Modify

### New Files
- `src/components/ToastNotification/ToastNotification.tsx`
- `src/components/ToastNotification/ToastNotification.module.css`
- `src/components/ToastNotification/ToastContainer.tsx`
- `src/components/ToastNotification/types.ts`
- `src/components/ToastNotification/ToastNotification.stories.tsx`
- `src/context/ToastContext.tsx`
- `src/hooks/useToast.ts` (context consumer hook)
- `src/utils/toastUtils.ts` (helper functions)

### Modified Files
- `src/app/layout.tsx` - Add `ToastProvider` wrapper
- `src/hooks/useAudioManager.ts` - Add comment for future achievement chime sound

## Future Enhancements (Post-MVP)
1. **Audio integration**: Achievement chime sound (user will add later)
2. **Action buttons**: Add optional CTA button in pill (e.g., "View achievement")
3. **Swipe to dismiss**: Touch gesture support on mobile
4. **Toast queue animations**: Smooth re-positioning when toasts dismiss
5. **Custom animations**: Allow per-toast animation overrides
6. **Persistent toasts**: Option for manual-dismiss-only (duration: 0)
7. **Rich content**: Support for progress rings, custom icons, or images in content area

## Security Considerations
- **XSS prevention**: Sanitize user-provided text (title/subtitle) if accepting dynamic content
- **Image sources**: Validate badge icon URLs, prefer local assets over external URLs
- **Content length**: Enforce max character limits for title (50) and subtitle (80)

## Testing Strategy
- [x] **Storybook**: Visual testing for all variants and states
- [ ] **Manual testing**: Verify animations at different viewport sizes
- [ ] **Accessibility audit**: Screen reader testing, keyboard navigation
- [ ] **Performance**: Check animation frame rates (aim for 60fps)
- [ ] **Cross-browser**: Test in Chrome, Firefox, Safari, Edge
- [ ] **Mobile devices**: Test on actual iOS/Android devices

## Dependencies
No new npm packages required. Uses existing stack:
- React 18 (already installed)
- Next.js 15 (already installed)
- CSS Modules (built-in)
- TypeScript (already installed)

## Known Limitations
1. **No audio yet**: Chime sound to be added later by user
2. **Single toast focus**: Design optimized for one toast at a time (stacking is fallback)
3. **No interactive elements**: Initial version is display-only (no buttons/links)
4. **Fixed positioning**: Uses lower third positioning (not customizable initially)

## References & Inspiration
- Xbox 360 achievement notification system
- Xbox Series X/S toast notifications
- PlayStation trophy notifications (secondary reference)

---

**Next Steps After Planning Approval:**
1. Create component file structure
2. Implement static layout and styling
3. Add CSS keyframe animations
4. Implement animation orchestration with React hooks
5. Create context and global state management
6. Build Storybook stories
7. Test responsiveness and accessibility
8. Document usage in completion doc
