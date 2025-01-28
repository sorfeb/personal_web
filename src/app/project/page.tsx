'use client';

import React, { useState } from 'react';
import styles from "./page.module.css";
import { useVolume } from '../context/VolumeContext';


const AboutPage: React.FC = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const { volume } = useVolume();

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  const playSound = () => {
    const audio = new Audio('/assets/audio/snd_buttonback.wav');
    audio.volume = volume;
    audio.play();
  };

  return (
    <div className={styles.pageContainer}>
      <p>osods</p>
    </div>
  );
};

export default AboutPage;