# Server Components by Default

## Problem

Every page in the codebase is a client component (`'use client'`), even when most of the page content is static. This forces workarounds like creating separate `layout.tsx` files just to export metadata, increases JavaScript bundle sizes, and prevents leveraging server-side data fetching.

## Recommendation

Pages should be **server components** by default. Extract only the interactive parts into small client components.

### Current Pattern (avoid)

```tsx
// src/app/about/page.tsx
'use client';

import { useAudioManager } from '../../hooks/useAudioManager';
import PageLayout from '../../components/PageLayout/PageLayout';

const AboutPage = () => {
  const { playSound } = useAudioManager();
  // entire page is client-rendered
  return (
    <PageLayout title="About">
      <PageLayout.Header />
      <PageLayout.Body>
        <p>Static content that doesn't need JS...</p>
        <button onClick={() => playSound('click')}>Interactive part</button>
      </PageLayout.Body>
    </PageLayout>
  );
};
```

### Recommended Pattern

```tsx
// src/app/about/page.tsx (server component — no 'use client')
import type { Metadata } from 'next';
import PageLayout from '../../components/PageLayout/PageLayout';
import { SoundButton } from './SoundButton'; // small client component

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Soros Febriano...',
};

export default function AboutPage() {
  return (
    <PageLayout title="About">
      <PageLayout.Header />
      <PageLayout.Body>
        <p>Static content rendered on the server — zero JS shipped.</p>
        <SoundButton />
      </PageLayout.Body>
    </PageLayout>
  );
}
```

```tsx
// src/app/about/SoundButton.tsx
'use client';

import { useAudioManager } from '../../hooks/useAudioManager';

export function SoundButton() {
  const { playSound } = useAudioManager();
  return <button onClick={() => playSound('click')}>Interactive part</button>;
}
```

## Benefits

- **Metadata exports** work directly in `page.tsx` — no extra layout files needed
- **Smaller bundles** — static content isn't wrapped in client-side React
- **Faster initial load** — HTML is streamed from the server
- **Data fetching** — can `await` database/API calls directly in the component

## Migration Strategy

1. Start with pages that have minimal interactivity (about, certifications, books)
2. Identify which components actually need `'use client'` (audio, hover effects, state)
3. Extract those into leaf client components
4. Remove `'use client'` from the page and export metadata directly
5. Delete the now-unnecessary route-level `layout.tsx` metadata files

## Key Constraint

`PageLayout` currently uses `useAudioManager`, making it a client component. To go server-first, `PageLayout` would need to be split: a server wrapper for structure and a client component for the interactive header/close button.
