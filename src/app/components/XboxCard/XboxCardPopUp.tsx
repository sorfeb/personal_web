'use client';

import React from 'react';
import styles from './XboxCardPopUp.module.css';
import { useVolume } from '../../context/VolumeContext';

interface PopupProps {
  title: string;
  menuItems: string[];
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ title, menuItems, onClose }) => {
  const { volume } = useVolume();
  const handleClose = () => {
    playSound();
    onClose(); 
  };

  const playSound = () => {
    const audio = new Audio('/assets/audio/snd_buttonback.wav');
    audio.volume = volume;
    audio.play();
  };
  
  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <h3 className={styles.popupTitle}>{title}</h3>
        <ul className={styles.menu}>
          {menuItems.map((item, index) => (
            <li key={index} className={`${styles.menuItem} ${index === 0 ? styles.active : ''}`}>
              {item}
            </li>
          ))}
        </ul>
        <button className={styles.closeButton} onClick={handleClose}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default Popup;
