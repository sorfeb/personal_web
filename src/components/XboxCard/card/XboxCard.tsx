'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './XboxCard.module.css';
import Image from 'next/image';
import { useVolume } from '../../../context/VolumeContext';
import { useRouter } from 'next/navigation';

interface XboxCardProps {
  title: string;
  iconUrl?: string; 
  route: string;
  images?: string[];
}

const XboxCard: React.FC<XboxCardProps> = ({ title, iconUrl, route, images }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { volume } = useVolume();
  const router = useRouter();

  useEffect(() => {
    const element = cardRef.current;
    const handleMouseMove = (event: MouseEvent) => {
      if (element) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setMousePosition({ x, y });
        element.style.setProperty('--mouse-x', `${x}px`);
        element.style.setProperty('--mouse-y', `${y}px`);
      }
    };

    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  // Slideshow Effect
  useEffect(() => {
    if (images && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [images]);

  const handleCardClick = () => {
    if (route) {
      router.push(route);
    } else {
      console.log('No route specified');
    }
  };

  const playHoverSound = () => {
    const audio = new Audio('/assets/audio/ps2_ding.wav');
    audio.volume = volume;
    audio.play();
  };

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
};

export default XboxCard;
