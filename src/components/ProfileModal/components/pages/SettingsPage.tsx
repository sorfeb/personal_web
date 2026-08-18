'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useAudioManager } from '../../../../hooks/useAudioManager';
import { useAchievements } from '../../../../hooks/useAchievements';
import { useCRTFilter } from '../../../../context/CRTFilterContext';
import Toggle from '../../../ui/Toggle/Toggle';
import styles from './pages.module.css';

const MENU_ITEMS = ['Audio', 'Controls', 'Privacy', 'About'];

const SettingsPage = memo(() => {
  const { playSound } = useAudioManager();
  const { isEnabled, toggleCRTFilter } = useCRTFilter();
  const { unlock } = useAchievements();

  const handleCRTToggle = () => {
    toggleCRTFilter();
    unlock('scanline-purist');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.menuList}>
        <motion.div
          className={`${styles.menuItem} ${styles.settingRow}`}
          onMouseEnter={() => playSound('owawa')}
          whileHover={{ x: 8, backgroundColor: 'rgba(255,255,255,0.1)' }}
        >
          <span>CRT Filter</span>
          <Toggle
            enabled={isEnabled}
            onChange={handleCRTToggle}
            ariaLabel="Toggle CRT filter"
            size="sm"
          />
        </motion.div>
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
