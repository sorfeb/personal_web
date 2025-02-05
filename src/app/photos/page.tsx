'use client';

import React, { useRef, useState, useEffect } from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import styles from './page.module.css';
import { useVolume } from '@/context/VolumeContext';
import { CldImage } from 'next-cloudinary';
import { motion, AnimatePresence } from 'framer-motion';

const modalVariants = {
  hidden: { scale: 0, rotateY: 0 },
  visible: { scale: 1, rotateY: 180 },
  exit: { scale: 0, rotateY: 0 }, // Reverse animation on close
};

const backgroundVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.9 },
  exit: { opacity: 0 }, // Reverse fade on close
};

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
            whileHover={{ scale: 1.02 }}
            onMouseEnter={playHoverSound}
            onClick={() => {
              playSelectSound();
              setSelectedImage(src);
            }}
          >
            <div className={styles.squareThumbnail}>
              <CldImage src={src} alt={src} fill />
            </div>
            <p className={styles.imageTitle}>{src}</p>
          </motion.div>
        ))}
      </div>

      {/* AnimatePresence handles exit animations properly */}
      <AnimatePresence>
        {selectedImage && (
          <>
            {/* Background fading separately */}
            <motion.div
              className={styles.modalBackground}
              variants={backgroundVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }} // Background fades separately
            />

            {/* Image container rotates separately */}
            <motion.div
              className={styles.modal}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.6 }} // Image has its own transition
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.6 }}
              >
                <CldImage src={selectedImage} alt={selectedImage} width={800} height={600} />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

export default PhotosPage;
