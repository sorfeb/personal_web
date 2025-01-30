'use client';

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { useVolume } from '../../context/VolumeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const AboutPage: React.FC = () => {
  const { volume } = useVolume();
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  const playSound = () => {
    const audio = new Audio('/assets/audio/snd_buttonback.wav');
    audio.volume = volume;
    audio.play();
  };

  const handleClose = () => {
    playSound();
    setIsExiting(true); // Start exit animation
    setTimeout(() => {
      router.push('/'); // Navigate only after animation completes
    }, 500); // Match this duration with exit animation
  };
  
  return (
    <AnimatePresence>
     {!isExiting && (
        <motion.div
          key="about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }} // Fade-out animation
          transition={{ duration: 0.5 }}
          className={styles.pageContainer}
        >
        {/* Page title */}
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>About</h1>
        </div>
        <div className={styles.closeButtonWrapper}>
          <button
            className={styles.closeButton} onClick={handleClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="30"
              height="30"
              className={styles.closeIcon}
            >
              <path
                d="M6 6L18 18M6 18L18 6"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        {/* Main window content */}
        <div className={styles.window}>
          <div className={styles.windowContent}>
            <p>
              <i>The "NXE" update, which stands for "New Xbox Experience," 
              was a major system update for the Xbox 360 that significantly 
              redesigned the dashboard, adding features like avatar creation, 
              the ability to install games directly to the hard drive for faster loading times, 
              a revamped Xbox Guide, and improved multimedia capabilities, essentially providing
                a more modern and user-friendly interface compared to previous Xbox 360 
                dashboards; it was initially released in November 2008 and required users to 
                have a storage device like a memory card or hard drive to install.</i>
            </p>
            <p> Made with Next.js, Framer Motion, Jquery, and CSS. </p>
            <p>© 2025 Soros Febriano </p>
          </div>
        </div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AboutPage;
