'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useUser } from '@stackframe/stack';
import { useAudioManager } from '../../hooks/useAudioManager';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { trpc } from '../../utils/trpc';
import Tooltip from '../ui/Tooltip/Tooltip';
import { Clock } from '../ui/Clock/Clock';
import { BladeNavigation, BladePage } from './BladeNavigation';
import {
  SettingsPage,
  GamesPage,
  ProfilePage,
  MediaPage,
  ThemePage,
} from './BladePages';
import styles from './ProfileModal.module.css';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const stackUser = useUser();
  const { playSound } = useAudioManager();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const utils = trpc.useUtils();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = useCallback(() => {
    playSound('back');
    onClose();
  }, [playSound, onClose]);

  useBodyScrollLock(isOpen, handleClose);

  const { data: profile } = trpc.user.getProfile.useQuery();
  const { data: avatars } = trpc.user.getAvailableAvatars.useQuery();
  const updateProfileMutation = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      utils.user.getProfile.invalidate();
      playSound('navigation');
      onClose();
    },
    onError: (error) => {
      console.error('Failed to update avatar:', error);
    },
  });

  const handleAvatarSelect = useCallback((avatarId: string) => {
    setSelectedAvatar(avatarId);
  }, []);

  const handleSave = async () => {
    if (selectedAvatar && profile && !profile.isGuest) {
      try {
        await updateProfileMutation.mutateAsync({
          avatar: selectedAvatar,
        });
      } catch (error) {
        console.error('Failed to update avatar:', error);
      }
    }
  };

  const handleLogout = async () => {
    if (!stackUser) return;

    try {
      playSound('back');
      await stackUser.signOut();
      onClose();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Build blade pages configuration
  // Order: Settings -> Games -> Profile (center) -> Media -> Theme
  const bladePages: BladePage[] = useMemo(() => {
    if (!profile || !avatars) return [];

    return [
      {
        id: 'settings',
        label: 'Settings',
        content: <SettingsPage />,
      },
      {
        id: 'games',
        label: 'Games',
        content: <GamesPage />,
      },
      {
        id: 'profile',
        label: profile.name,
        content: (
          <ProfilePage
            profile={profile}
            avatars={avatars}
            selectedAvatar={selectedAvatar}
            onAvatarSelect={handleAvatarSelect}
          />
        ),
      },
      {
        id: 'media',
        label: 'Media',
        content: <MediaPage />,
      },
      {
        id: 'theme',
        label: 'Theme',
        content: <ThemePage />,
      },
    ];
  }, [profile, avatars, selectedAvatar, handleAvatarSelect]);

  if (!mounted || !isOpen || !profile) {
    return null;
  }

  const modalContent = (
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
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header - Outside modal */}
          <div className={styles.externalHeader}>
            <div className={styles.headerLeft}>
              <Image
                src="/assets/avatars/guest_gamerpic.svg"
                alt="Xbox Icon"
                width={24}
                height={24}
                className={styles.xboxIcon}
              />
              <h1 id="modal-title" className={styles.title}>
                Change Gamer Picture
              </h1>
            </div>
            <Clock className={styles.time} />
          </div>

          <motion.div
            className={styles.bladeWrapper}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <BladeNavigation
              pages={bladePages}
              initialPageId="profile"
            />
          </motion.div>

          {/* Footer - Outside modal */}
          <div className={styles.externalFooter}>
            <Tooltip
              content={
                profile.isGuest
                  ? 'Sign in to save your gamer picture'
                  : 'Save selected gamer picture'
              }
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
                <span className={styles.buttonText}>Save</span>
              </button>
            </Tooltip>

            <Tooltip
              content={
                profile.isGuest
                  ? 'Sign in to access account features'
                  : 'Log out of your account'
              }
              position="top"
              disabled={false}
            >
              <button
                className={styles.controlButton}
                onClick={handleLogout}
                disabled={profile.isGuest}
                onMouseEnter={() => playSound('owawa')}
              >
                <span className={`${styles.buttonIcon} ${styles.logoutIcon}`}>
                  B
                </span>
                <span className={styles.buttonText}>Log out</span>
              </button>
            </Tooltip>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render into portal
  return createPortal(modalContent, document.body);
};

export default ProfileModal;
