'use client';

import React, { memo, useState, useRef, useCallback } from 'react';
import { trpc } from '../../../utils/trpc';
import { authClient } from '../../../lib/auth-client';
import { useAutoScroll } from '@/hooks';
import { useAchievements } from '../../../hooks/useAchievements';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import styles from './ChatRoom.module.css';

/**
 * ChatRoom Component
 * 
 * Main chat interface with message display and input functionality.
 * Implements real-time messaging with optimistic updates and error handling.
 * 
 * Features:
 * - Real-time message display with auto-scroll
 * - Authentication-aware interface
 * - Message input with character limits
 * - Loading and error states
 * - Responsive design
 */
const ChatRoom = memo(() => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: session } = authClient.useSession();
  const user = session?.user ?? null;
  const { unlock } = useAchievements();

  // Fetch messages with caching for performance
  const {
    data: messages,
    isLoading: messagesLoading,
    error: messagesError,
    refetch: refetchMessages
  } = trpc.messages.getAll.useQuery(undefined, {
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 300000, // Keep in cache for 5 minutes
  });

  // Create message mutation
  const createMessage = trpc.messages.create.useMutation({
    onSuccess: () => {
      setMessageText('');
      refetchMessages();
      // Server granted it in messages.create; surface the toast locally
      unlock('leave-your-mark');
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useAutoScroll(messagesEndRef, [messages]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !messageText.trim() || createMessage.isPending) {
      return;
    }

    try {
      await createMessage.mutateAsync({ text: messageText.trim() });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [user, messageText, createMessage]);

  // Loading state
  if (messagesLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (messagesError) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <p>Failed to load messages. Please try again.</p>
        </div>
      </div>
    );
  }

  // Unauthenticated state
  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.authPrompt}>
          <h3>Welcome to the Chat Room!</h3>
          <p>Please sign in to participate in the conversation.</p>
          <button
            onClick={() => authClient.signIn.social({ provider: 'github', callbackURL: '/chatroom' })}
            className={styles.signInButton}
          >
            Sign in with GitHub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Public Chat</h1>
        <p className={styles.subtitle}>
          Connect with other users in real-time
        </p>
      </header>

      <div className={styles.messagesContainer}>
        {messages && messages.length > 0 ? (
          messages.map(msg => (
            <MessageItem
              key={msg.id}
              text={msg.text}
              createdAt={new Date(msg.createdAt)}
              author={msg.author}
            />
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No messages yet. Be the first to say something!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        value={messageText}
        onChange={setMessageText}
        onSubmit={handleSubmit}
        isLoading={createMessage.isPending}
        error={createMessage.error?.message}
      />
    </div>
  );
});

ChatRoom.displayName = 'ChatRoom';

export default ChatRoom;
