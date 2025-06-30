/**
 * Utility functions for responsive design calculations
 */

export interface ResponsiveBreakpoints {
  mobile: number;
  tablet: number;
  medium: number;
  large: number;
  desktop: number;
}

export const DEFAULT_BREAKPOINTS: ResponsiveBreakpoints = {
  mobile: 768,
  tablet: 992,
  medium: 1200,
  large: 1400,
  desktop: 1600,
};

/**
 * Calculates optimal number of items per row based on viewport width
 */
export const calculateItemsPerRow = (
  breakpoints: ResponsiveBreakpoints = DEFAULT_BREAKPOINTS
): number => {
  if (typeof window === 'undefined') return 4; // SSR fallback
  
  const width = window.innerWidth;
  
  if (width >= breakpoints.desktop) return 6;
  if (width >= breakpoints.large) return 5;
  if (width >= breakpoints.medium) return 4;
  if (width >= breakpoints.mobile) return 3;
  return 2;
};

/**
 * Groups items into rows based on items per row calculation
 */
export const groupItemsIntoRows = <T>(
  items: T[], 
  itemsPerRow?: number
): T[][] => {
  const perRow = itemsPerRow || calculateItemsPerRow();
  const rows: T[][] = [];
  
  for (let i = 0; i < items.length; i += perRow) {
    rows.push(items.slice(i, i + perRow));
  }
  
  return rows;
};
