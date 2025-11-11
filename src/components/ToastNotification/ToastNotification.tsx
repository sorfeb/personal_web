'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ToastConfig, TOAST_COLORS } from './types';
import { useAudioManager } from '@/hooks/useAudioManager';
import styles from './ToastNotification.module.css';

interface ToastNotificationProps extends ToastConfig {}

/**
 * Toast notification component with badge crossfade animations
 * Displays in lower third of screen with immersive entrance/exit sequences
 */
export default function ToastNotification({
  type,
  badge,
  title,
  subtitle,
  duration = 4000,
  showProgressBar = false,
  onDismiss,
  imageComponent,
  playSound: customPlaySound,
}: ToastNotificationProps) {
  const [isExiting, setIsExiting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const exitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const audioManager = useAudioManager?.();
  const soundPlayer = customPlaySound || audioManager?.playSound;
  
  const ringColor = TOAST_COLORS[badge.ringColor];
  
  // Use custom image component or default to Next.js Image
  const ImageComponent = imageComponent || Image;

  useEffect(() => {
    soundPlayer?.('achievement');

    timeoutRef.current = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    };
  }, [duration, soundPlayer]);

  /**
   * Triggers exit animation sequence:
   * 1. Ring expansion
   * 2. Text fade staggered
   * 3. Pill collapse
   * 4. Badge fade
   */
  const handleDismiss = () => {
    if (isExiting) return;
    
    setIsExiting(true);

    exitTimeoutRef.current = setTimeout(() => {
      onDismiss?.();
    }, 500);
  };

  const badgeSize = badge.size || 72;
  const iconSize = badge.iconSize || 40;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`${styles.toastWrapper} ${isExiting ? styles.exiting : styles.entering}`}
      // eslint-disable-next-line react/forbid-dom-props
      style={{
        // @ts-ignore - CSS custom properties
        '--toast-ring-color': ringColor,
        '--icon-size': `${iconSize}px`,
      }}
    >
      {/* Left: Badge Area */}
      <div className={styles.badgeContainer}>
        <div
          className={`${styles.badge} ${isExiting ? styles.exiting : ''}`}
          data-ring={badge.ringColor}
          data-size={badgeSize}
        >
          <div className={styles.badgeIconWrapper}>
            {/* Primary icon (always visible) */}
            <ImageComponent
              src={badge.primaryIcon}
              alt=""
              width={iconSize}
              height={iconSize}
              className={`${styles.badgeIcon} ${
                type === 'achievement' && badge.secondaryIcon ? styles.primary : ''
              }`}
              priority
            />
            
            {/* Secondary icon for achievement crossfade */}
            {type === 'achievement' && badge.secondaryIcon && (
              <ImageComponent
                src={badge.secondaryIcon}
                alt=""
                width={iconSize}
                height={iconSize}
                className={`${styles.badgeIcon} ${styles.secondary}`}
                priority
              />
            )}
          </div>
        </div>
      </div>

      {/* Right: Content Pill */}
      <div className={`${styles.contentPill} ${isExiting ? styles.exiting : ''}`}>
        <h3 className={`${styles.title} ${isExiting ? styles.exiting : ''}`}>
          {title}
        </h3>
        
        {subtitle && (
          <p className={`${styles.subtitle} ${isExiting ? styles.exiting : ''}`}>
            {subtitle}
          </p>
        )}

        {/* Optional progress bar */}
        {showProgressBar && !isExiting && (
          <div
            className={styles.progressBar}
            data-ring={badge.ringColor}
            data-duration={duration}
          />
        )}
      </div>
    </div>
  );
}
