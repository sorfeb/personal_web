'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useAudioManager } from '../../../../hooks/useAudioManager';
import styles from './pages.module.css';

const MENU_ITEMS = ['Audio', 'Display', 'Controls', 'Privacy', 'About'];

const SettingsPage = memo(() => {
  const { playSound } = useAudioManager();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.menuList}>
        {MENU_ITEMS.map((item) => (
          <motion.div
            key={item}
            className={styles.menuItem}
            onMouseEnter={() => playSound('owawa')}
            whileHover={{ x: 8, backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            {item}
          </motion.div>
        ))}
      </div>
    </div>
  );
});

SettingsPage.displayName = 'SettingsPage';

export default SettingsPage;
