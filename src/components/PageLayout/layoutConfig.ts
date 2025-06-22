import { LayoutDimensions, LayoutSize } from './types';

/**
 * Layout configuration following the Strategy pattern
 * Each size configuration optimizes for different content types
 */
export const LAYOUT_CONFIGS: Record<LayoutSize, LayoutDimensions> = {
  // For small forms, dialogs, simple content
  compact: {
    width: '50%',
    maxWidth: '600px',
    padding: '15px',
  },
  
  // For standard pages with moderate content
  default: {
    width: '70%',
    maxWidth: '900px',
    padding: '20px',
  },
  
  // For content-heavy pages like BookRack, galleries
  wide: {
    width: '90%',
    maxWidth: '1400px',
    padding: '20px',
  },
  
  // For dashboards, data tables, media viewers
  full: {
    width: '98%',
    maxWidth: 'none',
    padding: '10px',
  },
  
  // Placeholder for custom dimensions
  custom: {},
};

/**
 * Responsive breakpoints following mobile-first design
 */
export const RESPONSIVE_BREAKPOINTS = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1200px',
  wide: '1400px',
} as const;

/**
 * Get computed layout dimensions with responsive adjustments
 */
export const getLayoutDimensions = (
  size: LayoutSize,
  customDimensions?: LayoutDimensions
): LayoutDimensions => {
  const baseConfig = LAYOUT_CONFIGS[size];
  
  if (size === 'custom' && customDimensions) {
    return { ...baseConfig, ...customDimensions };
  }
  
  return baseConfig;
};
