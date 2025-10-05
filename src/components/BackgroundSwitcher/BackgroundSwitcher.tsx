'use client';

import React, { useState } from 'react';
import { useAudioManager } from '../../hooks/useAudioManager';
import BackgroundSelector from '../BackgroundSelector/BackgroundSelector';
import styles from './BackgroundSwitcher.module.css';

/**
 * BackgroundSwitcher Component
 * 
 * Button to open the BackgroundSelector modal.
 * Provides quick access to background customization.
 * 
 * Integrates with Xbox audio system for consistent UX.
 */

const BackgroundSwitcher: React.FC = () => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const { playSound } = useAudioManager();

  const handleOpenSelector = () => {
    playSound('click');
    setIsSelectorOpen(true);
  };

  const handleCloseSelector = () => {
    setIsSelectorOpen(false);
  };

  return (
    <>
      <button
        className={styles.button}
        onClick={handleOpenSelector}
        onMouseEnter={() => playSound('hover')}
        aria-label="Change background"
        title="Change background"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.icon}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <span className={styles.label}>Backgrounds</span>
      </button>

      <BackgroundSelector isOpen={isSelectorOpen} onClose={handleCloseSelector} />
    </>
  );
};

export default BackgroundSwitcher;
