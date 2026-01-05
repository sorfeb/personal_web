import { useState, useCallback, useEffect, useRef } from 'react';
import { ChatPosition } from '../types/chat';
import { 
  constrainPosition,
  calculateDragOffset,
  calculateDragPosition,
  setUserSelectNone,
  WINDOW_CONSTANTS,
} from '../utils/windowUtils';

/**
 * Optimized Window Drag Hook with Windows-style behavior
 * Fixes offset calculation and implements proper Windows dragging behavior
 */
export const useWindowDrag = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<ChatPosition>({
    x: WINDOW_CONSTANTS.DEFAULT_X,
    y: WINDOW_CONSTANTS.DEFAULT_Y,
  });

  const dragOffsetRef = useRef<ChatPosition>({ x: 0, y: 0 });
  const cleanupRef = useRef<(() => void) | null>(null);

  /**
   * Start drag operation with proper offset calculation
   * This prevents the window from "jumping" when drag starts
   */
  const startDrag = useCallback((e: React.MouseEvent, windowRect: DOMRect) => {
    // Calculate precise offset from click point to window corner
    dragOffsetRef.current = calculateDragOffset(e, windowRect);
    setIsDragging(true);
    cleanupRef.current = setUserSelectNone();
  }, []);

  /**
   * Stop drag operation and cleanup
   */
  const stopDrag = useCallback(() => {
    setIsDragging(false);
    cleanupRef.current?.();
    cleanupRef.current = null;
  }, []);

  /**
   * Handle mouse move during drag
   * Uses Windows-style constraints instead of strict clamping
   */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    // Calculate new position using precise offset
    const newPosition = calculateDragPosition(e, dragOffsetRef.current);
    
    // Apply Windows-style constraints (allows off-screen but keeps title bar accessible)
    const constrainedPosition = constrainPosition(newPosition);
    
    setPosition(constrainedPosition);
  }, [isDragging]);

  // Optimized event listeners with proper cleanup
  useEffect(() => {
    if (!isDragging) return;
    
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseup', stopDrag, { once: true });
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopDrag);
    };
  }, [isDragging, handleMouseMove, stopDrag]);

  return {
    position,
    isDragging,
    startDrag,
    stopDrag,
  };
};
