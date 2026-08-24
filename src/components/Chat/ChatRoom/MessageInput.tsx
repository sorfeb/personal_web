'use client';

import React, { memo } from 'react';
import Button from '../../ui/Button';
import { CHAT_LIMITS } from '../../../constants/chat';
import styles from './ChatRoom.module.css';

/**
 * MessageInput Component Props
 */
interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error?: string;
}

/**
 * MessageInput Component
 * 
 * Message input form with character limit and error handling.
 * Provides real-time feedback and accessibility features.
 * 
 * Features:
 * - Character count with warning threshold
 * - Loading state handling
 * - Error display
 * - Keyboard shortcuts
 * - Responsive design
 */
const MessageInput = memo<MessageInputProps>(({ 
  value, 
  onChange, 
  onSubmit, 
  isLoading, 
  error 
}) => {
  // Same constant the server enforces, so the counter cannot drift from the
  // limit that actually rejects a message.
  const maxChars = CHAT_LIMITS.MAX_MESSAGE_LENGTH;
  const charCount = value.length;
  const isNearLimit = charCount > maxChars * 0.8;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxChars) {
      onChange(e.target.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={onSubmit} className={styles.messageForm}>
      {error && (
        <div className={styles.errorMessage}>
          <p>Error: {error}</p>
        </div>
      )}
      
      <div className={styles.messageInputGroup}>
        <textarea
          className={styles.messageInput}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Ctrl+Enter to send)"
          disabled={isLoading}
          rows={3}
          aria-label="Message input"
        />
        <div className={`${styles.charCount} ${isNearLimit ? styles.warning : ''}`}>
          {charCount}/{maxChars}
        </div>
      </div>
      
      <Button
        type="submit"
        variant="chrome"
        badge="A"
        className={styles.sendButton}
        disabled={!value.trim()}
        loading={isLoading}
        aria-label="Send message"
      >
        {isLoading ? 'Sending...' : 'Send'}
      </Button>
    </form>
  );
});

MessageInput.displayName = 'MessageInput';

export default MessageInput;
