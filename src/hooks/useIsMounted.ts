import { useState } from 'react';
import { useMountEffect } from './useMountEffect';

/**
 * Track if the component is mounted on the client.
 * Replaces the common `[mounted, setMounted] = useState(false)` pattern
 * used to guard SSR/CSR hydration.
 */
export function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useMountEffect(() => {
    setMounted(true);
  });

  return mounted;
}
