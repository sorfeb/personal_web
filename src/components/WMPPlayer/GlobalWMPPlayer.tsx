'use client';

import React, { useState, useCallback, useRef, memo } from 'react';
import { createPortal } from 'react-dom';
import Button from '@/components/ui/Button';
import { WMPPlayer } from './WMPPlayer';
import { WMPSkinPicker } from './WMPSkinPicker';
import { useWMPPlayerContext, PLAYER_DIMENSIONS } from '@/context/WMPPlayerContext';
import { useAudioManager } from '@/hooks/useAudioManager';
import { useEventListener, useMountEffect } from '@/hooks';
import { useGamepadScope } from '@/hooks/useGamepadScope';
import { useSpatialNavigation } from '@/hooks/useSpatialNavigation';
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
    skin,
    playerRef: contextPlayerRef,
  } = useWMPPlayerContext();

  const { playSound } = useAudioManager();

  const [isDragging, setIsDragging] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  const windowRef = useRef<HTMLDivElement>(null);
  // Spatial-navigation root: spans the window AND the minimized chip, so
  // gamepad focus still has somewhere to land while the window is hidden.
  const overlayRef = useRef<HTMLDivElement>(null);
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

  // SSR-safe references — `window`/`document` are undefined during server render
  const win = typeof window !== 'undefined' ? window : null;
  const doc = typeof document !== 'undefined' ? document : null;

  // Handle viewport resize - constrain position to stay within bounds
  useEventListener(win, 'resize', () => {
    const constrained = constrainPosition(position);
    if (constrained.x !== position.x || constrained.y !== position.y) {
      setPosition(constrained);
    }
  });

  // Keyboard shortcuts: Esc closes the player when visible.
  // Conditional binding here is the poor-man's scope stack the real one below
  // replaces; Phase 3d removes this listener once keyboard joins the router.
  useEventListener(isVisible ? win : null, 'keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      hidePlayer();
    }
  });

  const { moveFocus } = useSpatialNavigation({ containerRef: overlayRef, enabled: isVisible });

  useGamepadScope({
    id: 'wmp-player',
    enabled: isVisible,
    restoreFocusOnPop: true,
    handlers: {
      up: () => moveFocus('up'),
      down: () => moveFocus('down'),
      left: () => moveFocus('left'),
      right: () => moveFocus('right'),
      back: hidePlayer,
    },
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
  useEventListener(isDragging ? doc : null, 'mousemove', handleMouseMove, {
    passive: true,
  });
  useEventListener(isDragging ? doc : null, 'mouseup', handleMouseUp);

  // Control handler for empty state
  const handleClose = useCallback(() => {
    playSound('click');
    hidePlayer();
  }, [playSound, hidePlayer]);

  // Don't render if loading, not visible, or no portal container
  if (isLoading || !isVisible || !portalContainer) return null;

  const content = (
    <div className={styles.overlay} ref={overlayRef}>
      {currentPlaylist.length > 0 ? (
        <>
          {/*
            * The skin stays mounted while minimized — its audio element and
            * the Spotify embed iframe live inside it, so unmounting would cut
            * playback. display:none hides it; the chip below restores it.
            */}
          {/* Window dragging is a pointer-only affordance — repositioning a
              floating window has no keyboard equivalent to lose. */}
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div
            ref={windowRef}
            className={`${styles.playerWindow} ${isDragging ? styles.dragging : ''} ${
              isMinimized ? styles.playerWindowMinimized : ''
            }`}
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
              pointerEvents: 'auto',
            }}
            onMouseDown={handleDragStart}
          >
            <WMPPlayer
              skin={skin}
              playlist={currentPlaylist}
              autoPlay={false}
              onClose={hidePlayer}
              onMinimize={minimize}
            />
          </div>

          {/*
            * Docked above the window rather than nested inside it: the window
            * is the drag surface, so a control living in it would start a drag
            * on mousedown, and its drop-shadow filter reads the skin's alpha
            * silhouette which the picker is not part of.
            */}
          {!isMinimized && (
            <div
              className={styles.skinPickerDock}
              style={{ transform: `translate(${position.x}px, ${position.y - 36}px)` }}
            >
              <WMPSkinPicker />
            </div>
          )}
          {isMinimized && (
            <div className={styles.minimizedBar}>
              <Button variant="ghost" size="sm" onClick={restore} aria-label="Restore player">
                ♪ Windows Media Player
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                icon={<span aria-hidden="true">✕</span>}
                aria-label="Close player"
                onClick={hidePlayer}
              />
            </div>
          )}
        </>
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
            <p className={styles.emptyText}>Nothing queued up yet</p>
            <p className={styles.emptyHint}>
              Open Music to load the default catalog, or pick something from My Playlists.
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
