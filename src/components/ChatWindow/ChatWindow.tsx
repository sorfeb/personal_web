'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import ChatRoom from '../ChatRoom/ChatRoom';
import styles from './ChatWindow.module.css';

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose, onMinimize }) => {
  // Window state
  const [position, setPosition] = useState<Position>({ x: 100, y: 100 });
  const [size, setSize] = useState<Size>({ width: 600, height: 500 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });

  // Refs for DOM manipulation
  const windowRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLButtonElement>(null);

  // Window bounds
  const getWindowBounds = useCallback(() => {
    return {
      maxWidth: window.innerWidth - 50,
      maxHeight: window.innerHeight - 50,
      minWidth: 400,
      minHeight: 300,
    };
  }, []);

  // Handle drag start
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return;
    
    const rect = windowRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, [isMaximized]);

  // Handle drag move
  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!isDragging || isMaximized) return;

    const bounds = getWindowBounds();
    const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, bounds.maxWidth - size.width));
    const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, bounds.maxHeight - size.height));

    setPosition({ x: newX, y: newY });
  }, [isDragging, isMaximized, dragOffset, size, getWindowBounds]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle resize start
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  }, []);

  // Handle resize move
  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing || isMaximized) return;

    const bounds = getWindowBounds();
    const newWidth = Math.max(bounds.minWidth, Math.min(e.clientX - position.x, bounds.maxWidth));
    const newHeight = Math.max(bounds.minHeight, Math.min(e.clientY - position.y, bounds.maxHeight));

    setSize({ width: newWidth, height: newHeight });
  }, [isResizing, isMaximized, position, getWindowBounds]);

  // Handle resize end
  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Maximize/Restore toggle
  const handleMaximizeToggle = useCallback(() => {
    setIsMaximized(!isMaximized);
  }, [isMaximized]);

  // Mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  // Prevent text selection during drag/resize
  useEffect(() => {
    if (isDragging || isResizing) {
      document.body.style.userSelect = 'none';
      document.body.style.cursor = isDragging ? 'grabbing' : 'nw-resize';
    } else {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, isResizing]);

  if (!isOpen) return null;

  return (
    <div className={styles['window-overlay']}>
      <div
        ref={windowRef}
        className={`${styles['chat-window']} ${
          isMaximized ? styles['maximized'] : ''
        } ${isMaximized ? styles['window-maximized'] : styles['window-normal']}`}
        style={
          isMaximized
            ? undefined
            : {
                top: position.y,
                left: position.x,
                width: size.width,
                height: size.height,
              }
        }
      >
        {/* Window Title Bar */}
        <header
          className={styles['title-bar']}
          onMouseDown={handleDragStart}
          onDoubleClick={handleMaximizeToggle}
        >
          <div className={styles['title-bar-left']}>
            <div className={styles['window-icon']}>💬</div>
            <span className={styles['window-title']}>Chat Room</span>
          </div>
          
          <div className={styles['title-bar-controls']}>
            <button
              className={`${styles['control-button']} ${styles['minimize']}`}
              onClick={onMinimize}
              title="Minimize"
            >
              −
            </button>
            <button
              className={`${styles['control-button']} ${styles['maximize']}`}
              onClick={handleMaximizeToggle}
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? '⧉' : '□'}
            </button>
            <button
              className={`${styles['control-button']} ${styles['close']}`}
              onClick={onClose}
              title="Close"
            >
              ×
            </button>
          </div>
        </header>

        {/* Window Content */}
        <div className={styles['window-content']}>
          <ChatRoom />
        </div>

        {/* Resize Handle */}
        {!isMaximized && (
          <button
            ref={resizeRef}
            className={styles['resize-handle']}
            onMouseDown={handleResizeStart}
            aria-label="Resize window"
            tabIndex={-1}
          />
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
