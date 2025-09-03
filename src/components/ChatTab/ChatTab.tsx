'use client';

import { memo } from 'react';
import type { ChatTabProps } from '../../types/chat';
import styles from './ChatTab.module.css';

/**
 * Optimized ChatTab Component
 * Memoized for performance, minimal re-renders
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
