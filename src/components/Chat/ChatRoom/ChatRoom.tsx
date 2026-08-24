'use client';

import React, { memo, useState, useRef, useCallback } from 'react';
import { trpc } from '../../../utils/trpc';
import { authClient } from '../../../lib/auth-client';
import { useAutoScroll } from '@/hooks';
import { useAchievements } from '../../../hooks/useAchievements';
import { DEFAULT_ROOM_SLUG } from '../../../constants/chat';
import Button from '../../ui/Button';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import styles from './ChatRoom.module.css';

/**
 * ChatRoom Component
 *
 * Main chat interface with message display and input functionality.
 *
 * Messages are fetched on load and refetched after you post; there is no push
 * transport yet, so another visitor's message only appears once the query goes
 * stale and refetches. SOR-159 replaces this with a real transport.
 *
 * Features:
 * - Message transcript with auto-scroll to the newest entry
 * - Authentication-aware interface
 * - Message input with character limits
 * - Loading and error states
 * - Responsive design
 */
interface ChatRoomProps {
  /** Room to open. Defaults to the seeded public room. */
  roomSlug?: string;
}

const ChatRoom = memo<ChatRoomProps>(({ roomSlug = DEFAULT_ROOM_SLUG }) => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: session } = authClient.useSession();
  const user = session?.user ?? null;
  const { unlock } = useAchievements();

  // Fetch messages with caching for performance
  const {
    data,
    isLoading: messagesLoading,
    error: messagesError,
    refetch: refetchMessages
  } = trpc.messages.listByRoom.useQuery({ roomSlug }, {
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 300000, // Keep in cache for 5 minutes
  });

  const messages = data?.messages;

  // Create message mutation
  const createMessage = trpc.messages.send.useMutation({
    onSuccess: () => {
      setMessageText('');
      refetchMessages();
      // Server granted it in messages.send; surface the toast locally
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

    // The mutation's own error state drives the message shown in MessageInput,
    // so a rejection needs catching but not reporting here.
    try {
      await createMessage.mutateAsync({ roomSlug, text: messageText.trim() });
    } catch {
      // Surfaced through createMessage.error below.
    }
  }, [user, messageText, createMessage, roomSlug]);

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
          <Button
            variant="chrome"
            badge="A"
            className={styles.signInButton}
            onClick={() => authClient.signIn.social({ provider: 'github', callbackURL: '/chatroom' })}
          >
            Sign in with GitHub
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Public Chat</h2>
        <p className={styles.subtitle}>
          Leave a message for other visitors
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
