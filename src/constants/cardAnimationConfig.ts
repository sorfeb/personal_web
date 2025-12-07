import type { CardAnimationConfig } from '@/types/cardAnimation';

/**
 * Default animation configuration for Xbox Dashboard cards
 * 
 * Usage:
 * ```tsx
 * import { ANIMATION_CONFIG } from '@/constants/cardAnimationConfig';
 * 
 * // In your component
 * card.style.transform = `translateX(${offset}px) scale(${1 - position * ANIMATION_CONFIG.SCALE_DECREMENT_PER_POSITION})`;
 * ```
 */
export const ANIMATION_CONFIG: CardAnimationConfig = {
  STACK_OFFSET_INITIAL: 200,
  STACK_OFFSET_DECREMENT_FACTOR: 0.78,
  SCALE_DECREMENT_PER_POSITION: 0.08,
  ANIMATION_DURATION: 400,
  STATE_UPDATE_DELAY: 100,
} as const;
