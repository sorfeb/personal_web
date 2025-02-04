'use client';

import React, { useRef, useState, useEffect } from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import styles from './page.module.css';
import { useVolume } from '@/context/VolumeContext';
import { CldImage } from 'next-cloudinary';
import { motion } from 'framer-motion';

const PhotosPage = () => {
  const [imageList, setImageList] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const selectAudioRef = useRef<HTMLAudioElement | null>(null);
  const { volume } = useVolume();

  const hoverSound = '/assets/audio/ps2_divine.wav';
  const selectSound = '/assets/audio/snd_buttonselect.wav';

  useEffect(() => {
    import('@/data/photos.json')
      .then((data) => setImageList(data.images))
      .catch((error) => console.error('Error loading images:', error));
  }, []);

  const playHoverSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = volume;
      audioRef.current.play();
    }
  };

  const playSelectSound = () => {
    if (selectAudioRef.current) {
      selectAudioRef.current.currentTime = 0;
      selectAudioRef.current.volume = volume;
      selectAudioRef.current.play();
    }
  };

  return (
    <PageLayout title="Photos">
      <audio ref={audioRef} src={hoverSound} />
      <audio ref={selectAudioRef} src={selectSound} />

      <div className={styles.imageGrid}>
        {imageList.map((src) => (
          <motion.div
            key={src}
            className={styles.imageContainer}
            whileHover={{ scale: 1.05 }}
            onMouseEnter={playHoverSound}
            onClick={() => {
              playSelectSound();
              setSelectedImage(src);
            }}
          >
            <CldImage 
              src={src} 
              alt={src} 
              width={300}
              height={200} 
            />
            <div className={styles.overlay}></div>
          </motion.div>
        ))}
      </div>

      {/* Enlarged Image View */}
      {selectedImage && (
        <motion.div
          // Modal Container
          className={styles.modal}
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotateY: 180 }}
          exit={{ scale: 0, rotateY: 0 }}
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            // Background
            className={styles.modalBackground}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
          <motion.div
            // Photo
            initial={{ scale: 0 }}
            animate={{ scale: 0.8, rotateY: 180 }}
            exit={{ scale: 0, rotateY: 0 }}
            transition={{ duration: 1 }}
          >
            <CldImage src={selectedImage} alt={selectedImage} width={800} height={600} />
          </motion.div>
        </motion.div>
      )}
    </PageLayout>
  );
};

export default PhotosPage;
