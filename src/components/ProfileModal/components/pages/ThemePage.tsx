'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useAudioManager } from '../../../../hooks/useAudioManager';
import type { ThemeOption } from '../../types';
import styles from './pages.module.css';

const THEMES: ThemeOption[] = [
  { id: 'default', name: 'Default', color: '#6cb82b' },
  { id: 'blue', name: 'Blue', color: '#0078d4' },
  { id: 'red', name: 'Red', color: '#e81123' },
  { id: 'purple', name: 'Purple', color: '#8764b8' },
];

const ThemePage = memo(() => {
  const { playSound } = useAudioManager();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.themeGrid}>
        {THEMES.map((theme) => (
          <motion.div
            key={theme.id}
            className={styles.themeOption}
            onMouseEnter={() => playSound('owawa')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className={styles.themePreview}
              style={{ backgroundColor: theme.color }}
            />
            <span className={styles.themeName}>{theme.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

ThemePage.displayName = 'ThemePage';

export default ThemePage;
