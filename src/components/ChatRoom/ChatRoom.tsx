'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '@stackframe/stack';
import { trpc } from '../../utils/trpc';
import styles from './ChatRoom.module.css';

interface MessageDisplayProps {
  text: string;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

const MessageItem: React.FC<MessageDisplayProps> = ({ text, createdAt, author }) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
    }).format(new Date(date));
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={styles['message-item']}>
      <div className={styles['message-avatar']}>
        {author.image ? (
          <img
            src={author.image}
            alt={author.name || 'User'}
            className={styles['avatar-image']}
          />
        ) : (
          getInitials(author.name)
        )}
      </div>
      <div className={styles['message-content']}>
        <div className={styles['message-author']}>
          {author.name || 'Anonymous User'}
        </div>
        <div className={styles['message-text']}>{text}</div>
        <div className={styles['message-time']}>
          {formatTime(createdAt)}
        </div>
      </div>
    </div>
  );
};

const ChatRoom: React.FC = () => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useUser();

  // Fetch messages
  const {
    data: messages,
    isLoading: messagesLoading,
    error: messagesError,
    refetch: refetchMessages
  } = trpc.messages.getAll.useQuery();

  // Create message mutation
  const createMessage = trpc.messages.create.useMutation({
    onSuccess: () => {
      setMessageText('');
      refetchMessages();
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || createMessage.isPending || !user) {
      return;
    }

    try {
      await createMessage.mutateAsync({
        text: messageText.trim(),
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const charCount = messageText.length;
  const maxChars = 500;
  const isNearLimit = charCount > maxChars * 0.8;

  return (
    <div className={styles['chatroom-container']}>
      <header className={styles['chatroom-header']}>
        <h1 className={styles['chatroom-title']}>Public Chatroom</h1>
        <p className={styles['chatroom-subtitle']}>
          Connect with others! {user ? 'You can send messages.' : 'Sign in to participate.'}
        </p>
      </header>

      <div className={styles['messages-container']}>
        {messagesLoading && (
          <div className={styles['loading-state']}>
            Loading messages...
          </div>
        )}

        {messagesError && (
          <div className={styles['error-state']}>
            Error loading messages: {messagesError.message}
          </div>
        )}

        {messages && messages.length === 0 && (
          <div className={styles['empty-state']}>
            <p>No messages yet.</p>
            <p>{user ? 'Be the first to say something!' : 'Sign in to start the conversation!'}</p>
          </div>
        )}

        {messages && messages.length > 0 && (
          <>
            {messages.map((message: any) => (
              <MessageItem
                key={message.id}
                {...message}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className={styles['message-form']}>
          <div className={styles['message-input-group']}>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              className={styles['message-input']}
              maxLength={maxChars}
              disabled={createMessage.isPending}
            />
            <div className={`${styles['char-count']} ${isNearLimit ? styles.warning : ''}`}>
              {charCount}/{maxChars}
            </div>
          </div>
          <button
            type="submit"
            disabled={!messageText.trim() || createMessage.isPending || charCount > maxChars}
            className={styles['send-button']}
          >
            {createMessage.isPending ? 'Sending...' : 'Send'}
          </button>
        </form>
      ) : (
        <div className={styles['auth-prompt']}>
          <h3>Sign in to join the conversation</h3>
          <p>You need to be signed in with Google or GitHub to send messages.</p>
        </div>
      )}

      {createMessage.error && (
        <div className={styles['error-state']}>
          Failed to send message: {createMessage.error.message}
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
