'use client';

import React from 'react';
import Image from 'next/image';
import styles from './VolumeControl.module.css';
import { useVolume } from '../../context/VolumeContext';

interface VolumeControlProps {
  /**
   * Controlled volume (0–1). Provide together with `onChange` to scope the
   * slider to local state (e.g. one game's audio). Omit both to read and
   * write the global site volume.
   */
  value?: number;
  /** Change handler for controlled mode. */
  onChange?: (volume: number) => void;
  /** Badge image hung on the pill's left edge — the thing this slider controls. */
  icon?: string;
  /** Accessible name for the slider. */
  label?: string;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  value,
  onChange,
  icon,
  label = 'Volume',
}) => {
  const { volume: siteVolume, setVolume: setSiteVolume } = useVolume();
  const volume = value ?? siteVolume;
  const setVolume = onChange ?? setSiteVolume;

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(event.target.value));
  };

  return (
    <div className={icon ? `${styles.container} ${styles.withBadge}` : styles.container}>
      {icon && (
        <Image src={icon} alt="" className={styles.badge} width={28} height={28} />
      )}
      <div className={styles.controls}>
        <Image
          src="/assets/icons/volume.svg"
          alt="speaker_icon"
          className={styles.icon}
          width={24}
          height={24}
        />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className={styles.slider}
          aria-label={label}
          suppressHydrationWarning={true}
        />
      </div>
    </div>
  );
};

export default VolumeControl;
