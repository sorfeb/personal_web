'use client';

import React, { ReactNode, useState } from 'react';
import styles from './PageLayout.module.css';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useVolume } from '../../context/VolumeContext';

interface PageLayoutProps {
  title: string;
  children: ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, children }) => {
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
    setIsExiting(true);
    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key={title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.pageContainer}
        >
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>{title}</h1>
          </div>
          <div className={styles.closeButtonWrapper}>
            <button className={styles.closeButton} onClick={handleClose}>
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
          <motion.div
            className={`${styles.window} ${styles.windowReflection}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.windowContent}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLayout;
