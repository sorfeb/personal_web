'use client';

import React from 'react';
import styles from './XboxCardPopUp.module.css';

interface PopupProps {
  title: string;
  menuItems: string[];
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ title, menuItems, onClose }) => {
  const handleClose = () => {
    playSound();
    onClose(); 
  };

  const playSound = () => {
    const audio = new Audio('/assets/audio/snd_buttonback.wav'); // Path to your sound file
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
