'use client';

import React, { memo } from 'react';
import styles from './HelpButton.module.css';
import { useAudioManager } from '../../hooks/useAudioManager';
import { useShepherdTour } from '../../context/ShepherdTourContext';

const HelpButton: React.FC = memo(() => {
  const { playSound } = useAudioManager();
  const { startTour } = useShepherdTour();

  const playClickSound = () => playSound('click');
  const playHoverSound = () => playSound('ting');

  const handleClick = () => {
    playClickSound();
    startTour();
  };

  return (
    <button
      className={styles.helpButton}
      onClick={handleClick}
      onMouseEnter={playHoverSound}
      aria-label="Help and Tutorial"
    >
      <div className={styles.questionMark}>?</div>
    </button>
  );
});

HelpButton.displayName = 'HelpButton';

export default HelpButton;
