'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './XboxCard.module.css';
import Image from 'next/image';
import Popup from './XboxCardPopUp';
import { useVolume } from '../../context/VolumeContext';

interface XboxCardProps {
  title: string;
  iconUrl: string;
  popupContent?: React.ReactNode; // Optional custom content for the popup
}

const XboxCard: React.FC<XboxCardProps> = ({ title, iconUrl, popupContent }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { volume } = useVolume();

  const togglePopup = () => {
    if (!isPopupVisible) {
      playSound();
    }
    setIsPopupVisible(!isPopupVisible);
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
        onClick={togglePopup}
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
          />
        </div>
        <h2 className={styles.title}>{title}</h2>
      </div>

      {isPopupVisible && (
        <Popup title={title} onClose={togglePopup}>
          {popupContent || ( // Render custom content if provided, otherwise fallback to default
            <ul className={styles.menu}>
              <li className={styles.menuItem}>Play Game</li>
              <li className={styles.menuItem}>Downloads</li>
              <li className={styles.menuItem}>Install to Hard Drive</li>
            </ul>
          )}
        </Popup>
      )}
    </>
  );
};

export default XboxCard;