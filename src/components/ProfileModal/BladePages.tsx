'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAudioManager } from '../../hooks/useAudioManager';
import styles from './BladePages.module.css';

// ============================================
// SHARED TYPES
// ============================================

interface ProfileData {
  name: string;
  avatar: string;
  gamerscore: number;
  isGuest: boolean;
}

interface Avatar {
  id: string;
  name: string;
  path: string;
}

// ============================================
// SETTINGS PAGE
// ============================================

export const SettingsPage: React.FC = () => {
  const { playSound } = useAudioManager();

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>Settings</h2>
      <div className={styles.menuList}>
        {['Audio', 'Display', 'Controls', 'Privacy', 'About'].map((item) => (
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
};

// ============================================
// GAMES PAGE
// ============================================

export const GamesPage: React.FC = () => {
  const { playSound } = useAudioManager();

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>Games</h2>
      <div className={styles.menuList}>
        {['Play Game', 'Game Library', 'Achievements', 'Demos', 'Arcade'].map((item) => (
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
};

// ============================================
// PROFILE PAGE (Avatar Selection)
// ============================================

interface ProfilePageProps {
  profile: ProfileData;
  avatars: Avatar[];
  selectedAvatar: string | null;
  onAvatarSelect: (avatarId: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  avatars,
  selectedAvatar,
  onAvatarSelect,
}) => {
  const { playSound } = useAudioManager();
  const currentAvatar = selectedAvatar || profile.avatar;
  const displayGamerscore = profile.gamerscore;

  return (
    <div className={styles.profilePageContainer}>
      <div className={styles.avatarGrid}>
        {avatars?.map((avatar) => (
          <motion.div
            key={avatar.id}
            className={`${styles.avatarOption} ${
              currentAvatar === avatar.id ? styles.selected : ''
            }`}
            onClick={() => {
              playSound('click');
              onAvatarSelect(avatar.id);
            }}
            onMouseEnter={() => playSound('owawa')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src={avatar.path}
              alt={avatar.name}
              width={64}
              height={64}
              className={styles.avatarImage}
            />
          </motion.div>
        ))}
      </div>

      <div className={styles.previewPanel}>
        <div className={styles.profilePreview}>
          <div className={styles.previewAvatar}>
            <Image
              src={`/assets/avatars/${currentAvatar}`}
              alt="Selected Avatar"
              width={96}
              height={96}
              className={styles.previewImage}
              priority
            />
          </div>
          <div className={styles.profileInfo}>
            <h2 className={styles.profileName}>{profile.name}</h2>
            <div className={styles.statsRow}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Games</span>
                <span className={styles.statValue}>0</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Gamerscore</span>
                <span className={styles.statValue}>
                  {displayGamerscore?.toLocaleString()}
                  <Image
                    src="/assets/icons/Gamerscore.gif"
                    alt="Gamerscore"
                    width={16}
                    height={16}
                    className={styles.gamerscoreIcon}
                  />
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Achievements</span>
                <span className={styles.statValue}>0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MEDIA PAGE
// ============================================

export const MediaPage: React.FC = () => {
  const { playSound } = useAudioManager();

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>Media</h2>
      <div className={styles.menuList}>
        {['Music', 'Pictures', 'Videos', 'Portable Device', 'Media Center'].map((item) => (
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
};

// ============================================
// THEME PAGE
// ============================================

export const ThemePage: React.FC = () => {
  const { playSound } = useAudioManager();

  const themes = [
    { id: 'default', name: 'Default', color: '#6cb82b' },
    { id: 'blue', name: 'Blue', color: '#0078d4' },
    { id: 'red', name: 'Red', color: '#e81123' },
    { id: 'purple', name: 'Purple', color: '#8764b8' },
  ];

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>Themes</h2>
      <div className={styles.themeGrid}>
        {themes.map((theme) => (
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
};
