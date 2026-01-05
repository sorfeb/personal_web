/**
 * Background System Types
 *
 * Defines the layered background architecture:
 * - Base layer: Static image
 * - Animation layers: Composable effects (circle ripples, water ripples, etc.)
 */

/** Available animation layer types */
export type AnimationLayerId = 'circle-ripples' | 'water-ripples';

/** Configuration for an individual animation layer */
export interface AnimationLayerConfig {
  id: AnimationLayerId;
  enabled: boolean;
  /** Animation-specific configuration options */
  config?: Record<string, unknown>;
}

/** Complete background configuration */
export interface BackgroundConfig {
  id: string;
  name: string;
  thumbnail: string;
  /** Static base image path */
  baseImage: string;
  /** Animation layers to compose on top of base */
  animations: AnimationLayerConfig[];
  description?: string;
  category?: 'official' | 'custom';
}

/** State for user's animation layer preferences */
export interface AnimationLayerState {
  id: AnimationLayerId;
  enabled: boolean;
}

/** Props for animation layer components */
export interface AnimationLayerProps {
  /** Whether this layer should be active */
  enabled: boolean;
  /** Whether currently on home page (for performance optimization) */
  isHomePage: boolean;
}
