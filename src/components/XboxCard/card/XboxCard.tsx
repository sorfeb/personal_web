'use client';

import React, { memo, useCallback, useRef, useState } from 'react';
import styles from './XboxCard.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useAudioManager } from '../../../hooks/useAudioManager';
import { useNavigationSound } from '../../../hooks/useNavigationSound';
import { useEventListener, useInterval } from '@/hooks';

export interface XboxCardProps {
  title: string;
  iconUrl?: string;
  route: string;
  images?: string[];
  /**
   * `icon` (default) centres an icon above the title. `game` fills the card with
   * cover art and drops the title to the bottom edge, over a scrim. Games get
   * artwork rather than line-art icons: a shelf of covers is what the 360
   * dashboard actually looked like.
   */
  variant?: 'icon' | 'game';
  /**
   * Cover art for the `game` variant. Absent art falls back to a flat brand
   * panel rather than an icon, so a section mid-way through getting artwork
   * still reads as one grid instead of a mix of two treatments.
   */
  artUrl?: string;
  /**
   * Card has been scrolled out of the stack (`useCardNavigation` parks it
   * off-screen at zero opacity). Invisible elements are still tabbable, so it
   * must be pulled out of the tab order and the accessibility tree.
   */
  offscreen?: boolean;
}

const XboxCard: React.FC<XboxCardProps> = memo(({
  title,
  iconUrl,
  route,
  images,
  variant = 'icon',
  artUrl,
  offscreen = false,
}) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  /**
   * Art that 404s or fails to decode drops back to the placeholder panel rather
   * than leaving the browser's broken-image glyph on the card. Cards remount per
   * blade (keyed by section and title), so this never needs resetting.
   */
  const [artFailed, setArtFailed] = useState(false);
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

  const isGame = variant === 'game';

  return (
    <Link
      href={route}
      className={`${styles.card} ${styles.cardReflection} ${isGame ? styles.gameCard : ''}`}
      ref={cardRef}
      onClick={playNavigationSound}
      onMouseEnter={playHoverSound}
      onFocus={playHoverSound}
      tabIndex={offscreen ? -1 : undefined}
      aria-hidden={offscreen || undefined}
      style={images ? { backgroundImage: `url(${images[currentImageIndex]})`, backgroundSize: 'cover' } : {}}
    >
      {/* The game variant's own scrim replaces this one — stacking both would
          darken the bottom third twice over. */}
      {!isGame && <div className={styles.shadowWrapper}></div>}
      <div className={styles.glow}></div>

      {isGame && (
        <>
          <div className={styles.artWrapper}>
            {artUrl && !artFailed && (
              <>
                {/* Same src as the foreground, so this costs one decode and no
                    extra request. Fills the gutters that `contain` leaves when a
                    portrait box scan sits in a landscape card. */}
                <Image
                  src={artUrl}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 45vw, 30vw"
                  className={styles.artBackdrop}
                  priority={!offscreen}
                />
                <Image
                  src={artUrl}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 45vw, 30vw"
                  className={styles.art}
                  // Cover art is heavy; only the cards actually on screen are worth
                  // pre-loading. The parked ones lazy-load as they scroll in.
                  priority={!offscreen}
                  onError={() => setArtFailed(true)}
                />
              </>
            )}
          </div>
          <div className={styles.artScrim}></div>
        </>
      )}

      {!isGame && !images && (
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

      <h2 className={styles.title}>{title}</h2>
    </Link>
  );
});

XboxCard.displayName = 'XboxCard';

export default XboxCard;
