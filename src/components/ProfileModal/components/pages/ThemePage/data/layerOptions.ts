/**
 * Theme Layer Options
 *
 * Configuration data for background layers and animations
 * available in the theme customization interface.
 */

import type { AnimationLayerId } from '../../../../../../components/Background/types';

/** Base background image option */
export interface BaseImageOption {
  id: string;
  name: string;
  thumbnail: string;
  fullImage: string;
}

/** Animation layer option with variant support */
export interface AnimationOption {
  id: AnimationLayerId;
  name: string;
  description: string;
  thumbnail: string;
}

/** All available base background images */
export const BASE_IMAGE_OPTIONS: BaseImageOption[] = [
  {
    id: 'xbox360-classic',
    name: 'Xbox 360 Classic',
    thumbnail: '/assets/wallpapers/xbox360.webp',
    fullImage: '/assets/wallpapers/xbox360.webp',
  },
  // Placeholder items for testing carousel scroll
  {
    id: 'neon-city',
    name: 'Neon City',
    thumbnail: '/assets/wallpapers/xbox360.webp',
    fullImage: '/assets/wallpapers/xbox360.webp',
  },
  {
    id: 'mountain-sunset',
    name: 'Mountain Sunset',
    thumbnail: '/assets/wallpapers/xbox360.webp',
    fullImage: '/assets/wallpapers/xbox360.webp',
  },
  {
    id: 'deep-space',
    name: 'Deep Space',
    thumbnail: '/assets/wallpapers/xbox360.webp',
    fullImage: '/assets/wallpapers/xbox360.webp',
  },
  {
    id: 'ocean-waves',
    name: 'Ocean Waves',
    thumbnail: '/assets/wallpapers/xbox360.webp',
    fullImage: '/assets/wallpapers/xbox360.webp',
  },
  {
    id: 'forest-mist',
    name: 'Forest Mist',
    thumbnail: '/assets/wallpapers/xbox360.webp',
    fullImage: '/assets/wallpapers/xbox360.webp',
  },
  {
    id: 'aurora-borealis',
    name: 'Aurora Borealis',
    thumbnail: '/assets/wallpapers/xbox360.webp',
    fullImage: '/assets/wallpapers/xbox360.webp',
  },
  {
    id: 'desert-dunes',
    name: 'Desert Dunes',
    thumbnail: '/assets/wallpapers/xbox360.webp',
    fullImage: '/assets/wallpapers/xbox360.webp',
  },
];

/** All available animation layers */
export const ANIMATION_OPTIONS: AnimationOption[] = [
  {
    id: 'circle-ripples',
    name: 'Circle Ripples',
    description: 'Xbox 360-style expanding circle animations',
    thumbnail: '/assets/wallpapers/xbox360.webp',
  },
  {
    id: 'water-ripples',
    name: 'Water Ripples',
    description: 'Interactive water surface effect with rain drops',
    thumbnail: '/assets/wallpapers/xbox360.webp',
  },
];

/** Get animation option by ID */
export const getAnimationOption = (id: AnimationLayerId): AnimationOption | undefined => {
  return ANIMATION_OPTIONS.find((opt) => opt.id === id);
};
