'use client';

import React, { memo } from 'react';
import { useWMPPlayerContext } from '@/context/WMPPlayerContext';
import { useAudioManager } from '@/hooks/useAudioManager';
import styles from './WMPToggleButton.module.css';

interface WMPToggleButtonProps {
  variant?: 'icon' | 'text' | 'full';
  className?: string;
}

/**
 * WMPToggleButton Component
 *
 * Reusable button to show/hide the global WMP player.
 * Can be placed on any route to control player visibility.
 *
 * Variants:
 * - icon: Just music emoji (compact)
 * - text: Just "Show/Hide Player" text
 * - full: Icon + text (default)
 */
export const WMPToggleButton = memo(function WMPToggleButton({
  variant = 'full',
  className = '',
}: WMPToggleButtonProps) {
  const { isVisible, togglePlayer } = useWMPPlayerContext();
  const { playSound } = useAudioManager();

  const handleClick = () => {
    playSound('click');
    togglePlayer();
  };

  const buttonClasses = [
    styles.button,
    styles[variant],
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      aria-label={isVisible ? 'Hide Music Player' : 'Show Music Player'}
      title={isVisible ? 'Hide Music Player' : 'Show Music Player'}
    >
      {variant !== 'text' && <span className={styles.icon}>🎵</span>}
      {variant !== 'icon' && (
        <span className={styles.label}>
          {isVisible ? 'Hide Player' : 'Show Player'}
        </span>
      )}
    </button>
  );
});
