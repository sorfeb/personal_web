'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useVolume } from '../../context/VolumeContext';
import { PageLayoutProps } from './types';
import { WindowContainer } from './WindowContainer';
import styles from './PageLayout.module.css';

/**
 * PageLayout component - Modular layout system using Composition pattern
 *
 * Principles applied:
 * 1. Composition over Inheritance - Uses WindowContainer for flexible layouts
 * 2. Inversion of Control - Consumers control layout through props
 * 3. Single Responsibility - Each component has one clear purpose
 * 4. Open/Closed - Open for extension through size variants
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
  const { volume } = useVolume();
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  const playSound = () => {
    const audio = new Audio('/assets/audio/snd_buttonback.wav');
    audio.volume = volume;
    audio.play();
  };

  const handleClose = () => {
    playSound();
    setIsExiting(true);

    if (onClose) {
      onClose();
    } else {
      setTimeout(() => {
        router.push('/');
      }, 500);
    }
  };

  // Render content based on variant (Strategy pattern)
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
