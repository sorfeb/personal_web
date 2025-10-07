'use client';

import ChatRoom from '../../components/ChatRoom/ChatRoom';
import styles from './Chatroom.module.css';

export default function ChatroomPage() {
  return (
    <div className={styles['chatroom-page']}>
      <ChatRoom />
    </div>
  );
}
