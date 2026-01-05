'use client';

import React, { memo } from 'react';
import { useAudioManager } from '../../../hooks/useAudioManager';
import styles from './Toggle.module.css';

interface ToggleProps {
  /** Whether the toggle is enabled */
  enabled: boolean;
  /** Callback when toggle state changes */
  onChange: (enabled: boolean) => void;
  /** Optional disabled state */
  disabled?: boolean;
  /** Accessible label */
  ariaLabel?: string;
  /** Optional size variant */
  size?: 'sm' | 'md';
  /** Whether to play sound on toggle */
  playAudio?: boolean;
}

/**
 * Toggle
 *
 * Xbox 360-style toggle switch with metallic appearance
 * and characteristic green glow when enabled.
 */
const Toggle: React.FC<ToggleProps> = ({
  enabled,
  onChange,
  disabled = false,
  ariaLabel = 'Toggle',
  size = 'md',
  playAudio = true,
}) => {
  const { playSound } = useAudioManager();

  const handleClick = () => {
    if (disabled) return;
    if (playAudio) {
      playSound('navigation');
    }
    onChange(!enabled);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (playAudio) {
        playSound('navigation');
      }
      onChange(!enabled);
    }
  };

  const classNames = [
    styles.toggle,
    styles[size],
    enabled && styles.enabled,
    disabled && styles.disabled,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled ? 'true' : 'false'}
      aria-label={ariaLabel}
      className={classNames}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
    >
      <span className={styles.thumb} />
    </button>
  );
};

export default memo(Toggle);
