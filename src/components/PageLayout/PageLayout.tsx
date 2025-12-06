'use client';

import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigationSound } from '../../hooks/useNavigationSound';
import { PageLayoutProps } from './types';
import { PageLayoutProvider } from './PageLayoutContext';
import { 
  PageLayoutHeader, 
  PageLayoutCloseButton, 
  PageLayoutBody, 
  PageLayoutFooter 
} from './PageLayoutParts';
import styles from './PageLayout.module.css';

/**
 * PageLayout component - Modular layout system using Composition pattern
 * 
 * @description
 * A sophisticated layout component that provides consistent page structure across
 * the application. Implements multiple design patterns for flexibility and maintainability:
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
 * @since 2.0.0 - Refactored to compound component pattern
 * @author Soros Febriano
 * 
 * @see {@link PageLayoutHeader} - Title section compound component
 * @see {@link PageLayoutBody} - Content area compound component
 * @see {@link PageLayoutCloseButton} - Close button compound component
 * @see {@link PageLayoutFooter} - Footer section compound component
 * @see {@link PageLayoutProps} - Type definitions for props
 */

/**
 * Check if children contain compound component parts
 * 
 * @description
 * Detects whether the children are using the compound component API
 * (PageLayout.Header, PageLayout.Body, etc.) or the legacy simple API.
 * This enables backwards compatibility with existing usages.
 */
function hasCompoundChildren(children: React.ReactNode): boolean {
  const childArray = React.Children.toArray(children);
  return childArray.some((child) => {
    if (!React.isValidElement(child)) return false;
    const displayName = (child.type as React.ComponentType)?.displayName;
    return displayName?.startsWith('PageLayout.');
  });
}

/**
 * PageLayout Root Component
 * 
 * @description
 * The root component of the PageLayout compound component system.
 * Provides context to all sub-components and handles backwards compatibility.
 * 
 * Supports two usage modes:
 * 1. **Legacy mode** (backwards compatible): Simple children are auto-wrapped
 * 2. **Compound mode**: Full control with PageLayout.Header, PageLayout.Body, etc.
 */
const PageLayoutRoot: React.FC<PageLayoutProps> = ({
  title,
  children,
  size = 'default',
  variant = 'windowed',
  customDimensions,
  showCloseButton = true,
  onClose,
}) => {
  const { navigateWithSound } = useNavigationSound();
  const [isExiting, setIsExiting] = useState(false);
  const titleId = useId();

  /**
   * Handles page close interaction
   */
  const handleClose = () => {
    setIsExiting(true);

    if (onClose) {
      onClose();
    } else {
      setTimeout(() => {
        navigateWithSound('/', 'back');
      }, 500);
    }
  };

  const contextValue = {
    title,
    titleId,
    isExiting,
    handleClose,
    size,
    variant,
    customDimensions,
  };

  // Determine if using compound pattern or legacy pattern
  const isCompoundMode = hasCompoundChildren(children);

  return (
    <PageLayoutProvider value={contextValue}>
      <AnimatePresence>
        {!isExiting && (
          <motion.div
            key={title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`${styles.pageContainer} ${styles[`pageContainer--${variant}`]}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            {isCompoundMode ? (
              children
            ) : (
              <>
                <PageLayoutHeader />
                {showCloseButton && <PageLayoutCloseButton />}
                <PageLayoutBody>{children}</PageLayoutBody>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayoutProvider>
  );
};

/**
 * PageLayout Compound Component
 * 
 * @description
 * Main export with attached sub-components for compound component pattern.
 * 
 * @example
 * ```tsx
 * // Legacy usage (backwards compatible)
 * <PageLayout title="About">{content}</PageLayout>
 * 
 * // Compound usage (full control)
 * <PageLayout title="About">
 *   <PageLayout.Header />
 *   <PageLayout.CloseButton />
 *   <PageLayout.Body>{content}</PageLayout.Body>
 *   <PageLayout.Footer><Actions /></PageLayout.Footer>
 * </PageLayout>
 * ```
 */
const PageLayout = Object.assign(PageLayoutRoot, {
  Header: PageLayoutHeader,
  CloseButton: PageLayoutCloseButton,
  Body: PageLayoutBody,
  Footer: PageLayoutFooter,
});

export default PageLayout;