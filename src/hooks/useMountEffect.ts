import { useEffect, EffectCallback } from 'react';

/**
 * Run an effect only once on mount (with cleanup support).
 * Replaces `useEffect(() => { ... }, [])` for mount-only effects.
 */
export function useMountEffect(effect: EffectCallback): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, []);
}
