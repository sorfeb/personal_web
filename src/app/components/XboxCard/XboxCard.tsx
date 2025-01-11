'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './XboxCard.module.css';
import Image from 'next/image';
import Popup from './XboxCardPopUp';

interface XboxCardProps {
    title: string;
    iconUrl: string;
  }

const XboxCard: React.FC<XboxCardProps> = ({ title, iconUrl  }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const togglePopup = () => {
      setIsPopupVisible(!isPopupVisible);
    };

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
          if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            setMousePosition({ x, y });
            cardRef.current.style.setProperty('--mouse-x', `${x}px`);
            cardRef.current.style.setProperty('--mouse-y', `${y}px`);
          }
        };

        if (cardRef.current) {
          cardRef.current.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
          if (cardRef.current) {
              cardRef.current.removeEventListener('mousemove', handleMouseMove);
          }
      };
    }, []);

    return (
      <>
        <div className={styles.card} ref={cardRef} onClick={togglePopup}>
          <div className={styles.glow}></div>
          <div className={styles.iconWrapper}>
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
          <Popup
            title={title}
            menuItems={['Play Game', 'Downloads', 'Install to Hard Drive']}
            onClose={togglePopup}
          />
        )}
      </>
    );
};

export default XboxCard;