'use client';

import { useCallback, useEffect, useRef } from 'react';

const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'focus'] as const;

/**
 * Reports whether the user has gone quiet for `timeoutMs`.
 *
 * Returns a getter rather than state on purpose: the only caller is TanStack
 * Query's `refetchInterval`, which polls this itself. Storing it in state would
 * re-render the component on every idle transition to no visible effect.
 *
 * Lives in `src/hooks/` because the effect ban exempts purpose-built hooks.
 */
export function useIsIdle(timeoutMs: number): () => boolean {
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const noteActivity = () => {
      lastActivityRef.current = Date.now();
    };

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, noteActivity, { passive: true });
    }
    // Returning to the tab counts as activity, so work resumes immediately
    // rather than waiting out an idle window that elapsed while it was hidden.
    document.addEventListener('visibilitychange', noteActivity);

    return () => {
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, noteActivity);
      }
      document.removeEventListener('visibilitychange', noteActivity);
    };
  }, []);

  return useCallback(
    () => Date.now() - lastActivityRef.current > timeoutMs,
    [timeoutMs]
  );
}
