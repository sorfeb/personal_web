'use client';

import React, { useRef } from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import styles from './page.module.css';
import { useVolume } from '@/context/VolumeContext';
import { a } from 'framer-motion/client';

const LeetcodePage = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { volume } = useVolume();

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; 
      audioRef.current.volume = volume;
      audioRef.current.play();
    }
  };

  return (
    <PageLayout title="Leetcode">
      <div className={styles.LeetcodeCard}>
        <audio ref={audioRef} src="/assets/audio/ps2_swing.wav" />
        <a
          href="https://leetcode.com/u/sorfebyorke/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.container}
          onMouseEnter={playSound}
        >
          <img
            src="https://leetcard.jacoblin.cool/sorfebyorke?theme=transparent&font=Anonymous%20Pro&ext=heatmap"
            alt="Leetcode Stats"
          />
        </a>
      </div>
    </PageLayout>
  );
};

export default LeetcodePage;
