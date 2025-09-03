'use client';

import { memo } from 'react';
import ChatWindow from '../ChatWindow/ChatWindow';
import ChatTab from '../ChatTab/ChatTab';
import { useChatWindow } from '../../hooks/useChatWindow';

/**
 * Optimized ChatManager Component
 * Coordinates chat tab and window with minimal re-renders
 */
const ChatManager = memo(() => {
  const {
    isWindowOpen,
    isTabVisible,
    openWindow,
    closeWindow,
    minimizeWindow,
    windowState,
  } = useChatWindow();

  return (
    <>
      {isTabVisible && (
        <ChatTab
          onClick={openWindow}
          isActive={windowState === 'minimized'}
        />
      )}

      <ChatWindow
        isOpen={isWindowOpen}
        onClose={closeWindow}
        onMinimize={minimizeWindow}
      />
    </>
  );
});

ChatManager.displayName = 'ChatManager';

export default ChatManager;
