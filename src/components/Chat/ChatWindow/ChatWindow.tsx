'use client';

import React, { memo, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import ChatRoom from '../ChatRoom/ChatRoom';
import { useWindowDrag } from '../../../hooks/useWindowDrag';
import { useEventListener, useMountEffect } from '@/hooks';
import { isMobile } from '../../../utils/windowUtils';
import type { ChatWindowProps } from '../../../types/chat';
import styles from './ChatWindow.module.css';

/**
 * ChatWindow Component
 * 
 * Desktop-style draggable window implementing Windows OS behavior.
 * Uses React Portal to prevent main app re-renders when chat opens.
 * 
 * Features:
 * - Windows-style dragging with proper offset calculation
 * - Maximize/minimize functionality
 * - Mobile responsive design
 * - Portal rendering for performance optimization
 */
const ChatWindow = memo<ChatWindowProps>(({ isOpen, onClose, onMinimize }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const { position, isDragging, startDrag } = useWindowDrag();

  // Client-side initialization: establish mobile flag + portal container.
  useMountEffect(() => {
    setMobile(isMobile());

    let container = document.getElementById('chat-portal');
    if (!container) {
      container = document.createElement('div');
      container.id = 'chat-portal';
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.zIndex = '9999';
      container.style.pointerEvents = 'none';
      document.body.appendChild(container);
    }
    setPortalContainer(container);

    return () => {
      // Clean up portal container if empty
      const existingContainer = document.getElementById('chat-portal');
      if (existingContainer && existingContainer.children.length === 0) {
        existingContainer.remove();
      }
    };
  });

  // Keep mobile flag in sync with viewport width
  useEventListener(typeof window === 'undefined' ? null : window, 'resize', () =>
    setMobile(isMobile())
  );

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

  // Prevent scroll events from bubbling to parent
  const handleWindowWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
  }, []);

  const handleWindowScroll = useCallback((e: React.UIEvent) => {
    e.stopPropagation();
  }, []);

  // Early return if not open
  if (!isOpen) return null;

  // Build window classes
  const windowClasses = [
    styles.window,
    isMaximized && styles.maximized,
    mobile && styles.mobile,
    isDragging && styles.dragging,
  ].filter(Boolean).join(' ');

  // Calculate window style for positioning
  const windowStyle = (!isMaximized && !mobile) ? {
    transform: `translate(${position.x}px, ${position.y}px)`,
  } : undefined;

  const windowContent = (
    <div className={styles.overlay}>
      <div
        ref={windowRef}
        className={windowClasses}
        style={windowStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-window-title"
        onWheel={handleWindowWheel}
        onScroll={handleWindowScroll}
      >
        {/* Title Bar */}
        {/* Drag-to-move and double-click-to-maximize are pointer-only
            enhancements; maximize is also reachable via the control buttons
            below, so no keyboard affordance is lost. */}
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
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

  // Render through portal to prevent main app re-renders
  return portalContainer ? createPortal(windowContent, portalContainer) : null;
});

ChatWindow.displayName = 'ChatWindow';

export default ChatWindow;
