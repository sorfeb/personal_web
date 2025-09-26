/**
 * Utility functions for responsive design calculations
 */

import { useEffect, useState } from "react";

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
 * Custom hook for media queries - handles SSR properly
 * @param query - CSS media query string (e.g., '(max-width: 768px)')
 * @param defaultValue - Default value for SSR (prevents hydration mismatch)
 */
export const useMediaQuery = (query: string, defaultValue: boolean = false): boolean => {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);
    
    // Create event listener
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    
    // Add listener (use the modern API)
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

/**
 * Convenience hook for mobile detection
 */
export const useIsMobile = (breakpoint: number = 768): boolean => {
  return useMediaQuery(`(max-width: ${breakpoint}px)`, false);
};

/**
 * Calculates optimal number of items per row based on viewport width
 * This should only be used in useEffect or event handlers, not during initial render
 */
export const calculateItemsPerRow = (
  breakpoints: ResponsiveBreakpoints = DEFAULT_BREAKPOINTS
): number => {
    const width = window.innerWidth;
  
  if (width >= breakpoints.desktop) return 6;
  if (width >= breakpoints.large) return 5;
  if (width >= breakpoints.medium) return 4;
  if (width >= breakpoints.mobile) return 3;
  return 2;
};

/**
 * Groups items into rows based on items per row calculation
 * Use a default itemsPerRow value to avoid hydration issues
 */
export const groupItemsIntoRows = <T>(
  items: T[], 
  itemsPerRow: number = 4 
): T[][] => {
  const rows: T[][] = [];
  
  for (let i = 0; i < items.length; i += itemsPerRow) {
    rows.push(items.slice(i, i + itemsPerRow));
  }
  
  return rows;
};

/**
 * Hook for responsive calculations that avoids hydration issues
 */
export const useResponsiveItemsPerRow = (
  breakpoints: ResponsiveBreakpoints = DEFAULT_BREAKPOINTS
) => {
  const [itemsPerRow, setItemsPerRow] = useState(4); // Default for SSR
  
  useEffect(() => {
    const updateItemsPerRow = () => {
      setItemsPerRow(calculateItemsPerRow(breakpoints));
    };
    
    // Set initial value
    updateItemsPerRow();
    
    // Listen for resize events
    window.addEventListener('resize', updateItemsPerRow);
    
    return () => window.removeEventListener('resize', updateItemsPerRow);
  }, [breakpoints]);
  
  return itemsPerRow;
};
