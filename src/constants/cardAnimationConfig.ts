/**
 * Card Animation Configuration
 * 
 * Centralized configuration for Xbox Dashboard card navigation animations.
 * These values control the visual stacking effect, transitions, and timing
 * for the card-based navigation system.
 * 
 * @see useCardNavigation - Primary consumer of this configuration
 * @see XboxDashboard - Uses these values for initial card layout
 */

export interface CardAnimationConfig {
  /**
   * Initial horizontal offset (in pixels) for the first card behind the active card
   * @default 250
   */
  readonly STACK_OFFSET_INITIAL: number;
  
  /**
   * Exponential decay factor applied to each subsequent card's offset
   * Creates the visual perspective effect where cards get closer together
   * @default 0.78
   */
  readonly STACK_OFFSET_DECREMENT_FACTOR: number;
  
  /**
   * Scale reduction per card position (0.1 = 10% smaller per position)
   * Position 0 (active): scale(1.0)
   * Position 1: scale(0.9)
   * Position 2: scale(0.8), etc.
   * @default 0.1
   */
  readonly SCALE_DECREMENT_PER_POSITION: number;
  
  /**
   * Duration of card transform animations in milliseconds
   * @default 500
   */
  readonly ANIMATION_DURATION: number;
  
  /**
   * Delay before updating React state after animation starts (in milliseconds)
   * Ensures smooth visual transitions before state changes
   * @default 100
   */
  readonly STATE_UPDATE_DELAY: number;
}

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
  STACK_OFFSET_INITIAL: 250,
  STACK_OFFSET_DECREMENT_FACTOR: 0.78,
  SCALE_DECREMENT_PER_POSITION: 0.1,
  ANIMATION_DURATION: 500,
  STATE_UPDATE_DELAY: 100,
} as const;
