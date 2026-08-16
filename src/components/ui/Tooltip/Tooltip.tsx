'use client';

import React, { useState, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Tooltip.module.css';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  disabled?: boolean;
  delay?: number;
}

/**
 * 
 * A reusable tooltip component that provides contextual information:
 * - Triggers on hover with configurable delay
 * - Configurable positioning (top, bottom, left, right)
 * - Can be disabled conditionally
 * 
 * @param children - The element that triggers the tooltip
 * @param content - The text content to display in the tooltip
 * @param position - Position relative to the trigger element
 * @param disabled - Whether the tooltip is disabled
 * @param delay - Delay before showing tooltip on hover (ms)
 */
export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  disabled = false,
  delay = 100
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTimeout, setShowTimeout] = useState<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (disabled) return;
    
    if (showTimeout) {
      clearTimeout(showTimeout);
    }
    
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setShowTimeout(timeout);
  };

  const hideTooltip = () => {
    if (showTimeout) {
      clearTimeout(showTimeout);
      setShowTimeout(null);
    }
    setIsVisible(false);
  };

  return (
    // A passive wrapper, not a control: it listens for events bubbling from the
    // interactive `children` it wraps, and must not become a tab stop itself —
    // that would put a second stop in front of every tooltipped button.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <span
      ref={containerRef}
      className={styles.tooltipContainer}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      // Focus/blur mirror the mouse handlers so the tooltip also appears for
      // keyboard and gamepad users, who never generate a mouseenter.
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && !disabled && (
          <motion.div
            className={`${styles.tooltip} ${styles[position]}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className={styles.tooltipContent}>
              {content}
            </div>
            <div className={styles.tooltipArrow} />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

export default Tooltip;