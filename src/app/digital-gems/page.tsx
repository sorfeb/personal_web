'use client';

import React from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import styles from './page.module.css';
import linksData from '../../data/coolSites.json'; // Import JSON file
import { motion } from 'framer-motion';

const getRandomPosition = () => ({
  top: `${Math.random() * 90}%`,
  left: `${Math.random() * 90}%`,
});

const getRandomDuration = () => Math.random() * 5 + 3; // Between 3s - 8s

const DigitalGemsPage = () => {
  return (
    <PageLayout title="Digital Gems">
      <div className={styles.scatteredContainer}>
        {linksData.links.map((link, index) => {
          const initialPos = getRandomPosition();

          return (
            <motion.a
              key={index}
              href={link}
              className={styles.scatteredItem}
              target="_blank"
              rel="noopener noreferrer"
              initial={initialPos}
              animate={{
                top: `${Math.random() * 90}%`,
                left: `${Math.random() * 90}%`,
              }}
              transition={{
                duration: getRandomDuration(),
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            >
              {link}
            </motion.a>
          );
        })}
      </div>
    </PageLayout>
  );
};

export default DigitalGemsPage;
