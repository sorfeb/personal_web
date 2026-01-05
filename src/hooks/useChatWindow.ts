import { useState, useCallback } from 'react';
import type { ChatWindowState, UseChatWindowReturn } from '../types/chat';

/**
 * Optimized Chat Window State Hook
 * Minimal, focused state management
 */
export const useChatWindow = (): UseChatWindowReturn => {
  const [windowState, setWindowState] = useState<ChatWindowState>('closed');

  // Memoized actions (prevent re-renders)
  const openWindow = useCallback(() => setWindowState('open'), []);
  const closeWindow = useCallback(() => setWindowState('closed'), []);
  const minimizeWindow = useCallback(() => setWindowState('minimized'), []);

  const toggleWindow = useCallback(() => {
    setWindowState(prev => {
      if (prev === 'open') return 'minimized';
      return 'open';
    });
  }, []);

  // Computed values (memoized implicitly)
  const isWindowOpen = windowState === 'open';
  const isTabVisible = windowState !== 'open';

  return {
    windowState,
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleWindow,
    isWindowOpen,
    isTabVisible,
  };
};
