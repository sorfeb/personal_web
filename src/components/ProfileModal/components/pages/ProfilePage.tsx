'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAudioManager } from '../../../../hooks/useAudioManager';
import type { ProfilePageProps } from '../../types';
import styles from './pages.module.css';

const ProfilePage = memo<ProfilePageProps>(({
  profile,
  avatars,
  selectedAvatar,
  onAvatarSelect,
}) => {
  const { playSound } = useAudioManager();
  const currentAvatar = selectedAvatar || profile.avatar;

  const handleAvatarClick = (avatarId: string) => {
    playSound('click');
    onAvatarSelect(avatarId);
  };

  return (
    <div className={styles.profilePageContainer}>
      <div className={styles.avatarGrid}>
        {avatars?.map((avatar) => (
          <motion.div
            key={avatar.id}
            className={`${styles.avatarOption} ${
              currentAvatar === avatar.id ? styles.selected : ''
            }`}
            onClick={() => handleAvatarClick(avatar.id)}
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
                  {profile.gamerscore?.toLocaleString()}
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
});

ProfilePage.displayName = 'ProfilePage';

export default ProfilePage;
