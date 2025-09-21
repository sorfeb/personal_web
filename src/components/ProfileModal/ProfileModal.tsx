'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useAudioManager } from '../../hooks/useAudioManager';
import { trpc } from '../../utils/trpc';
import Tooltip from '../ui/Tooltip/Tooltip';
import styles from './ProfileModal.module.css';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { playSound } = useAudioManager();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);
  
  const { data: profile } = trpc.user.getProfile.useQuery();
  const { data: avatars } = trpc.user.getAvailableAvatars.useQuery();
  const updateProfileMutation = trpc.user.updateProfile.useMutation();

  const handleAvatarSelect = (avatarId: string) => {
    playSound('click');
    setSelectedAvatar(avatarId);
  };

  const handleSave = async () => {
    if (selectedAvatar && profile && !profile.isGuest) {
      try {
        await updateProfileMutation.mutateAsync({
          avatar: selectedAvatar,
        });
        playSound('navigation');
        onClose();
      } catch (error) {
        console.error('Failed to update avatar:', error);
      }
    }
  };

  const handleClose = () => {
    playSound('back');
    onClose();
  };

  if (!isOpen || !profile) {
    return null;
  }

  // The API guarantees a valid profile object (either user or guest)
  const currentAvatar = selectedAvatar || profile.avatar;
  const displayName = profile.name;
  const displayGamerscore = profile.gamerscore;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onWheel={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <Image
                src="/assets/avatars/guest_gamerpic.svg"
                alt="Xbox Icon"
                width={24}
                height={24}
                className={styles.xboxIcon}
              />
              <h1 className={styles.title}>Change Gamer Picture</h1>
            </div>
            <div className={styles.time}>{currentTime}</div>
          </div>

          <div className={styles.content}>
            {/* Avatar Grid */}
            <div className={styles.avatarGrid}>
              {avatars?.map((avatar) => (
                <motion.div
                  key={avatar.id}
                  className={`${styles.avatarOption} ${
                    currentAvatar === avatar.id ? styles.selected : ''
                  }`}
                  onClick={() => handleAvatarSelect(avatar.id)}
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

            {/* Profile Preview */}
            <div className={styles.previewPanel}>
              <div className={styles.profilePreview}>
                <div className={styles.previewAvatar}>
                  <Image
                    src={`/assets/avatars/${currentAvatar}`}
                    alt="Selected Avatar"
                    width={96}
                    height={96}
                    className={styles.previewImage}
                  />
                </div>
                <div className={styles.profileInfo}>
                  <h2 className={styles.profileName}>{displayName}</h2>
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

          {/* Footer Controls */}
          <div className={styles.footer}>
            <div className={styles.controls}>
              <Tooltip 
                content={profile.isGuest ? "Sign in to save your gamer picture" : "Save selected gamer picture"}
                position="top"
                disabled={false}
              >
                <button 
                  className={styles.controlButton}
                  onClick={handleSave}
                  disabled={profile.isGuest}
                  onMouseEnter={() => playSound('owawa')}
                >
                  <span className={styles.buttonIcon}>A</span>
                  <span className={styles.buttonText}>Select</span>
                </button>
              </Tooltip>
              <button 
                className={styles.controlButton}
                onClick={handleClose}
                onMouseEnter={() => playSound('owawa')}
              >
                <span className={styles.buttonIcon}>B</span>
                <span className={styles.buttonText}>Back</span>
              </button>
            </div>
          </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;
