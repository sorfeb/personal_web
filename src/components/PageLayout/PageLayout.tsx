'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigationSound } from '../../hooks/useNavigationSound';
import { PageLayoutProps } from './types';
import { WindowContainer } from './WindowContainer';
import styles from './PageLayout.module.css';

/**
 * PageLayout component - Modular layout system using Composition pattern
 * 
 * @description
 * A sophisticated layout component that provides consistent page structure across
 * the application. Implements multiple design patterns for flexibility and maintainability:
 * 
 * **Design Patterns Applied:**
 * - **Composition over Inheritance**: Uses WindowContainer for flexible layouts
 * - **Inversion of Control**: Consumers control layout through props
 * - **Single Responsibility**: Each component has one clear purpose
 * - **Strategy Pattern**: Different rendering strategies based on variant
 * - **Open/Closed Principle**: Open for extension through size variants
 * 
 * **Key Features:**
 * - Multiple layout variants (windowed, fullscreen, minimal)
 * - Responsive sizing with predefined breakpoints
 * - Smooth animations with Framer Motion
 * - Audio feedback integration
 * - Customizable dimensions and behavior
 * - Accessibility support with proper focus management
 * 
 * **Layout Variants:**
 * - `windowed`: Standard windowed layout with container styling
 * - `fullscreen`: Full viewport coverage for immersive content
 * - `minimal`: Lightweight layout with minimal styling
 * 
 * **Size Options:**
 * - `compact`: Small forms and dialogs (50% width, 600px max)
 * - `default`: Standard content pages (70% width, 900px max)
 * - `wide`: Content-heavy pages (90% width, 1400px max)
 * - `full`: Dashboards and data displays (98% width, no max)
 * - `custom`: Custom dimensions via customDimensions prop
 * 
 * @example
 * ```tsx
 * // Standard windowed layout
 * <PageLayout title="About" size="default" variant="windowed">
 *   <p>Page content here</p>
 * </PageLayout>
 * 
 * // Wide layout for content-heavy pages
 * <PageLayout title="Gallery" size="wide" variant="windowed">
 *   <ImageGallery />
 * </PageLayout>
 * 
 * // Fullscreen layout
 * <PageLayout title="Game" variant="fullscreen" showCloseButton={false}>
 *   <GameComponent />
 * </PageLayout>
 * 
 * // Custom dimensions
 * <PageLayout 
 *   title="Dashboard"
 *   size="custom"
 *   customDimensions={{ width: '95%', maxWidth: '1600px' }}
 * >
 *   <Dashboard />
 * </PageLayout>
 * ```
 * 
 * @param props - The component props
 * @returns JSX element representing the page layout
 * 
 * @since 1.0.0
 * @author Soros Febriano
 * 
 * @see {@link WindowContainer} - Handles window styling and behavior
 * @see {@link PageLayoutProps} - Type definitions for props
 * @see {@link useVolume} - Audio volume context hook
 */
const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  children,
  size = 'default',
  variant = 'windowed',
  customDimensions,
  showCloseButton = true,
  onClose,
}) => {
  const { playBackSound } = useNavigationSound();
  const [isExiting, setIsExiting] = useState(false);

  /**
   * Handles page close interaction
   * 
   * @description
   * Plays sound feedback, sets exit animation state, and either calls the
   * custom onClose handler or navigates back to home after a delay.
   * The delay allows the exit animation to complete before navigation.
   * 
   * @since 1.0.0
   */
  const handleClose = () => {
    playBackSound();
    setIsExiting(true);

    if (onClose) {
      onClose();
    } else {
      setTimeout(() => {
        // Navigation handled by useNavigationSound hook
        window.location.href = '/';
      }, 500);
    }
  };

  /**
   * Renders content based on layout variant using Strategy pattern
   * 
   * @description
   * Selects the appropriate rendering strategy based on the variant prop.
   * Each variant has its own animation and styling approach:
   * 
   * - windowed: Uses WindowContainer with customizable sizing
   * - fullscreen: Direct fullscreen overlay with scale animation
   * - minimal: Lightweight container with slide animation
   * 
   * @returns JSX element with variant-specific rendering
   * 
   * @since 1.0.0
   */
  const renderContent = () => {
    switch (variant) {
      case 'windowed':
        return (
          <WindowContainer
            size={size}
            customDimensions={customDimensions}
            className={styles.windowReflection}
          >
            {children}
          </WindowContainer>
        );

      case 'fullscreen':
        return (
          <motion.div
            className={styles.fullscreenContent}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        );

      case 'minimal':
        return (
          <motion.div
            className={styles.minimalContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        );

      default:
        return children;
    }
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key={title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`${styles.pageContainer} ${styles[`pageContainer--${variant}`]}`}
        >
          {/* Title Section */}
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>{title}</h1>
          </div>

          {/* Close Button - Conditional Rendering */}
          {showCloseButton && (
            <div className={styles.closeButtonWrapper}>
              <button className={styles.closeButton} onClick={handleClose}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="30"
                  height="30"
                  className={styles.closeIcon}
                >
                  <path
                    d="M6 6L18 18M6 18L18 6"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Dynamic Content Rendering */}
          {renderContent()}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLayout;