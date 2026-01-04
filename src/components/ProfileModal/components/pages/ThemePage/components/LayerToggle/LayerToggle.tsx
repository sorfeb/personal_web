'use client';

import React, { memo } from 'react';
import { useAudioManager } from '../../../../../../../hooks/useAudioManager';
import styles from './LayerToggle.module.css';

interface LayerToggleProps {
  /** Whether the toggle is enabled */
  enabled: boolean;
  /** Callback when toggle state changes */
  onChange: (enabled: boolean) => void;
  /** Optional disabled state */
  disabled?: boolean;
  /** Accessible label */
  ariaLabel?: string;
}

/**
 * LayerToggle
 *
 * Xbox 360-style toggle switch with metallic appearance
 * and characteristic green glow when enabled.
 */
const LayerToggle: React.FC<LayerToggleProps> = ({
  enabled,
  onChange,
  disabled = false,
  ariaLabel = 'Toggle layer',
}) => {
  const { playSound } = useAudioManager();

  const handleClick = () => {
    if (disabled) return;
    playSound('navigation');
    onChange(!enabled);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      playSound('navigation');
      onChange(!enabled);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={ariaLabel}
      className={`${styles.toggle} ${enabled ? styles.enabled : ''} ${disabled ? styles.disabled : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
    >
      <span className={styles.thumb} />
    </button>
  );
};

export default memo(LayerToggle);
