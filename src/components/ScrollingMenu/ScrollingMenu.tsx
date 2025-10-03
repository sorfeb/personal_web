'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './ScrollingMenu.module.css';
import { useAudioManager } from '../../hooks/useAudioManager';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';

interface ScrollingMenuProps {
  items: string[];
  onSelectionChange: (index: number) => void;
  onItemClick?: (index: number) => void;
  disabled?: boolean;
}

const ScrollingMenu: React.FC<ScrollingMenuProps> = ({ items, onSelectionChange, onItemClick, disabled = false }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { playSound } = useAudioManager();

  const handleNavigateUp = useCallback(() => {
    const newIndex = Math.max(selectedIndex - 1, 0);
    if (newIndex !== selectedIndex) {
      setSelectedIndex(newIndex);
      onSelectionChange(newIndex);
      playSound('channelUp');
    }
  }, [selectedIndex, onSelectionChange, playSound]);

  const handleNavigateDown = useCallback(() => {
    const newIndex = Math.min(selectedIndex + 1, items.length - 1);
    if (newIndex !== selectedIndex) {
      setSelectedIndex(newIndex);
      onSelectionChange(newIndex);
      playSound('channelDown');
    }
  }, [selectedIndex, items.length, onSelectionChange, playSound]);

  // Keyboard navigation (ArrowUp/ArrowDown)
  useKeyboardNavigation({
    onUp: handleNavigateUp,
    onDown: handleNavigateDown,
    canGoUp: selectedIndex > 0,
    canGoDown: selectedIndex < items.length - 1,
    enabled: !disabled,
  });

  // Scroll wheel navigation
  useEffect(() => {
    if (disabled) return;
    
    const handleScroll = (event: WheelEvent) => {
      const direction = Math.sign(event.deltaY);
      const newIndex = Math.min(Math.max(selectedIndex + direction, 0), items.length - 1);

      if (newIndex !== selectedIndex) {
        setSelectedIndex(newIndex);
        onSelectionChange(newIndex);
        playSound(direction > 0 ? 'channelDown' : 'channelUp');
      }
    };

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
    <nav 
      className={styles.container}
      aria-label="Section navigation menu"
    >
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
    </nav>
  );
};

export default ScrollingMenu;