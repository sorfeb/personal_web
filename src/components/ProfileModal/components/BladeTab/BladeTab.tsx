'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useAudioManager } from '../../../../hooks/useAudioManager';
import type { BladeTabProps } from '../../types';
import styles from './BladeTab.module.css';

const PEEK_AMOUNT = 12; // How much each tab peeks out from behind the next

const BladeTab = memo<BladeTabProps>(({
  page,
  side,
  stackIndex,
  totalInStack,
  onClick,
}) => {
  const { playSound } = useAudioManager();

  // Calculate horizontal offset for x-axis stacking
  const horizontalOffset = stackIndex * PEEK_AMOUNT;

  // Z-index: tabs closer to center (lower stackIndex) are on top
  const zIndex = totalInStack - stackIndex;

  const handleClick = () => {
    playSound('click');
    onClick();
  };

  const handleHover = () => {
    playSound('owawa');
  };

  // Position style based on side
  const positionStyle = side === 'left'
    ? { right: horizontalOffset }
    : { left: horizontalOffset };

  return (
    <motion.div
      className={`${styles.bladeTab} ${styles[side]}`}
      style={{ ...positionStyle, zIndex }}
      onClick={handleClick}
      onMouseEnter={handleHover}
      initial={{
        x: side === 'left' ? -60 : 60,
        opacity: 0,
      }}
      animate={{
        x: 0,
        opacity: 1,
      }}
      exit={{
        x: side === 'left' ? -60 : 60,
        opacity: 0,
      }}
      transition={{
        duration: 0.3,
        delay: stackIndex * 0.04,
        ease: [0.25, 0.8, 0.25, 1],
      }}
      whileHover={{
        x: side === 'left' ? -6 : 6,
      }}
      whileTap={{
        scale: 0.98,
      }}
      layout
    >
      <div className={styles.tabEdge} />
      <div className={styles.tabContent}>
        <span className={styles.tabLabel}>{page.label}</span>
      </div>
      <div className={styles.tabHighlight} />
    </motion.div>
  );
});

BladeTab.displayName = 'BladeTab';

export default BladeTab;
