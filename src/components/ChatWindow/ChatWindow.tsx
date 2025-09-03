'use client';

import { memo, useRef, useCallback, useState } from 'react';
import ChatRoom from '../ChatRoom/ChatRoom';
import { useWindowDrag } from '../../hooks/useWindowDrag';
import { isMobile } from '../../utils/windowUtils';
import type { ChatWindowProps } from '../../types/chat';
import styles from './ChatWindow.module.css';

/**
 * Optimized ChatWindow Component
 * Lightweight, performant window implementation
 */
const ChatWindow = memo<ChatWindowProps>(({ isOpen, onClose, onMinimize }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const { position, isDragging, startDrag } = useWindowDrag();
  
  const mobile = isMobile();

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (isMaximized || mobile) return;
    
    const rect = windowRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    startDrag(e, rect);
  }, [isMaximized, mobile, startDrag]);

  const handleMaximizeToggle = useCallback(() => {
    if (mobile) return;
    setIsMaximized(prev => !prev);
  }, [mobile]);

  if (!isOpen) return null;

  const windowClasses = [
    styles.window,
    isMaximized && styles.maximized,
    mobile && styles.mobile,
    isDragging && styles.dragging,
  ].filter(Boolean).join(' ');

  const windowStyle = (!isMaximized && !mobile) ? {
    transform: `translate(${position.x}px, ${position.y}px)`,
  } : undefined;

  return (
    <div className={styles.overlay}>
      <div
        ref={windowRef}
        className={windowClasses}
        style={windowStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-window-title"
      >
        {/* Title Bar */}
        <header 
          className={styles.titleBar}
          onMouseDown={handleDragStart}
          onDoubleClick={handleMaximizeToggle}
        >
          <div className={styles.titleContent}>
            <span className={styles.icon} role="img" aria-label="Chat">💬</span>
            <h2 id="chat-window-title" className={styles.title}>Chat Room</h2>
          </div>
          
          <div className={styles.controls}>
            <button
              className={styles.controlBtn}
              onClick={onMinimize}
              title="Minimize"
              aria-label="Minimize window"
            >
              −
            </button>
            {!mobile && (
              <button
                className={styles.controlBtn}
                onClick={handleMaximizeToggle}
                title={isMaximized ? 'Restore' : 'Maximize'}
                aria-label={isMaximized ? 'Restore window' : 'Maximize window'}
              >
                {isMaximized ? '⧉' : '□'}
              </button>
            )}
            <button
              className={`${styles.controlBtn} ${styles.closeBtn}`}
              onClick={onClose}
              title="Close"
              aria-label="Close window"
            >
              ×
            </button>
          </div>
        </header>

        {/* Content */}
        <main className={styles.content}>
          <ChatRoom />
        </main>
      </div>
    </div>
  );
});

ChatWindow.displayName = 'ChatWindow';

export default ChatWindow;
