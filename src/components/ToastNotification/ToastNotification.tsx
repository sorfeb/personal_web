'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { ToastConfig } from './types';
import { TOAST_COLORS } from '@/constants/toastConfig';
import { useAudioManager } from '@/hooks/useAudioManager';
import { useMountEffect, useTimeout } from '@/hooks';
import styles from './ToastNotification.module.css';

type ToastNotificationProps = ToastConfig;

/** Covers the longest exit animation (300ms pill collapse and wrapper fade) plus buffer */
const EXIT_ANIMATION_MS = 400;

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
  const exitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { playSound } = useAudioManager();
  const soundPlayer = customPlaySound || playSound;

  const ringColor = TOAST_COLORS[badge.ringColor];

  // Use custom image component or default to Next.js Image
  const ImageComponent = imageComponent || Image;

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
    }, EXIT_ANIMATION_MS);
  };

  // Play achievement sound on mount; clear the imperative exit timer on unmount.
  useMountEffect(() => {
    soundPlayer?.('achievement');
    return () => {
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    };
  });

  // Auto-dismiss after `duration`, pause once the exit animation is running.
  useTimeout(handleDismiss, isExiting ? null : duration);

  const badgeSize = badge.size || 72;
  const iconSize = badge.iconSize || 40;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`${styles.toastWrapper} ${isExiting ? styles.exiting : styles.entering}`}
      // eslint-disable-next-line react/forbid-dom-props
      style={
        {
          '--toast-ring-color': ringColor,
          '--icon-size': `${iconSize}px`,
          '--badge-size': `${badgeSize}px`,
          '--progress-duration': `${duration}ms`,
        } as React.CSSProperties
      }
    >
      {/* Content Pill with Badge Inside */}
      <div className={`${styles.contentPill} ${isExiting ? styles.exiting : ''}`}>
        {/* Left: Badge Area (now inside pill) */}
        <div className={styles.badgeContainer}>
          <div
            className={`${styles.badge} ${isExiting ? styles.exiting : ''}`}
            data-ring={badge.ringColor}
          >
            <div className={styles.badgeIconWrapper}>
              {/* Primary icon (always visible) */}
              <ImageComponent
                src={badge.primaryIcon}
                alt=""
                width={iconSize}
                height={iconSize}
                className={`${styles.badgeIcon} ${badge.secondaryIcon ? styles.primary : ''}`}
                priority
              />
              
              {/* Secondary icon for crossfade animation */}
              {badge.secondaryIcon && (
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

        {/* Right: Text Content */}
        <div className={styles.textContent}>
          <h3 className={`${styles.title} ${isExiting ? styles.exiting : ''}`}>
            {title}
          </h3>
          
          {subtitle && (
            <p className={`${styles.subtitle} ${isExiting ? styles.exiting : ''}`}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Optional progress bar */}
        {showProgressBar && !isExiting && (
          <div className={styles.progressBar} />
        )}
      </div>
    </div>
  );
}
