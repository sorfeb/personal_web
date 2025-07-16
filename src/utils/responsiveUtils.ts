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
