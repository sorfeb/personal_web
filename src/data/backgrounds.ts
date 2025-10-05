/**
 * Background Configuration Registry
 * 
 * Central configuration for all available backgrounds.
 * Each background can be either a static image or an animated component.
 * 
 * To add a new background:
 * 1. Add the background asset to public/assets/wallpapers/
 * 2. Add a new entry to the backgrounds array below
 * 3. For animated backgrounds, create the component in src/components/
 */

export type BackgroundType = 'static' | 'animated';

export interface Background {
  id: string;
  name: string;
  type: BackgroundType;
  thumbnail: string;
  /** For static backgrounds 
    */
  imagePath?: string;
  /**  For animated backgrounds 
   */
  componentName?: string;
  description?: string;
  category?: 'official' | 'custom' | 'animated';
}

/**
 * Registry of all available backgrounds
 * Default background is marked with isDefault: true
 */
export const backgrounds: Background[] = [
  {
    id: 'xbox360-green',
    name: 'Xbox 360 Classic',
    type: 'static',
    imagePath: '/assets/wallpapers/xbox360.webp',
    thumbnail: '/assets/wallpapers/xbox360.webp',
    description: 'Classic Xbox 360 green dashboard wallpaper',
    category: 'official',
  },
  {
    id: 'xbox360-animated',
    name: 'Xbox 360 Ripple',
    type: 'animated',
    componentName: 'AnimatedBackground',
    thumbnail: '/assets/wallpapers/xbox360.webp',
    description: 'Animated circular ripple patterns on Xbox 360 green gradient',
    category: 'animated',
  },
  // Add more backgrounds here as needed
  // Example static background:
  // {
  //   id: 'custom-blue',
  //   name: 'Blue Theme',
  //   type: 'static',
  //   imagePath: '/assets/wallpapers/blue-theme.webp',
  //   thumbnail: '/assets/wallpapers/blue-theme-thumb.webp',
  //   category: 'custom',
  // },
];

/**
 * Get background configuration by ID
 */
export const getBackgroundById = (id: string): Background | undefined => {
  return backgrounds.find((bg) => bg.id === id);
};

/**
 * Get default background
 */
export const getDefaultBackground = (): Background => {
  return backgrounds[0]; // Xbox 360 Classic as default
};

/**
 * Get all backgrounds by category
 */
export const getBackgroundsByCategory = (category: Background['category']) => {
  return backgrounds.filter((bg) => bg.category === category);
};
