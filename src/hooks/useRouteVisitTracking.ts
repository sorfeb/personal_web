'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Invokes the callback once per pathname change (including the initial route).
 *
 * Centralizes route-visit detection for the achievement engine: watching
 * `usePathname` catches every navigation — `next/link` clicks included —
 * which per-call-site tracking around `navigateWithSound` would miss.
 *
 * The callback is kept in a ref so callers can pass a fresh closure each
 * render without re-firing the effect.
 */
export function useRouteVisitTracking(onVisit: (pathname: string) => void): void {
  const pathname = usePathname();
  const onVisitRef = useRef(onVisit);
  onVisitRef.current = onVisit;

  useEffect(() => {
    if (pathname) {
      onVisitRef.current(pathname);
    }
  }, [pathname]);
}
