/**
 * Position of a draggable window, in viewport pixels.
 */
export interface WindowPosition {
  x: number;
  y: number;
}

/**
 * Window Management Constants
 * Based on Windows OS behavior and UX best practices
 */
const WINDOW_CONSTANTS = {
  DEFAULT_WIDTH: 600,
  MIN_VISIBLE_AREA: 50, // Minimum pixels of title bar that must remain visible
} as const;

/**
 * Calculate Windows-style boundary constraints
 * Allows window to go off-screen but keeps title bar partially visible
 * 
 * @returns Boundary limits for window positioning
 */
export const getWindowBounds = () => {
  if (typeof window === 'undefined') {
    return {
      minX: -(WINDOW_CONSTANTS.DEFAULT_WIDTH - WINDOW_CONSTANTS.MIN_VISIBLE_AREA),
      maxX: 800 - WINDOW_CONSTANTS.MIN_VISIBLE_AREA, // fallback values
      minY: 0,
      maxY: 600 - WINDOW_CONSTANTS.MIN_VISIBLE_AREA,
    };
  }
  
  return {
    // Allow window to go almost completely off left edge
    minX: -(WINDOW_CONSTANTS.DEFAULT_WIDTH - WINDOW_CONSTANTS.MIN_VISIBLE_AREA),
    
    // Allow window to go almost completely off right edge  
    maxX: window.innerWidth - WINDOW_CONSTANTS.MIN_VISIBLE_AREA,
    
    // Prevent window from going above viewport (title bar must be accessible)
    minY: 0,
    
    // Allow window to go almost completely off bottom edge
    maxY: window.innerHeight - WINDOW_CONSTANTS.MIN_VISIBLE_AREA,
  };
};

/**
 * Apply Windows-style position constraints
 * Mimics Windows OS behavior: window can go off-screen but title bar stays accessible
 * 
 * @param position - Desired window position
 * @returns Constrained position following Windows behavior
 */
export const constrainPosition = (position: WindowPosition): WindowPosition => {
  const bounds = getWindowBounds();
  
  return {
    x: Math.max(bounds.minX, Math.min(position.x, bounds.maxX)),
    y: Math.max(bounds.minY, Math.min(position.y, bounds.maxY)),
  };
};

/**
 * Calculate precise drag offset to prevent window "jumping"
 * 
 * The offset is the distance from the mouse click point to the window's top-left corner.
 * This ensures the window doesn't snap/jump when dragging starts.
 * 
 * @param mouseEvent - Mouse event from drag start
 * @param windowRect - Current window bounding rectangle
 * @returns Offset coordinates to maintain relative position
 */
export const calculateDragOffset = (
  mouseEvent: React.MouseEvent,
  windowRect: DOMRect
): WindowPosition => ({
  x: mouseEvent.clientX - windowRect.left,
  y: mouseEvent.clientY - windowRect.top,
});

/**
 * Calculate new window position during drag
 * Uses the drag offset to maintain consistent positioning
 * 
 * @param mouseEvent - Current mouse position
 * @param dragOffset - Offset calculated at drag start
 * @returns New window position
 */
export const calculateDragPosition = (
  mouseEvent: MouseEvent,
  dragOffset: WindowPosition
): WindowPosition => ({
  x: mouseEvent.clientX - dragOffset.x,
  y: mouseEvent.clientY - dragOffset.y,
});

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
