/**
 * Background Configuration Registry
 *
 * Layered background system configuration.
 * Each background has:
 * - A static base image
 * - Optional animation layers that can be toggled
 */

import type { BackgroundConfig, AnimationLayerConfig } from '../components/Background/types';

/**
 * Registry of all available backgrounds
 */
export const backgrounds: BackgroundConfig[] = [
  {
    id: 'xbox360-classic',
    name: 'Xbox 360 Classic',
    thumbnail: '/assets/wallpapers/xbox360.webp',
    baseImage: '/assets/wallpapers/xbox360.webp',
    description: 'Classic Xbox 360 green dashboard with optional animations',
    category: 'official',
    animations: [
      { id: 'circle-ripples', enabled: false },
      { id: 'water-ripples', enabled: true },
    ],
  },
  // Add more backgrounds here
  // Example: minimal version without animations enabled by default
  // {
  //   id: 'xbox360-minimal',
  //   name: 'Xbox 360 Minimal',
  //   thumbnail: '/assets/wallpapers/xbox360.webp',
  //   baseImage: '/assets/wallpapers/xbox360.webp',
  //   description: 'Clean static background without animations',
  //   category: 'official',
  //   animations: [
  //     { id: 'circle-ripples', enabled: false },
  //     { id: 'water-ripples', enabled: false },
  //   ],
  // },
];

/**
 * Get background configuration by ID
 */
export const getBackgroundById = (id: string): BackgroundConfig | undefined => {
  return backgrounds.find((bg) => bg.id === id);
};

/**
 * Get default background (first in list)
 */
export const getDefaultBackground = (): BackgroundConfig => {
  return backgrounds[0];
};

/**
 * Get all backgrounds by category
 */
export const getBackgroundsByCategory = (
  category: BackgroundConfig['category']
): BackgroundConfig[] => {
  return backgrounds.filter((bg) => bg.category === category);
};
