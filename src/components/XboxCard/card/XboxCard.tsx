'use client';

import React, { memo, useCallback, useRef, useState } from 'react';
import styles from './XboxCard.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useAudioManager } from '../../../hooks/useAudioManager';
import { useNavigationSound } from '../../../hooks/useNavigationSound';
import { useEventListener, useInterval } from '@/hooks';

interface XboxCardProps {
  title: string;
  iconUrl?: string;
  route: string;
  images?: string[];
  /**
   * Card has been scrolled out of the stack (`useCardNavigation` parks it
   * off-screen at zero opacity). Invisible elements are still tabbable, so it
   * must be pulled out of the tab order and the accessibility tree.
   */
  offscreen?: boolean;
}

const XboxCard: React.FC<XboxCardProps> = memo(({ title, iconUrl, route, images, offscreen = false }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { playSound } = useAudioManager();
  const { playNavigationSound } = useNavigationSound();

  // Spotlight follows the pointer via CSS custom properties — written straight to
  // the element so pointer movement never triggers a React render.
  useEventListener(cardRef, 'mousemove', (event) => {
    const element = cardRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    element.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
    element.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
  });

  // Slideshow
  useInterval(
    () => {
      if (images && images.length > 1) {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }
    },
    images && images.length > 1 ? 2000 : null,
  );

  // Link performs the navigation; we only supply the audio.
  const playHoverSound = useCallback(() => playSound('hover'), [playSound]);

  return (
    <Link
      href={route}
      className={`${styles.card} ${styles.cardReflection}`}
      ref={cardRef}
      onClick={playNavigationSound}
      onMouseEnter={playHoverSound}
      onFocus={playHoverSound}
      tabIndex={offscreen ? -1 : undefined}
      aria-hidden={offscreen || undefined}
      style={images ? { backgroundImage: `url(${images[currentImageIndex]})`, backgroundSize: 'cover' } : {}}
    >
      <div className={styles.shadowWrapper}></div>
      <div className={styles.glow}></div>

      {images ? (
        <h2 className={styles.title}>{title}</h2>
      ) : (
        <div className={`${styles.iconWrapper} ${styles.reflection}`}>
          <Image
            src={iconUrl || ''}
            alt=""
            width={40}
            height={40}
            sizes="40px"
            className={styles.icon}
            priority
          />
        </div>
      )}

      {!images && <h2 className={styles.title}>{title}</h2>}
    </Link>
  );
});

XboxCard.displayName = 'XboxCard';

export default XboxCard;
