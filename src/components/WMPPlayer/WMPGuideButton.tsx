'use client';

import React, { memo, useState, useCallback, useRef } from 'react';
import { useWMPPlayerContext } from '@/context/WMPPlayerContext';
import { useAudioManager } from '@/hooks/useAudioManager';
import { trpc } from '@/utils/trpc';
import styles from './WMPGuideButton.module.css';

/**
 * WMPGuideButton
 *
 * Xbox 360 Guide Button-style toggle for the WMP player.
 * Sits in the dashboard header next to the ProfileCard.
 * Shows a green "ring of light" glow when the player is active.
 * Loads the default audio catalog on first click when no playlist is set.
 */
export const WMPGuideButton = memo(function WMPGuideButton() {
  const { isVisible, currentPlaylist, hidePlayer, openWithPlaylist, showPlayer } = useWMPPlayerContext();
  const { playSound } = useAudioManager();
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);
  const hasFetchedRef = useRef(false);

  const isActive = isVisible && currentPlaylist.length > 0;

  const utils = trpc.useUtils();

  const loadDefaultPlaylist = useCallback(async () => {
    if (hasFetchedRef.current) return true;
    setIsLoadingPlaylist(true);

    try {
      const catalog = await utils.audio.getCatalog.fetch();
      if (!catalog || catalog.length === 0) return false;
      openWithPlaylist(catalog);
      hasFetchedRef.current = true;
      return true;
    } catch {
      return false;
    } finally {
      setIsLoadingPlaylist(false);
    }
  }, [utils, openWithPlaylist]);

  const handleClick = useCallback(async () => {
    playSound('click');

    if (isVisible) {
      hidePlayer();
      return;
    }

    if (currentPlaylist.length > 0) {
      showPlayer();
      return;
    }

    await loadDefaultPlaylist();
  }, [isVisible, currentPlaylist, playSound, showPlayer, hidePlayer, loadDefaultPlaylist]);

  return (
    <button
      className={`${styles.guideButton} ${isActive ? styles.active : ''} ${isLoadingPlaylist ? styles.loading : ''}`}
      onClick={handleClick}
      disabled={isLoadingPlaylist}
      aria-label={isVisible ? 'Hide Music Player' : 'Show Music Player'}
      title={isLoadingPlaylist ? 'Loading playlist...' : isVisible ? 'Hide Music Player' : 'Show Music Player'}
    >
      <div className={styles.innerRing}>
        {isLoadingPlaylist ? (
          <div className={styles.spinner} />
        ) : (
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"
              fill="currentColor"
            />
          </svg>
        )}
      </div>
    </button>
  );
});
