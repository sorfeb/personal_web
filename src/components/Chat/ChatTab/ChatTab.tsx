'use client';

import React, { memo } from 'react';
import type { ChatTabProps } from '../../../types/chat';
import styles from './ChatTab.module.css';

/**
 * ChatTab Component
 * 
 * Floating bottom-left tab that serves as chat window trigger.
 * Provides visual feedback and accessibility features.
 * 
 * Features:
 * - Hover animations with smooth transitions
 * - Keyboard accessibility (Enter/Space)
 * - Visual state indicators (active/inactive)
 * - Optional notification badge
 * - Mobile responsive design
 */
const ChatTab = memo<ChatTabProps>(({ onClick, isActive, hasNotification = false }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <button
      className={`${styles.tab} ${isActive ? styles.active : ''}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      title="Open Chat Room"
      aria-label="Open Chat Room"
      type="button"
    >
      <div className={styles.content}>
        <span className={styles.icon} role="img" aria-label="Chat">💬</span>
        <span className={styles.text}>Chat</span>
      </div>
      
      {hasNotification && (
        <div className={styles.notification} aria-label="New messages" />
      )}
    </button>
  );
});

ChatTab.displayName = 'ChatTab';

export default ChatTab;
