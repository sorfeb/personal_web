'use client';

import React, { useState, useCallback, useRef, memo } from 'react';
import { createPortal } from 'react-dom';
import { WMPPlayer } from './WMPPlayer';
import { useWMPPlayerContext, PLAYER_DIMENSIONS } from '@/context/WMPPlayerContext';
import { useAudioManager } from '@/hooks/useAudioManager';
import { useEventListener, useMountEffect } from '@/hooks';
import { constrainPosition, calculateDragOffset, calculateDragPosition, setUserSelectNone } from '@/utils/windowUtils';
import styles from './GlobalWMPPlayer.module.css';

/**
 * GlobalWMPPlayer Component
 *
 * Floating draggable Windows Media Player window that persists across routes.
 * Renders via React Portal to prevent re-renders and maintain independent z-index layer.
 *
 * Features:
 * - Draggable window with constrained bounds
 * - Minimize/restore functionality
 * - Close button (pauses music per user preference)
 * - Position persistence via context/localStorage
 * - Portal rendering for global availability
 * - Keyboard shortcuts (Esc to close)
 */
export const GlobalWMPPlayer = memo(function GlobalWMPPlayer() {
  const {
    isVisible,
    isMinimized,
    position,
    isLoading,
    hidePlayer,
    minimize,
    restore,
    setPosition,
    currentPlaylist,
    playerRef: contextPlayerRef,
  } = useWMPPlayerContext();

  const { playSound } = useAudioManager();

  const [isDragging, setIsDragging] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  const windowRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cleanupRef = useRef<(() => void) | null>(null);
  const internalPlayerRef = useRef<{ pause: () => void; play: () => void } | null>(null);

  // effect:audited — planned ref sync for external playback control via context.
  // `internalPlayerRef` is not yet wired through to WMPPlayer's audio element,
  // so this is a no-op today, but the plumbing is kept so context consumers can
  // pause/play once WMPPlayer forwards a handle.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    contextPlayerRef.current = internalPlayerRef.current;
  }, [contextPlayerRef]);

  // Set up portal container
  useMountEffect(() => {
    const container = document.createElement('div');
    container.id = 'wmp-player-portal';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 998;
      pointer-events: none;
    `;

    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
  });

  // Handle viewport resize - constrain position to stay within bounds
  useEventListener(window, 'resize', () => {
    const constrained = constrainPosition(position);
    if (constrained.x !== position.x || constrained.y !== position.y) {
      setPosition(constrained);
    }
  });

  // Keyboard shortcuts: Esc closes the player when visible
  useEventListener(isVisible ? window : null, 'keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      hidePlayer();
    }
  });

  // Drag handlers
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (isMinimized) return; // Don't drag when minimized

    const rect = windowRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Calculate precise offset to prevent window jumping
    dragOffsetRef.current = calculateDragOffset(e, rect);
    setIsDragging(true);
    cleanupRef.current = setUserSelectNone();
  }, [isMinimized]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      // Calculate new position using drag offset
      const newPosition = calculateDragPosition(e, dragOffsetRef.current);

      // Apply constraints to keep window within bounds
      const constrained = constrainPosition(newPosition);

      setPosition(constrained);
    },
    [isDragging, setPosition]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    cleanupRef.current?.();
    cleanupRef.current = null;
  }, []);

  // Drag event listeners — only bound while actively dragging
  useEventListener(isDragging ? document : null, 'mousemove', handleMouseMove, {
    passive: true,
  });
  useEventListener(isDragging ? document : null, 'mouseup', handleMouseUp);

  // Control handler for empty state
  const handleClose = useCallback(() => {
    playSound('click');
    hidePlayer();
  }, [playSound, hidePlayer]);

  // Don't render if loading, not visible, or no portal container
  if (isLoading || !isVisible || !portalContainer) return null;

  const content = (
    <div className={styles.overlay}>
      {currentPlaylist.length > 0 ? (
        <div
          ref={windowRef}
          className={`${styles.playerWindow} ${isDragging ? styles.dragging : ''}`}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            pointerEvents: 'auto',
          }}
          onMouseDown={handleDragStart}
        >
          <WMPPlayer
            skinPath="/assets/skins/headspace"
            playlist={currentPlaylist}
            autoPlay={false}
            onClose={hidePlayer}
            onMinimize={minimize}
          />
        </div>
      ) : (
        <div
          ref={windowRef}
          className={`${styles.emptyWindow} ${isDragging ? styles.dragging : ''}`}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            pointerEvents: 'auto',
          }}
        >
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>No playlist loaded</p>
            <p className={styles.emptyHint}>
              Go to Music or My Playlists to load tracks
            </p>
            <button onClick={handleClose} className={styles.closeEmpty}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(content, portalContainer);
});
