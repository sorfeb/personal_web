'use client';

import React, { useState } from 'react';
import styles from './ScrollingMenu.module.css';
import { useVolume } from '../../context/VolumeContext';

interface ScrollingMenuProps {
  items: string[];
  onSelectionChange: (index: number) => void;
}

const ScrollingMenu: React.FC<ScrollingMenuProps> = ({ items, onSelectionChange }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { volume } = useVolume();
  const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    const direction = Math.sign(event.deltaY); // 1 for down, -1 for up
    const newIndex = Math.min(Math.max(selectedIndex + Math.sign(event.deltaY), 0), items.length - 1);

    if (newIndex !== selectedIndex) {
      setSelectedIndex(newIndex);
      onSelectionChange(newIndex);

      playSound(direction > 0 ? 'down' : 'up');
    }
  };

  const playSound = (direction: 'up' | 'down') => {
    const soundPath =
      direction === 'down'
        ? '/assets/audio/snd_channeldown.wav'
        : '/assets/audio/snd_channelup.wav';
    const audio = new Audio(soundPath);
    audio.volume = volume;
    audio.play();
  };

  return (
    <div className={styles.container} onWheel={handleScroll}>
      <div className={styles.menu} style={{ transform: `translateY(-${selectedIndex * 5}px)` }}>
        {items.map((item, index) => (
          <div
            key={index}
            className={`${styles.menuItem} ${index === selectedIndex ? styles.selected : ''}`}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollingMenu;