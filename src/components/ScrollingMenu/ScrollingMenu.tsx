'use client';

import React, { useState, useEffect } from 'react';
import styles from './ScrollingMenu.module.css';
import { useAudioManager } from '../../hooks/useAudioManager';

interface ScrollingMenuProps {
  items: string[];
  onSelectionChange: (index: number) => void;
  onItemClick?: (index: number) => void;
  disabled?: boolean; // Add disabled prop for when modal is open
}

const ScrollingMenu: React.FC<ScrollingMenuProps> = ({ items, onSelectionChange, onItemClick, disabled = false }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { playSound } = useAudioManager();

  useEffect(() => {
    // Don't add scroll listener if disabled (e.g., when modal is open)
    if (disabled) return;
    
    const handleScroll = (event: WheelEvent) => {
      const direction = Math.sign(event.deltaY); // 1 for down, -1 for up
      const newIndex = Math.min(Math.max(selectedIndex + direction, 0), items.length - 1);

      if (newIndex !== selectedIndex) {
        setSelectedIndex(newIndex);
        onSelectionChange(newIndex);

        playSound(direction > 0 ? 'channelDown' : 'channelUp');
      }
    };

    // Attach to window instead of container
    window.addEventListener('wheel', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [selectedIndex, items.length, onSelectionChange, playSound, disabled]);

  const playHoverSound = () => playSound('ting');
  const playClickSound = () => playSound('navigation');

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