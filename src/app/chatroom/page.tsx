'use client';

import React from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import ChatRoom from '../../components/Chat/ChatRoom/ChatRoom';

export default function ChatroomPage() {
  return (
    <PageLayout title="Chat" size="wide">
      <PageLayout.Header />
      <PageLayout.Body>
        <ChatRoom />
      </PageLayout.Body>
    </PageLayout>
  );
}
