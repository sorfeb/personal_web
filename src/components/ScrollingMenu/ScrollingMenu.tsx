'use client';

import React, { useState, useEffect } from 'react';
import styles from './ScrollingMenu.module.css';
import { useVolume } from '../../context/VolumeContext';
import { useAudioManager } from '@/hooks/useAudioManager';

interface ScrollingMenuProps {
  items: string[];
  onSelectionChange: (index: number) => void;
  onItemClick?: (index: number) => void;
}

const ScrollingMenu: React.FC<ScrollingMenuProps> = ({ items, onSelectionChange, onItemClick }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { volume } = useVolume();

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      const direction = Math.sign(event.deltaY); // 1 for down, -1 for up
      const newIndex = Math.min(Math.max(selectedIndex + direction, 0), items.length - 1);

      if (newIndex !== selectedIndex) {
        setSelectedIndex(newIndex);
        onSelectionChange(newIndex);

        playSound(direction > 0 ? 'down' : 'up');
      }
    };

    // Attach to window instead of container
    window.addEventListener('wheel', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [selectedIndex, items.length, onSelectionChange, volume]);

  const playSound = (direction: 'up' | 'down') => {
    const soundPath =
      direction === 'down'
        ? '/assets/audio/snd_channeldown.wav'
        : '/assets/audio/snd_channelup.wav';
    const audio = new Audio(soundPath);
    audio.volume = volume;
    audio.play();
  };

  const playHoverSound = () => {
    const audio = new Audio('/assets/audio/ps2_ting.wav');
    audio.volume = volume;
    audio.play();
  };

  const playClickSound = () => {
    const audio = new Audio('/assets/audio/snd_buttonselect.wav');
    audio.volume = volume;
    audio.play();
  };

  const handleItemClick = (index: number) => {
    playClickSound();
    setSelectedIndex(index);
    onSelectionChange(index);
    onItemClick?.(index);
  };

  return (
    <div className={styles.container}>
      <div 
        className={styles.menu} 
        style={{ transform: `translateY(-${selectedIndex * 5}px)` }}
        >
        {items.map((item, index) => (
          <div
            key={index}
            className={`${styles.menuItem} ${index === selectedIndex ? styles.selected : ''}`}
            onClick={() => handleItemClick(index)}
            onMouseEnter={playHoverSound}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollingMenu;