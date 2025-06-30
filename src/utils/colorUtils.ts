/**
 * Utility functions for color generation and manipulation
 */

const BOOK_COLORS = [
  '#8B4513', '#A0522D', '#CD853F', '#DEB887', '#D2691E', 
  '#B22222', '#DC143C', '#8B0000', '#228B22', '#006400',
  '#4682B4', '#1E90FF', '#191970', '#4B0082', '#800080'
] as const;

/**
 * Generates consistent book cover colors based on string input
 */
export const generateBookColor = (input: string): string => {
  const hash = input.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return BOOK_COLORS[Math.abs(hash) % BOOK_COLORS.length];
};

/**
 * Simple hash function for consistent color assignment
 */
export const hashString = (str: string): number => {
  return str.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
};
