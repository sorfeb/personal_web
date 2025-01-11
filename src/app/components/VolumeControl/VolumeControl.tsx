'use client';

import React, { useRef, useState } from 'react';
import styles from './VolumeControl.module.css';

const VolumeControl: React.FC = () => {
  const [volume, setVolume] = useState(0.5); // Default volume: 50%
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className={styles.container}>
      <audio ref={audioRef} loop autoPlay>
        <source src="/assets/audio/background-music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div className={styles.controls}>
        <span className={styles.icon} role="img" aria-label="Speaker">
          🔊
        </span>
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
