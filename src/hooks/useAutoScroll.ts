import { useEffect, RefObject } from 'react';

/**
 * Auto-scroll a ref'd element into view whenever the given dependencies change.
 * Useful for chat windows, logs, or anything that should stay pinned to the
 * latest entry.
 */
export function useAutoScroll<T extends HTMLElement>(
  ref: RefObject<T | null>,
  deps: unknown[],
  behavior: ScrollBehavior = 'smooth',
): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
