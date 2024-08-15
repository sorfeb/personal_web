'use client';

import React, { useState } from 'react';
import styles from './ScrollingMenu.module.css';

interface ScrollingMenuProps {
  items: string[];
}

const ScrollingMenu: React.FC<ScrollingMenuProps> = ({ items }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    const newIndex = Math.min(Math.max(selectedIndex + Math.sign(event.deltaY), 0), items.length - 1);
    setSelectedIndex(newIndex);
  };

  return (
    <div className={styles.container} onWheel={handleScroll}>
      <div className={styles.menu} style={{ transform: `translateY(-${selectedIndex * 100}px)` }}>
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