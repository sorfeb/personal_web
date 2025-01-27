'use client';

import React from 'react';
import styles from './XboxCardPopUp.module.css';
import { useVolume } from '../../../context/VolumeContext';

interface PopupProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Popup: React.FC<PopupProps> = ({ title, onClose, children, className }) => {
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
    <>
      {/* Overlay */}
      <div className={styles.overlay} onClick={onClose}></div>

      {/* Popup */}
      <div className={`${styles.popup} ${className || ''}`}>
        <div className={styles.popupContent}>
          <h3 className={styles.popupTitle}>{title}</h3>
          <div className={styles.popupBody}>{children}</div>
          <button className={styles.closeButton} onClick={handleClose}>
            ✕
          </button>
        </div>
      </div>
    </>
  );
};

export default Popup;