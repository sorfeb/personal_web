'use client';

import React, { useState } from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import styles from './Photos.module.css';
import { useAudioManager } from '../../hooks/useAudioManager';
import { useMountEffect } from '@/hooks';
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
  const { playSound } = useAudioManager();

  useMountEffect(() => {
    import('@/data/photos.json')
      .then((data) => setImageList(data.images))
      .catch((error) => console.error('Error loading images:', error));
  });

  const playHoverSound = () => playSound('divine');
  const playSelectSound = () => playSound('navigation');

  return (
    <PageLayout title="Photos">
      <PageLayout.Header />
      <PageLayout.Body>
        <div className={styles.textContainer}>
          <p><i>Just several photos from my camera roll. Click on a thumbnail to view it in full size.</i></p>
        </div>
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
      </PageLayout.Body>
    </PageLayout>
  );
};

export default PhotosPage;
