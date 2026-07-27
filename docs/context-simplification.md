# Context Simplification

## Problem

The root layout nests 6 context providers deep:

```tsx
<BackgroundProvider>
  <CRTFilterProvider>
    <TRPCProvider>
      <VolumeProvider>
        <WMPPlayerProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </WMPPlayerProvider>
      </VolumeProvider>
    </TRPCProvider>
  </CRTFilterProvider>
</BackgroundProvider>
```

This creates several issues:
- Every context change re-renders all consumers (React Context has no selector support)
- Deep nesting makes the provider tree hard to reason about
- All providers load on every route, even if unused

## Recommendation

### Option A: Consolidate with Zustand (Recommended)

Replace multiple React contexts with a single Zustand store. Zustand supports selectors natively, preventing unnecessary re-renders.

```tsx
// src/store/useAppStore.ts
import { create } from 'zustand';

interface AppState {
  // Volume
  volume: number;
  setVolume: (v: number) => void;

  // Background
  background: string;
  setBackground: (bg: string) => void;

  // CRT Filter
  crtEnabled: boolean;
  setCrtEnabled: (enabled: boolean) => void;

  // WMP Player
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (track: Track) => void;
  pause: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  volume: 0.5,
  setVolume: (volume) => set({ volume }),

  background: 'default',
  setBackground: (background) => set({ background }),

  crtEnabled: true,
  setCrtEnabled: (crtEnabled) => set({ crtEnabled }),

  currentTrack: null,
  isPlaying: false,
  playTrack: (track) => set({ currentTrack: track, isPlaying: true }),
  pause: () => set({ isPlaying: false }),
}));
```

Usage — components only re-render when their selected slice changes:

```tsx
const volume = useAppStore((s) => s.volume);
const setVolume = useAppStore((s) => s.setVolume);
```

### Option B: Merge Related Contexts

If staying with React Context, at minimum combine related concerns:

- `BackgroundProvider` + `CRTFilterProvider` → `VisualEffectsProvider`
- `VolumeProvider` + `WMPPlayerProvider` → `AudioProvider`

This reduces nesting from 6 levels to 3-4.

### Scope tRPC Provider

Move `TRPCProvider` out of the root layout and into only the routes that need it (blog, chatroom, profile, music). Use a route group:

```
src/app/
  (with-trpc)/
    layout.tsx       ← TRPCProvider here
    blog/
    chatroom/
    music/
  (static)/
    layout.tsx       ← no TRPCProvider
    about/
    projects/
    certifications/
```

## Benefits

- Fewer re-renders from unrelated state changes
- Lighter initial bundle for static pages
- Easier to debug state with Zustand devtools
- Cleaner root layout

## Migration Strategy

1. Install Zustand (`npm install zustand`)
2. Create `useAppStore` combining Volume + Background + CRT state
3. Migrate one context at a time, starting with the simplest (CRTFilter)
4. Keep Toast as a separate context (or use a dedicated library like Sonner)
5. Move TRPCProvider to a route group for dynamic pages
