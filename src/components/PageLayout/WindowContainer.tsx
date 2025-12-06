import React from 'react';
import { motion } from 'framer-motion';
import { WindowContainerProps } from './PageLayout.types';
import { getLayoutDimensions } from './PageLayout.config';
import styles from './PageLayout.module.css';

/**
 * @description
 * The component uses CSS custom properties to dynamically set layout dimensions,
 * allowing for better performance compared to inline styles while maintaining
 * the flexibility of runtime customization.
 * 
 * @example
 * ```tsx
 * // Standard window with default size
 * <WindowContainer size="default">
 *   <ContentComponent />
 * </WindowContainer>
 * 
 * // Wide window for content-heavy layouts
 * <WindowContainer size="wide" className="special-styling">
 *   <Gallery />
 * </WindowContainer>
 * 
 * // Custom dimensions
 * <WindowContainer 
 *   size="custom" 
 *   customDimensions={{ width: '80%', maxWidth: '1200px' }}
 * >
 *   <Dashboard />
 * </WindowContainer>
 * ```
 * 
 * @param props - The component props
 * @returns JSX element representing the window container with applied styling
 * 
 * @since 1.0.0
 * @author Soros Febriano
 * 
 * @see {@link PageLayout} - Parent component that uses this container
 * @see {@link getLayoutDimensions} - Configuration function for layout dimensions
 * @see {@link WindowContainerProps} - Type definitions for props
 */
export const WindowContainer: React.FC<WindowContainerProps> = ({
  children,
  size,
  customDimensions,
  className = '',
}) => {
  /**
   * Get computed layout dimensions based on size and custom overrides
   * 
   * @description
   * Retrieves the appropriate layout configuration for the given size,
   * with optional custom dimension overrides. This follows the Strategy
   * pattern by selecting configuration based on the size parameter.
   */
  const dimensions = getLayoutDimensions(size, customDimensions);
  
  /**
   * CSS custom properties for dynamic styling
   * 
   * @description
   * Uses CSS custom properties as an alternative to CSS-in-JS for better
   * performance. Properties are applied to the element and referenced
   * in the CSS file, allowing for responsive behavior and easy customization.
   * 
   * @since 1.0.0
   */
  const customStyle = {
    '--layout-width': dimensions.width,
    '--layout-max-width': dimensions.maxWidth,
    '--layout-height': dimensions.height,
    '--layout-padding': dimensions.padding,
  } as React.CSSProperties;

  return (
    <motion.div
      className={`${styles.window} ${styles[`window--${size}`]} custom-scrollbar ${className}`}
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
