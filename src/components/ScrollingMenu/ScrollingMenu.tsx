'use client';

import React, { useState, useEffect } from 'react';
import styles from './ScrollingMenu.module.css';
import { useAudioManager } from '../../hooks/useAudioManager';

interface ScrollingMenuProps {
  items: string[];
  onSelectionChange: (index: number) => void;
  onItemClick?: (index: number) => void;
  disabled?: boolean;
}

const ScrollingMenu: React.FC<ScrollingMenuProps> = ({ items, onSelectionChange, onItemClick, disabled = false }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { playSound } = useAudioManager();

  useEffect(() => {
    // Don't add listeners if disabled (e.g., when modal is open)
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

    const handleKeyDown = (event: KeyboardEvent) => {
      let newIndex = selectedIndex;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        newIndex = Math.min(selectedIndex + 1, items.length - 1);
        if (newIndex !== selectedIndex) {
          playSound('channelDown');
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        newIndex = Math.max(selectedIndex - 1, 0);
        if (newIndex !== selectedIndex) {
          playSound('channelUp');
        }
      }

      if (newIndex !== selectedIndex) {
        setSelectedIndex(newIndex);
        onSelectionChange(newIndex);
      }
    };

    window.addEventListener('wheel', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
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