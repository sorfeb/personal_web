'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useUser } from '@stackframe/stack';
import { useAudioManager } from '../../hooks/useAudioManager';
import { trpc } from '../../utils/trpc';
import Tooltip from '../ui/Tooltip/Tooltip';
import { Clock } from '../ui/Clock/Clock';
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

  // Ensure we're on the client side
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = useCallback(() => {
    playSound('back');
    onClose();
  }, [playSound, onClose]);

  // Body scroll lock and escape key handling
  useEffect(() => {
    if (isOpen) {
      // Save original styles
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalWidth = document.body.style.width;
      
      // Prevent scrolling with multiple methods
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      
      // Prevent wheel scrolling
      const preventScroll = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };
      
      // Prevent touch scrolling
      const preventTouchMove = (e: TouchEvent) => {
        e.preventDefault();
      };
      
      // Prevent keyboard scrolling
      const preventKeyScroll = (e: KeyboardEvent) => {
        if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
          e.preventDefault();
        }
        if (e.key === 'Escape') {
          handleClose();
        }
      };
      
      // Add event listeners with non-passive options
      document.addEventListener('wheel', preventScroll, { passive: false });
      document.addEventListener('touchmove', preventTouchMove, { passive: false });
      document.addEventListener('keydown', preventKeyScroll);
      
      return () => {
        // Restore original styles
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.width = originalWidth;
        
        // Remove event listeners
        document.removeEventListener('wheel', preventScroll);
        document.removeEventListener('touchmove', preventTouchMove);
        document.removeEventListener('keydown', preventKeyScroll);
      };
    }
  }, [isOpen, handleClose]);
  
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

  if (!mounted || !isOpen || !profile) {
    return null;
  }

  // The API guarantees a valid profile object (either user or guest)
  const currentAvatar = selectedAvatar || profile.avatar;
  const displayName = profile.name;
  const displayGamerscore = profile.gamerscore;

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
              <h1 id="modal-title" className={styles.title}>Change Gamer Picture</h1>
            </div>
            <Clock className={styles.time} />
          </div>

          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onWheel={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
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
                      priority
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
          </motion.div>

          {/* Footer - Outside modal */}
          <div className={styles.externalFooter}>
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
                <span className={styles.buttonText}>Save</span>
              </button>
            </Tooltip>
            
            <Tooltip 
              content={profile.isGuest ? "Sign in to access account features" : "Log out of your account"}
              position="top"
              disabled={false}
            >
              <button 
                className={styles.controlButton}
                onClick={handleLogout}
                disabled={profile.isGuest}
                onMouseEnter={() => playSound('owawa')}
              >
                <span className={`${styles.buttonIcon} ${styles.logoutIcon}`}>B</span>
                <span className={styles.buttonText}>Log out</span>
              </button>
            </Tooltip>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render into portal
  return createPortal(
    modalContent,
    document.body
  );
};

export default ProfileModal;
