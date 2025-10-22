'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ToastConfig } from './types';
import styles from './ToastNotification.module.css';

interface ToastNotificationProps extends ToastConfig {}

/**
 * Xbox 360-style toast notification component with badge crossfade animations
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
}: ToastNotificationProps) {
  const [isExiting, setIsExiting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const exitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Auto-dismiss after duration
    timeoutRef.current = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    };
  }, [duration]);

  /**
   * Triggers exit animation sequence:
   * 1. Ring expansion (300ms)
   * 2. Text fade staggered (200ms + 100ms delay)
   * 3. Pill collapse (350ms)
   * 4. Badge fade (included in wrapper fadeOut)
   */
  const handleDismiss = () => {
    if (isExiting) return; // Prevent multiple dismiss calls
    
    setIsExiting(true);

    // Wait for exit animations to complete before calling onDismiss
    exitTimeoutRef.current = setTimeout(() => {
      onDismiss?.();
    }, 500); // Total exit animation duration
  };

  const badgeSize = badge.size || 72;

  return (
    <output
      className={`${styles.toastWrapper} ${isExiting ? styles.exiting : styles.entering}`}
      aria-live="polite"
      aria-atomic="true"
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
            <Image
              src={badge.primaryIcon}
              alt=""
              width={48}
              height={48}
              className={`${styles.badgeIcon} ${
                type === 'achievement' && badge.secondaryIcon ? styles.primary : ''
              }`}
              priority
            />
            
            {/* Secondary icon for achievement crossfade */}
            {type === 'achievement' && badge.secondaryIcon && (
              <Image
                src={badge.secondaryIcon}
                alt=""
                width={48}
                height={48}
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
    </output>
  );
}
