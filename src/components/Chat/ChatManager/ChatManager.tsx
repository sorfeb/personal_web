'use client';

import React, { memo } from 'react';
import ChatWindow from '../ChatWindow/ChatWindow';
import ChatTab from '../ChatTab/ChatTab';
import { useChatWindow } from '../../../hooks/useChatWindow';

/**
 * ChatManager Component
 * 
 * Orchestrates the chat system by managing window and tab states.
 * Acts as the main coordinator between chat components.
 * 
 * Features:
 * - State management for window visibility
 * - Conditional rendering based on states
 * - Optimized with React.memo for performance
 * - Clean separation of concerns
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
      {/* Chat Tab - Shows when window is not open */}
      {isTabVisible && (
        <ChatTab
          onClick={openWindow}
          isActive={windowState === 'minimized'}
        />
      )}

      {/* Chat Window - Managed by portal internally */}
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
