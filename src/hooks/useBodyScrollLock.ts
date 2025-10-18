import { useEffect } from 'react';

/**
 * useBodyScrollLock Hook
 * 
 * Prevents body scrolling when a modal or overlay is open.
 * Handles multiple prevention methods for cross-browser compatibility.
 * 
 * Features:
 * - Locks body scroll via CSS (overflow, position, width)
 * - Prevents wheel events (desktop scroll)
 * - Prevents touch events (mobile scroll)
 * - Prevents keyboard scroll (arrow keys, page up/down, etc.)
 * - Optionally handles Escape key for modal closure
 * - Restores original styles on cleanup
 * - Non-passive event listeners for reliable prevention
 * 
 * @param isLocked - Whether the scroll lock is active
 * @param onEscape - Optional callback when Escape key is pressed
 * 
 * @example
 * ```tsx
 * const Modal = ({ isOpen, onClose }) => {
 *   useBodyScrollLock(isOpen, onClose);
 *   
 *   return isOpen ? <div>Modal content</div> : null;
 * };
 * ```
 */
export const useBodyScrollLock = (
  isLocked: boolean,
  onEscape?: () => void
) => {
  useEffect(() => {
    if (!isLocked) return;

    // Save original body styles
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalWidth = document.body.style.width;
    const originalTop = document.body.style.top;
    
    // Save current scroll position
    const scrollY = window.scrollY;
    
    // Apply scroll lock styles
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${scrollY}px`;
    
    /**
     * Prevent wheel scrolling (desktop)
     */
    const preventScroll = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    
    /**
     * Prevent touch scrolling (mobile)
     */
    const preventTouchMove = (e: TouchEvent) => {
      // Allow scrolling within modal content by checking if target has scrollable parent
      const target = e.target as HTMLElement;
      
      // Check if the touch target or any parent is scrollable
      let element: HTMLElement | null = target;
      while (element) {
        const hasScroll = element.scrollHeight > element.clientHeight;
        const isScrollable = window.getComputedStyle(element).overflowY !== 'hidden';
        
        if (hasScroll && isScrollable) {
          // Allow scrolling within this element
          return;
        }
        element = element.parentElement;
      }
      
      // Prevent body scroll
      e.preventDefault();
    };
    
    /**
     * Prevent keyboard scrolling (arrow keys, page up/down, space, home, end)
     * Optionally trigger escape callback
     */
    const preventKeyScroll = (e: KeyboardEvent) => {
      // Handle Escape key
      if (e.key === 'Escape' && onEscape) {
        onEscape();
        return;
      }
      
      // Prevent scroll-triggering keys
      const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
      if (scrollKeys.includes(e.key)) {
        e.preventDefault();
      }
    };
    
    // Add event listeners with non-passive flag for reliable prevention
    document.addEventListener('wheel', preventScroll, { passive: false });
    document.addEventListener('touchmove', preventTouchMove, { passive: false });
    document.addEventListener('keydown', preventKeyScroll);
    
    // Cleanup function
    return () => {
      // Restore original body styles
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.width = originalWidth;
      document.body.style.top = originalTop;
      
      // Restore scroll position
      window.scrollTo(0, scrollY);
      
      // Remove event listeners
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventTouchMove);
      document.removeEventListener('keydown', preventKeyScroll);
    };
  }, [isLocked, onEscape]);
};

export default useBodyScrollLock;
