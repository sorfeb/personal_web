import React from 'react';
import { motion } from 'framer-motion';
import { WindowContainerProps } from './types';
import { getLayoutDimensions } from './layoutConfig';
import styles from './PageLayout.module.css';

/**
 * WindowContainer component - Handles window styling and responsive behavior
 * Follows Single Responsibility Principle by focusing only on container logic
 */
export const WindowContainer: React.FC<WindowContainerProps> = ({
  children,
  size,
  customDimensions,
  className = '',
}) => {
  const dimensions = getLayoutDimensions(size, customDimensions);
  
  // CSS custom properties for dynamic styling (CSS-in-JS alternative)
  const customStyle = {
    '--layout-width': dimensions.width,
    '--layout-max-width': dimensions.maxWidth,
    '--layout-height': dimensions.height,
    '--layout-padding': dimensions.padding,
  } as React.CSSProperties;

  return (
    <motion.div
      className={`${styles.window} ${styles[`window--${size}`]} ${className}`}
      style={customStyle}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};
