import { useState, useCallback, useEffect, useRef } from 'react';
import { ChatPosition, ChatSize } from '../types/chat';
import { 
  getWindowBounds, 
  clampPosition, 
  setUserSelectNone,
  WINDOW_CONSTANTS,
} from '../utils/windowUtils';


export const useWindowDrag = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<ChatPosition>({
    x: WINDOW_CONSTANTS.DEFAULT_X,
    y: WINDOW_CONSTANTS.DEFAULT_Y,
  });
  const [size] = useState<ChatSize>({
    width: WINDOW_CONSTANTS.DEFAULT_WIDTH,
    height: WINDOW_CONSTANTS.DEFAULT_HEIGHT,
  });

  const dragOffsetRef = useRef<ChatPosition>({ x: 0, y: 0 });
  const cleanupRef = useRef<(() => void) | null>(null);

  const startDrag = useCallback((e: React.MouseEvent, windowRect: DOMRect) => {
    dragOffsetRef.current = {
      x: e.clientX - windowRect.left,
      y: e.clientY - windowRect.top,
    };
    setIsDragging(true);
    cleanupRef.current = setUserSelectNone();
  }, []);

  const stopDrag = useCallback(() => {
    setIsDragging(false);
    cleanupRef.current?.();
    cleanupRef.current = null;
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const bounds = getWindowBounds();
    const newPosition = {
      x: e.clientX - dragOffsetRef.current.x,
      y: e.clientY - dragOffsetRef.current.y,
    };
    
    setPosition(clampPosition(newPosition, size, bounds));
  }, [isDragging, size]);

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
