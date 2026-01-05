'use client';

import React, { memo, useMemo } from 'react';
import styles from './ChatRoom.module.css';

/**
 * MessageItem Component Props
 */
interface MessageDisplayProps {
  text: string;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

/**
 * MessageItem Component
 * 
 * Individual message display component with author info and timestamp.
 * Memoized to prevent unnecessary re-renders when other messages change.
 * 
 * Features:
 * - Author avatar with fallback initials
 * - Formatted timestamp
 * - Responsive layout
 * - Optimized performance
 */
const MessageItem = memo<MessageDisplayProps>(({ text, createdAt, author }) => {
  // Memoized formatted time to prevent recalculation
  const formattedTime = useMemo(() => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
    }).format(createdAt);
  }, [createdAt]);

  // Memoized author initials for fallback avatar
  const authorInitials = useMemo(() => {
    if (!author.name) return '?';
    return author.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [author.name]);

  return (
    <div className={styles.messageItem}>
      <div className={styles.messageAvatar}>
        {author.image ? (
          <img 
            src={author.image} 
            alt={author.name || 'User'} 
            className={styles.avatarImage} 
          />
        ) : (
          <span>{authorInitials}</span>
        )}
      </div>
      <div className={styles.messageContent}>
        <div className={styles.messageAuthor}>
          {author.name || 'Anonymous'}
        </div>
        <div className={styles.messageText}>{text}</div>
        <div className={styles.messageTime}>{formattedTime}</div>
      </div>
    </div>
  );
});

MessageItem.displayName = 'MessageItem';

export default MessageItem;
