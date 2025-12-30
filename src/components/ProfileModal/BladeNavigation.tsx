'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioManager } from '../../hooks/useAudioManager';
import styles from './BladeNavigation.module.css';
import modalStyles from './ProfileModal.module.css';

// ============================================
// TYPES
// ============================================

export interface BladePage {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface BladeNavigationProps {
  pages: BladePage[];
  initialPageId?: string;
  onPageChange?: (pageId: string) => void;
}

interface BladeTabProps {
  page: BladePage;
  side: 'left' | 'right';
  stackIndex: number;
  totalInStack: number;
  onClick: () => void;
}

// ============================================
// BLADE TAB COMPONENT
// ============================================

const BladeTab: React.FC<BladeTabProps> = ({
  page,
  side,
  stackIndex,
  totalInStack,
  onClick,
}) => {
  const { playSound } = useAudioManager();

  // Calculate offset for stacking effect - tabs further from center are more offset
  const stackOffset = stackIndex * 38;
  const zIndex = totalInStack - stackIndex;

  const handleClick = () => {
    playSound('click');
    onClick();
  };

  const handleHover = () => {
    playSound('owawa');
  };

  return (
    <motion.div
      className={`${styles.bladeTab} ${styles[side]}`}
      style={{
        [side]: stackOffset,
        zIndex,
      }}
      onClick={handleClick}
      onMouseEnter={handleHover}
      initial={{
        x: side === 'left' ? -80 : 80,
        opacity: 0,
      }}
      animate={{
        x: 0,
        opacity: 1,
      }}
      exit={{
        x: side === 'left' ? -80 : 80,
        opacity: 0,
      }}
      transition={{
        duration: 0.3,
        delay: stackIndex * 0.05,
        ease: [0.25, 0.8, 0.25, 1],
      }}
      whileHover={{
        x: side === 'left' ? -4 : 4,
        scale: 1.02,
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
};

// ============================================
// MAIN BLADE NAVIGATION COMPONENT
// ============================================

export const BladeNavigation: React.FC<BladeNavigationProps> = ({
  pages,
  initialPageId,
  onPageChange,
}) => {
  const { playSound } = useAudioManager();

  // Find initial page index
  const initialIndex = useMemo(() => {
    if (!initialPageId) return Math.floor(pages.length / 2);
    const idx = pages.findIndex(p => p.id === initialPageId);
    return idx >= 0 ? idx : Math.floor(pages.length / 2);
  }, [pages, initialPageId]);

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  // Split pages into left tabs, active content, right tabs
  const leftPages = useMemo(() => pages.slice(0, activeIndex), [pages, activeIndex]);
  const activePage = pages[activeIndex];
  const rightPages = useMemo(() => pages.slice(activeIndex + 1), [pages, activeIndex]);

  // Navigate to a specific page
  const navigateToPage = useCallback((pageId: string) => {
    const newIndex = pages.findIndex(p => p.id === pageId);
    if (newIndex >= 0 && newIndex !== activeIndex) {
      setDirection(newIndex < activeIndex ? 'left' : 'right');
      playSound('navigation');
      setActiveIndex(newIndex);
      onPageChange?.(pageId);
    }
  }, [pages, activeIndex, playSound, onPageChange]);

  // Content animation variants
  const contentVariants = {
    enter: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? -100 : 100,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <div className={styles.bladeContainer}>
      {/* Left side tabs - pages before active */}
      <div className={styles.bladeSide} data-side="left">
        <AnimatePresence mode="popLayout">
          {leftPages.map((page, index) => (
            <BladeTab
              key={page.id}
              page={page}
              side="left"
              stackIndex={leftPages.length - 1 - index}
              totalInStack={leftPages.length}
              onClick={() => navigateToPage(page.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Center content - active page wrapped in modal styling */}
      <div className={styles.contentContainer}>
        <div
          className={modalStyles.modal}
          onClick={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activePage.id}
              className={styles.contentWrapper}
              custom={direction}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.35,
                ease: [0.25, 0.8, 0.25, 1],
              }}
            >
              {activePage.content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Right side tabs - pages after active */}
      <div className={styles.bladeSide} data-side="right">
        <AnimatePresence mode="popLayout">
          {rightPages.map((page, index) => (
            <BladeTab
              key={page.id}
              page={page}
              side="right"
              stackIndex={index}
              totalInStack={rightPages.length}
              onClick={() => navigateToPage(page.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BladeNavigation;
