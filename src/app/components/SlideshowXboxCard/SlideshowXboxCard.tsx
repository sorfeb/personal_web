'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './SlideshowXboxCard.module.css';
import Image from 'next/image';

interface SlideshowXboxCardProps {
  title: string;
  images: string[];
}

const SlideshowXboxCard: React.FC<SlideshowXboxCardProps> = ({ title, images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Change the current image every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Track mouse movement for hover effects
  useEffect(() => {
    const element = cardRef.current; // Capture the current value of the ref

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
      cardRef.current.addEventListener('mousemove', handleMouseMove);
    }

    // Cleanup function
    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <div
      className={styles.card}
      ref={cardRef}
      style={{
        backgroundImage: `url(${images[currentImageIndex]})`,
      }}
    >
      <div className={styles.glow}></div>
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
};

export default SlideshowXboxCard;
