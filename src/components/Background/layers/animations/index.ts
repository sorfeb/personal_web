/**
 * Animation Layer Registry
 *
 * Central registry for all available background animation layers.
 * Add new animations here to make them available in the background system.
 */

import type { AnimationLayerId, AnimationLayerProps } from '../../types';
import CircleRipples from './CircleRipples';
import WaterRipples from './WaterRipples';

/** Animation layer component type */
type AnimationLayerComponent = React.FC<AnimationLayerProps>;

/** Registry mapping animation IDs to their components */
export const ANIMATION_REGISTRY: Record<AnimationLayerId, AnimationLayerComponent> = {
  'circle-ripples': CircleRipples,
  'water-ripples': WaterRipples,
};

/** Animation layer metadata for UI display */
export const ANIMATION_METADATA: Record<
  AnimationLayerId,
  { name: string; description: string }
> = {
  'circle-ripples': {
    name: 'Circle Ripples',
    description: 'Xbox 360-style expanding circle animations',
  },
  'water-ripples': {
    name: 'Water Ripples',
    description: 'Interactive water surface effect with rain drops',
  },
};

/** Get all available animation IDs */
export const getAnimationIds = (): AnimationLayerId[] => {
  return Object.keys(ANIMATION_REGISTRY) as AnimationLayerId[];
};

/** Get animation component by ID */
export const getAnimationComponent = (
  id: AnimationLayerId
): AnimationLayerComponent | undefined => {
  return ANIMATION_REGISTRY[id];
};

export { CircleRipples, WaterRipples };
