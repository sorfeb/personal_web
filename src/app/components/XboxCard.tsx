'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './XboxCard.module.css';
import Image from 'next/image';

interface XboxCardProps {
    title: string;
    iconUrl: string;
  }

const XboxCard: React.FC<XboxCardProps> = ({ title, iconUrl  }) => {
    const [isHovering, setIsHovering] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        });
        }
    };

    useEffect(() => {
        if (isHovering && cardRef.current) {
        const glowElement = cardRef.current.querySelector(`.${styles.glow}`) as HTMLElement;
        if (glowElement) {
            glowElement.style.left = `${mousePosition.x}px`;
            glowElement.style.top = `${mousePosition.y}px`;
        }
        }
    }, [isHovering, mousePosition]);

    return (
        <div 
          className={`${styles.card} ${isHovering ? styles.hovering : ''}`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
          ref={cardRef}
        >
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
      );
};

export default XboxCard;