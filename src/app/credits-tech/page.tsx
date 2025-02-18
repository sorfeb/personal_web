'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useVolume } from '@/context/VolumeContext';
import RollingCredits from '../../components/RollingCredits/RollingCredits';
import styles from './page.module.css';

const CreditsTechPage = () => {
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          style={{ backgroundColor: 'black', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
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
          <RollingCredits displayType={1} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreditsTechPage;