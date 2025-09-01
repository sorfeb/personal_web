'use client';

import React from 'react';
import ChatWindow from '../ChatWindow/ChatWindow';
import ChatTab from '../ChatTab/ChatTab';
import { useChatWindow } from '../../hooks/useChatWindow';

/**
 * ChatManager Component
 * 
 * Manages the entire chat system including:
 * - Chat tab (bottom-left of screen)
 * - Chat window (draggable modal)
 * - State management between them
 * 
 * This component should be placed at the root level
 * so it can render the chat system on any page.
 */
const ChatManager: React.FC = () => {
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
      {/* Chat Tab - shows when window is closed or minimized */}
      {isTabVisible && (
        <ChatTab
          onClick={openWindow}
          isActive={windowState === 'minimized'}
        />
      )}

      {/* Chat Window - shows when open */}
      <ChatWindow
        isOpen={isWindowOpen}
        onClose={closeWindow}
        onMinimize={minimizeWindow}
      />
    </>
  );
};

export default ChatManager;
