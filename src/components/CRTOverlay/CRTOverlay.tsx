'use client';

import React from 'react';
import { useCRTFilter } from '../../context/CRTFilterContext';
import { useIsMounted } from '@/hooks';
import styles from './CRTOverlay.module.css';

/**
 * CRTOverlay Component
 * 
 * Renders the retro CRT (Cathode Ray Tube) screen effects on top of all content.
 * This includes:
 * - Scanline effect (horizontal lines)
 * - RGB chromatic aberration
 * - Flicker animation
 * - Text shadow glitch effect
 * 
 * The overlay sits above all content with pointer-events disabled,
 * ensuring it doesn't interfere with user interactions.
 * 
 * Can be toggled on/off via CRTFilterContext.
 */

/**
 * Internal component that safely uses the context
 */
const CRTOverlayContent: React.FC = () => {
  const { isEnabled } = useCRTFilter();

  if (!isEnabled) {
    return null;
  }

  return (
    <>
      {/* Flicker overlay */}
      <div className={styles.flickerOverlay} aria-hidden="true" />
      
      {/* Scanlines and RGB overlay */}
      <div className={styles.scanlinesOverlay} aria-hidden="true" />
      
      {/* Text shadow effect container - wraps all content */}
      <div className={styles.textShadowEffect} />
    </>
  );
};

const CRTOverlay: React.FC = () => {
  const mounted = useIsMounted();

  if (!mounted) {
    return null;
  }

  return <CRTOverlayContent />;
};

export default CRTOverlay;
