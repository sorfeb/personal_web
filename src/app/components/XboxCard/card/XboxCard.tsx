'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './XboxCard.module.css';
import Image from 'next/image';
import { useVolume } from '../../../context/VolumeContext';
import { useRouter } from 'next/navigation';

interface XboxCardProps {
  title: string;
  iconUrl: string;
  route: string;
}

const XboxCard: React.FC<XboxCardProps> = ({ title, iconUrl, route}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPageVisible, setIsPageVisible] = useState(false);
  const { volume } = useVolume();
  const router = useRouter()

  const togglePage = () => {
    if (!isPageVisible) {
      playSound();
    }
    setIsPageVisible(!isPageVisible);
  };

  const handleCardClick = () => {
    if (route) {
      router.push(route);
    } else {
      console.log('No route specified');
    }
  };

  const playSound = () => {
    const audio = new Audio('/assets/audio/snd_buttonselect.wav');
    audio.volume = volume;
    audio.play();
  };

  const playHoverSound = () => {
    const audio = new Audio('/assets/audio/ps2_ding.wav');
    audio.volume = volume;
    audio.play();
  };

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

  return (
    <>
      <div
        className={`${styles.card} ${styles.cardReflection}`}
        ref={cardRef}
        onClick={handleCardClick}
        onMouseEnter={playHoverSound}
      >
        <div className={styles.shadowWrapper}></div>
        <div className={styles.glow}></div>
        <div className={`${styles.iconWrapper} ${styles.reflection}`}>
          <Image
            src={iconUrl}
            alt={title}
            width={40}
            height={40}
            className={styles.icon}
            priority 
          />
        </div>
        <h2 className={styles.title}>{title}</h2>
      </div>
    </>
  );
};

export default XboxCard;