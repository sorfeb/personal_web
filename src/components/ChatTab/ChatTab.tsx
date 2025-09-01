'use client';

import React, { useState } from 'react';
import styles from './ChatTab.module.css';

interface ChatTabProps {
  onClick: () => void;
  isActive: boolean;
}

const ChatTab: React.FC<ChatTabProps> = ({ onClick, isActive }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    onClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <button
      className={`${styles['chat-tab']} ${isActive ? styles['active'] : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Open Chat Room"
      aria-label="Open Chat Room"
    >
      <div className={styles['tab-content']}>
        <div className={styles['chat-icon']}>
          💬
        </div>
        <span className={`${styles['tab-text']} ${isHovered ? styles['visible'] : ''}`}>
          Chat
        </span>
      </div>
      
      {/* Notification indicator (can be used later) */}
      {/* <div className={styles['notification-dot']} /> */}
    </button>
  );
};

export default ChatTab;
