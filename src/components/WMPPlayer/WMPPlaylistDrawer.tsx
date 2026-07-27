'use client';

import { memo } from 'react';
import type { Track } from '@/types/wmp';
import { useAudioManager } from '@/hooks/useAudioManager';
import styles from './WMPPlaylistDrawer.module.css';

interface WMPPlaylistDrawerProps {
  playlist: Track[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

/**
 * Track list rendered inside the right-ear playlist drawer (sPlEar). The
 * drawer's slide-out animation lives in WMPSubview; this component owns the
 * track row UI and click-to-select behavior.
 */
export const WMPPlaylistDrawer = memo<WMPPlaylistDrawerProps>(
  function WMPPlaylistDrawer({ playlist, currentIndex, onSelect }) {
    const { playSound } = useAudioManager();

    if (playlist.length === 0) {
      return <p className={styles.empty}>No tracks queued.</p>;
    }

    return (
      <ul className={styles.list}>
        {playlist.map((track, index) => {
          const isActive = index === currentIndex;
          return (
            <li
              key={track.id}
              className={isActive ? styles.activeRow : styles.row}
              onMouseEnter={() => playSound('hover')}
              onClick={() => {
                playSound('click');
                onSelect(index);
              }}
            >
              <span className={styles.name}>{track.name}</span>
              {track.artist && (
                <span className={styles.artist}>{track.artist}</span>
              )}
            </li>
          );
        })}
      </ul>
    );
  }
);
