'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { usePageLayout } from './PageLayout.context';
import { WindowContainer } from './WindowContainer';
import { LayoutSize, LayoutDimensions } from './types';
import styles from './PageLayout.module.css';

/**
 * PageLayout.Header - Title section compound component
 * 
 * @description
 * Renders the page title section. Can accept custom children to override
 * the default title rendering, or will render the title from context.
 * 
 * @example
 * ```tsx
 * // Default usage - renders title from context
 * <PageLayout.Header />
 * 
 * // Custom content
 * <PageLayout.Header>
 *   <h1>🎮 Custom Title</h1>
 *   <span>Subtitle here</span>
 * </PageLayout.Header>
 * ```
 * 
 * @since 2.0.0
 */
interface PageLayoutHeaderProps {
  /** Optional custom content to render instead of default title */
  children?: ReactNode;
  /** Additional CSS class names */
  className?: string;
}

export function PageLayoutHeader({ children, className = '' }: Readonly<PageLayoutHeaderProps>) {
  const { title, titleId } = usePageLayout();

  return (
    <div className={`${styles.titleContainer} ${className}`}>
      {children ?? <h1 id={titleId} className={styles.title}>{title}</h1>}
    </div>
  );
}
PageLayoutHeader.displayName = 'PageLayout.Header';


/**
 * PageLayout.CloseButton - Close button compound component
 * 
 * @description
 * Renders the close button that triggers navigation back or custom onClose.
 * Includes proper accessibility attributes (aria-label).
 * 
 * @example
 * ```tsx
 * // Default usage
 * <PageLayout.CloseButton />
 * 
 * // Custom icon
 * <PageLayout.CloseButton>
 *   <CustomCloseIcon />
 * </PageLayout.CloseButton>
 * ```
 * 
 * @since 2.0.0
 */
interface PageLayoutCloseButtonProps {
  /** Optional custom content (icon) to render */
  children?: ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Accessible label for screen readers */
  'aria-label'?: string;
}

export function PageLayoutCloseButton({ 
  children, 
  className = '',
  'aria-label': ariaLabel = 'Close page'
}: Readonly<PageLayoutCloseButtonProps>) {
  const { handleClose } = usePageLayout();

  return (
    <div className={`${styles.closeButtonWrapper} ${className}`}>
      <button 
        className={styles.closeButton} 
        onClick={handleClose}
        aria-label={ariaLabel}
        type="button"
      >
        {children ?? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="30"
            height="30"
            className={styles.closeIcon}
            aria-hidden="true"
          >
            <path
              d="M6 6L18 18M6 18L18 6"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
PageLayoutCloseButton.displayName = 'PageLayout.CloseButton';


/**
 * PageLayout.Body - Main content area compound component
 * 
 * @description
 * Renders the main content area with appropriate variant-specific styling.
 * Wraps content in WindowContainer for windowed variant, or motion.div for others.
 * 
 * @example
 * ```tsx
 * <PageLayout.Body>
 *   <YourContent />
 * </PageLayout.Body>
 * 
 * // With custom size override
 * <PageLayout.Body size="wide">
 *   <Gallery />
 * </PageLayout.Body>
 * ```
 * 
 * @since 2.0.0
 */
interface PageLayoutBodyProps {
  /** Content to render in the body */
  children: ReactNode;
  /** Override size from context */
  size?: LayoutSize;
  /** Override custom dimensions from context */
  customDimensions?: LayoutDimensions;
  /** Additional CSS class names */
  className?: string;
}

export function PageLayoutBody({ 
  children, 
  size: sizeProp,
  customDimensions: customDimensionsProp,
  className = ''
}: Readonly<PageLayoutBodyProps>) {
  const { size: contextSize, variant, customDimensions: contextDimensions } = usePageLayout();
  
  const size = sizeProp ?? contextSize;
  const customDimensions = customDimensionsProp ?? contextDimensions;

  switch (variant) {
    case 'windowed':
      return (
        <WindowContainer
          size={size}
          customDimensions={customDimensions}
          className={`${styles.windowReflection} ${className}`}
        >
          {children}
        </WindowContainer>
      );

    case 'fullscreen':
      return (
        <motion.div
          className={`${styles.fullscreenContent} ${className}`}
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
          className={`${styles.minimalContent} ${className}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      );

    default:
      return <div className={className}>{children}</div>;
  }
}
PageLayoutBody.displayName = 'PageLayout.Body';


/**
 * PageLayout.Footer - Footer section compound component
 * 
 * @description
 * Optional footer section for action buttons, links, or additional content.
 * 
 * @example
 * ```tsx
 * <PageLayout.Footer>
 *   <button>Save</button>
 *   <button>Cancel</button>
 * </PageLayout.Footer>
 * ```
 * 
 * @since 2.0.0
 */
interface PageLayoutFooterProps {
  /** Footer content */
  children: ReactNode;
  /** Additional CSS class names */
  className?: string;
}

export function PageLayoutFooter({ children, className = '' }: Readonly<PageLayoutFooterProps>) {
  return (
    <div className={`${styles.footer} ${className}`}>
      {children}
    </div>
  );
}
PageLayoutFooter.displayName = 'PageLayout.Footer';
