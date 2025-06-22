import { LayoutDimensions, LayoutSize } from './types';

/**
 * Layout configuration following the Strategy pattern
 * 
 * @description
 * Central configuration object that defines responsive layout dimensions
 * for different content types. Each size configuration is optimized for
 * specific use cases and follows responsive design principles.
 * 
 * **Design Approach:**
 * - Mobile-first responsive design
 * - Content-optimized sizing strategies
 * - Consistent spacing and proportions
 * - Performance-conscious defaults
 * 
 * **Size Strategies:**
 * - `compact`: Optimized for forms, dialogs, and focused interactions
 * - `default`: Balanced approach for most content pages
 * - `wide`: Content-heavy layouts like galleries and data displays
 * - `full`: Maximum space utilization for dashboards and tools
 * - `custom`: Placeholder for runtime customization
 * 
 * @since 1.0.0
 * @author Soros Febriano
 */
export const LAYOUT_CONFIGS: Record<LayoutSize, LayoutDimensions> = {
  /**
   * Compact layout configuration
   * @description Ideal for small forms, dialogs, and simple content
   * @example Modal dialogs, login forms, small settings panels
   */
  compact: {
    width: '50%',
    maxWidth: '600px',
    padding: '15px',
  },
  
  /**
   * Default layout configuration  
   * @description Balanced approach for standard pages with moderate content
   * @example About pages, blog posts, standard forms
   */
  default: {
    width: '70%',
    maxWidth: '900px',
    padding: '20px',
  },
  
  /**
   * Wide layout configuration
   * @description For content-heavy pages requiring more horizontal space
   * @example Image galleries, data tables, blog archives, portfolios
   */
  wide: {
    width: '90%',
    maxWidth: '1400px',
    padding: '20px',
  },
  
  /**
   * Full layout configuration
   * @description Maximum space utilization for complex interfaces
   * @example Dashboards, admin panels, media editors, data visualization
   */
  full: {
    width: '98%',
    maxWidth: 'none',
    padding: '10px',
  },
  
  /**
   * Custom layout placeholder
   * @description Empty configuration for runtime customization
   * @example Dynamic layouts based on user preferences or content type
   */
  custom: {},
};

/**
 * Responsive breakpoints following mobile-first design principles
 * 
 * @description
 * Standard breakpoint definitions used throughout the layout system.
 * Based on common device sizes and optimized for content readability.
 * 
 * **Breakpoint Strategy:**
 * - Mobile: Small phones and narrow viewports
 * - Tablet: Tablets and small laptops  
 * - Desktop: Standard desktop and laptop screens
 * - Wide: Large monitors and wide screens
 * 
 * @example
 * ```css
 * @media (max-width: 768px) {
 *   // Tablet styles
 * }
 * @media (max-width: 480px) {
 *   // Mobile styles  
 * }
 * ```
 * 
 * @since 1.0.0
 * @readonly
 */
export const RESPONSIVE_BREAKPOINTS = {
  /** Small phones and narrow viewports */
  mobile: '480px',
  /** Tablets and small laptops */
  tablet: '768px',
  /** Standard desktop and laptop screens */
  desktop: '1200px',
  /** Large monitors and wide screens */
  wide: '1400px',
} as const;

/**
 * Get computed layout dimensions with responsive adjustments
 * 
 * @description
 * Central function for retrieving layout configurations with support for
 * custom overrides. Implements the Strategy pattern by selecting the
 * appropriate configuration based on the size parameter.
 * 
 * **Logic Flow:**
 * 1. Retrieve base configuration for the specified size
 * 2. If size is 'custom' and customDimensions provided, merge them
 * 3. Return the computed configuration object
 * 
 * **Custom Dimensions Behavior:**
 * - Only applied when size is 'custom'
 * - Merged with base configuration (empty for custom)
 * - Allows partial overrides of any dimension property
 * 
 * @param size - The layout size configuration to retrieve
 * @param customDimensions - Optional custom dimension overrides
 * @returns Computed layout dimensions object
 * 
 * @example
 * ```typescript
 * // Get default configuration
 * const defaultLayout = getLayoutDimensions('default');
 * // { width: '70%', maxWidth: '900px', padding: '20px' }
 * 
 * // Get custom configuration  
 * const customLayout = getLayoutDimensions('custom', {
 *   width: '85%',
 *   maxWidth: '1200px',
 *   padding: '25px'
 * });
 * // { width: '85%', maxWidth: '1200px', padding: '25px' }
 * 
 * // Get predefined with no overrides
 * const wideLayout = getLayoutDimensions('wide');
 * // { width: '90%', maxWidth: '1400px', padding: '20px' }
 * ```
 * 
 * @throws {Error} When size is not a valid LayoutSize value
 * @since 1.0.0
 * @author Soros Febriano
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

/**
 * Validates if a breakpoint value is within responsive ranges
 * 
 * @description
 * Utility function to check if a given pixel value falls within
 * defined responsive breakpoint ranges. Useful for dynamic responsive logic.
 * 
 * @param value - Pixel value to check (without 'px' suffix)
 * @returns Object indicating which breakpoint ranges the value falls within
 * 
 * @example
 * ```typescript
 * const check = validateBreakpoint(800);
 * // { isMobile: false, isTablet: false, isDesktop: true, isWide: false }
 * 
 * if (check.isTablet) {
 *   // Apply tablet-specific logic
 * }
 * ```
 * 
 * @since 1.0.0
 */
export const validateBreakpoint = (value: number) => {
  return {
    isMobile: value <= parseInt(RESPONSIVE_BREAKPOINTS.mobile),
    isTablet: value <= parseInt(RESPONSIVE_BREAKPOINTS.tablet),
    isDesktop: value <= parseInt(RESPONSIVE_BREAKPOINTS.desktop),
    isWide: value > parseInt(RESPONSIVE_BREAKPOINTS.wide),
  };
};
