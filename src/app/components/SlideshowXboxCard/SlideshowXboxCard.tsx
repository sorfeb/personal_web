'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './SlideshowXboxCard.module.css';
import XboxCard from '../XboxCard/XboxCard';

interface SlideshowXboxCardProps {
  title: string;
  images: string[];
}

const SlideshowXboxCard: React.FC<SlideshowXboxCardProps> = ({ title, images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Clean up the interval
  }, [images.length]);

  return (
    <XboxCard
      title={title}
      iconUrl={images[currentImageIndex]} // Pass the current image as the icon
    />
  );
};

export default SlideshowXboxCard;
