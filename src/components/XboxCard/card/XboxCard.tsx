'use client';

import React, { memo, useCallback, useRef, useState } from 'react';
import styles from './XboxCard.module.css';
import Image from 'next/image';
import { useAudioManager } from '../../../hooks/useAudioManager';
import { useNavigationSound } from '../../../hooks/useNavigationSound';
import { useEventListener, useInterval } from '@/hooks';

interface XboxCardProps {
  title: string;
  iconUrl?: string; 
  route: string;
  images?: string[];
}

const XboxCard: React.FC<XboxCardProps> = memo(({ title, iconUrl, route, images }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { playSound } = useAudioManager();
  const { navigateWithSound } = useNavigationSound();

  useEventListener(cardRef, 'mousemove', (event) => {
    const element = cardRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setMousePosition({ x, y });
    element.style.setProperty('--mouse-x', `${x}px`);
    element.style.setProperty('--mouse-y', `${y}px`);
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

  const handleCardClick = useCallback(() => {
    if (route) {
      navigateWithSound(route);
    } else {
      console.log('No route specified');
    }
  }, [route, navigateWithSound]);

  const playHoverSound = useCallback(() => playSound('hover'), [playSound]);

  return (
    <div
      className={`${styles.card} ${styles.cardReflection}`}
      ref={cardRef}
      onClick={handleCardClick}
      onMouseEnter={playHoverSound}
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
            alt={title}
            width={40}
            height={40}
            className={styles.icon}
            priority 
          />
        </div>
      )}

      {!images && <h2 className={styles.title}>{title}</h2>}
    </div>
  );
});

export default XboxCard;
