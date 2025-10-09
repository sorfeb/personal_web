'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useAudioManager } from '../../../hooks/useAudioManager';
import type { ChatTabProps } from '../../../types/chat';
import styles from './ChatTab.module.css';

/**
 * ChatTab Component - Pullable File Folder Tab
 * 
 * File folder-style tab that slides out from left edge.
 * Uses green gradient aesthetics matching ProfileCard.
 * 
 * Features:
 * - File folder pull tab appearance
 * - Slide-out animation on hover
 * - Green glowing gradient aesthetics
 * - Audio feedback (hover/click sounds)
 * - Keyboard accessibility (Enter/Space)
 * - Visual state indicators (active/inactive)
 * - Optional notification badge
 * - Mobile responsive design
 */
const ChatTab = memo<ChatTabProps>(({ onClick, isActive, hasNotification = false }) => {
  const { playSound } = useAudioManager();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  const handleClick = () => {
    playSound('click');
    onClick();
  };

  const handleHover = () => {
    playSound('owawa');
  };

  return (
    <motion.button
      className={`${styles.folderTab} ${isActive ? styles.active : ''}`}
      onClick={handleClick}
      onMouseEnter={handleHover}
      onKeyDown={handleKeyDown}
      title="Open Chat Room"
      aria-label="Open Chat Room"
      type="button"
      initial={{ y: 0 }}
      whileHover={{ y: -60 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94] // cubic-bezier for smooth pull-up
      }}
    >
      {/* File folder tab shape */}
      <div className={styles.tabShape}>
        {/* Main content area */}
        <div className={styles.tabContent}>
          <div className={styles.iconContainer}>
            <span className={styles.icon} role="img" aria-label="Chat">💬</span>
          </div>
          <div className={styles.textContainer}>
            <span className={styles.text}>Chat</span>
          </div>
        </div>
        
        {/* Notification badge */}
        {hasNotification && (
          <motion.div 
            className={styles.notification}
            aria-label="New messages"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          />
        )}
      </div>
    </motion.button>
  );
});

ChatTab.displayName = 'ChatTab';

export default ChatTab;
