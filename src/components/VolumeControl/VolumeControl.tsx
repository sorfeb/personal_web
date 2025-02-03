'use client';

import React from 'react';
import styles from './VolumeControl.module.css';
import { useVolume } from '../../context/VolumeContext';

const VolumeControl: React.FC = () => {
  const { volume, setVolume } = useVolume();

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(event.target.value));
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <img
          src="assets/icons/volume.svg"
          alt="speaker_icon"
          className={styles.icon}
        />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className={styles.slider}
        />
      </div>
    </div>
  );
};

export default VolumeControl;
