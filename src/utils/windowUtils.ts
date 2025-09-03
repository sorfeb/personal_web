import { ChatPosition, ChatSize, ChatWindowBounds } from '../types/chat';

export const WINDOW_CONSTANTS = {
  MIN_WIDTH: 400,
  MIN_HEIGHT: 300,
  DEFAULT_WIDTH: 600,
  DEFAULT_HEIGHT: 500,
  DEFAULT_X: 100,
  DEFAULT_Y: 100,
  MOBILE_BREAKPOINT: 768,
} as const;

/**
 * Get window boundaries efficiently
 */
export const getWindowBounds = (): ChatWindowBounds => ({
  maxWidth: window.innerWidth - 50,
  maxHeight: window.innerHeight - 50,
  minWidth: WINDOW_CONSTANTS.MIN_WIDTH,
  minHeight: WINDOW_CONSTANTS.MIN_HEIGHT,
});

/**
 * Clamp position within bounds
 */
export const clampPosition = (
  position: ChatPosition,
  size: ChatSize,
  bounds: ChatWindowBounds
): ChatPosition => ({
  x: Math.max(0, Math.min(position.x, bounds.maxWidth - size.width)),
  y: Math.max(0, Math.min(position.y, bounds.maxHeight - size.height)),
});

/**
 * Clamp size within bounds
 */
export const clampSize = (
  size: ChatSize,
  position: ChatPosition,
  bounds: ChatWindowBounds
): ChatSize => ({
  width: Math.max(bounds.minWidth, Math.min(size.width, bounds.maxWidth - position.x)),
  height: Math.max(bounds.minHeight, Math.min(size.height, bounds.maxHeight - position.y)),
});

/**
 * Check if device is mobile
 */
export const isMobile = (): boolean => 
  window.innerWidth <= WINDOW_CONSTANTS.MOBILE_BREAKPOINT;

/**
 * Prevent text selection during drag/resize
 */
export const setUserSelectNone = (): (() => void) => {
  const originalUserSelect = document.body.style.userSelect;
  const originalCursor = document.body.style.cursor;
  
  document.body.style.userSelect = 'none';
  document.body.style.cursor = 'grabbing';
  
  return () => {
    document.body.style.userSelect = originalUserSelect;
    document.body.style.cursor = originalCursor;
  };
};
