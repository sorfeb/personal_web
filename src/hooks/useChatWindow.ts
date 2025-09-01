import { useState, useCallback } from 'react';

export type ChatWindowState = 'closed' | 'minimized' | 'open';

interface UseChatWindowReturn {
  windowState: ChatWindowState;
  openWindow: () => void;
  closeWindow: () => void;
  minimizeWindow: () => void;
  toggleWindow: () => void;
  isWindowOpen: boolean;
  isTabVisible: boolean;
}

/**
 * Custom hook to manage ChatWindow state
 * Handles the window visibility and state transitions
 */
export const useChatWindow = (): UseChatWindowReturn => {
  const [windowState, setWindowState] = useState<ChatWindowState>('closed');

  const openWindow = useCallback(() => {
    setWindowState('open');
  }, []);

  const closeWindow = useCallback(() => {
    setWindowState('closed');
  }, []);

  const minimizeWindow = useCallback(() => {
    setWindowState('minimized');
  }, []);

  const toggleWindow = useCallback(() => {
    setWindowState(prevState => {
      switch (prevState) {
        case 'closed':
        case 'minimized':
          return 'open';
        case 'open':
          return 'minimized';
        default:
          return 'closed';
      }
    });
  }, []);

  const isWindowOpen = windowState === 'open';
  const isTabVisible = windowState === 'closed' || windowState === 'minimized';

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
