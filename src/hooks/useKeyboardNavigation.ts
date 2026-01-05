import { useEffect, useCallback } from 'react';

interface UseKeyboardNavigationProps {
  /**
   * Callback when left arrow is pressed
   */
  onLeft?: () => void;
  /**
   * Callback when right arrow is pressed
   */
  onRight?: () => void;
  /**
   * Callback when up arrow is pressed
   */
  onUp?: () => void;
  /**
   * Callback when down arrow is pressed
   */
  onDown?: () => void;
  /**
   * Whether left navigation is allowed
   */
  canGoLeft?: boolean;
  /**
   * Whether right navigation is allowed
   */
  canGoRight?: boolean;
  /**
   * Whether up navigation is allowed
   */
  canGoUp?: boolean;
  /**
   * Whether down navigation is allowed
   */
  canGoDown?: boolean;
  /**
   * Whether the keyboard navigation is enabled
   */
  enabled?: boolean;
}

/**
 * Custom hook for global keyboard navigation with arrow keys.
 * 
 * Features:
 * - Handles ArrowLeft, ArrowRight, ArrowUp, ArrowDown keys
 * - Respects boundary conditions (canGo* props)
 * - Automatically skips when user is typing in inputs/textareas
 * - Skips when modals/dialogs are open
 * - Prevents default scroll behavior
 * - Properly memoized for performance
 * 
 * @param props - Navigation configuration
 * 
 * @example
 * ```tsx
 * useKeyboardNavigation({
 *   onLeft: navigateLeft,
 *   onRight: navigateRight,
 *   canGoLeft: currentIndex > 0,
 *   canGoRight: currentIndex < maxIndex,
 *   enabled: !isMobile,
 * });
 * ```
 */
export const useKeyboardNavigation = ({
  onLeft,
  onRight,
  onUp,
  onDown,
  canGoLeft = true,
  canGoRight = true,
  canGoUp = true,
  canGoDown = true,
  enabled = true,
}: UseKeyboardNavigationProps) => {
  /**
   * Check if keyboard navigation should be skipped
   */
  const shouldSkipNavigation = useCallback((event: KeyboardEvent): boolean => {
    if (!enabled) return true;
    
    // Skip if user is typing in an input field
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' || 
      target.tagName === 'TEXTAREA' || 
      target.isContentEditable
    ) {
      return true;
    }

    // Skip if a modal/dialog is open
    return !!document.querySelector('[role="dialog"]');
  }, [enabled]);

  /**
   * Handle individual arrow key press
   */
  const handleArrowKey = useCallback((key: string, event: KeyboardEvent) => {
    const handlers = {
      'ArrowLeft': { callback: onLeft, canGo: canGoLeft },
      'ArrowRight': { callback: onRight, canGo: canGoRight },
      'ArrowUp': { callback: onUp, canGo: canGoUp },
      'ArrowDown': { callback: onDown, canGo: canGoDown }
    };

    const handler = handlers[key as keyof typeof handlers];
    if (handler?.callback && handler.canGo) {
      event.preventDefault();
      handler.callback();
    }
  }, [onLeft, onRight, onUp, onDown, canGoLeft, canGoRight, canGoUp, canGoDown]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (shouldSkipNavigation(event)) return;
    handleArrowKey(event.key, event);
  }, [shouldSkipNavigation, handleArrowKey]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};
