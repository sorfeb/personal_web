'use client';

import React, { useState, useCallback, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { authClient } from '../../lib/auth-client';
import { Settings } from 'lucide-react';
import { useAudioManager } from '../../hooks/useAudioManager';
import { useAchievements } from '../../hooks/useAchievements';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useIsMounted } from '@/hooks';
import { useGamepadScope } from '../../hooks/useGamepadScope';
import { useSpatialNavigation } from '../../hooks/useSpatialNavigation';
import { useIsMobile } from '../../utils/responsiveUtils';
import { trpc } from '../../utils/trpc';
import Tooltip from '../ui/Tooltip/Tooltip';
import { Clock } from '../ui/Clock/Clock';
import { useToast, createSystemToast } from '../ToastNotification';
import {
  BladeNavigation,
  SettingsPage,
  AchievementsPage,
  ProfilePage,
  ThemePage,
} from './components';
import type { ThemePageRef } from './components/pages';
import type { BladePage, BladeExternalFooterAction } from './types';
import styles from './ProfileModal.module.css';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { data: session } = authClient.useSession();
  const { playSound } = useAudioManager();
  const { showToast } = useToast();
  const { unlock } = useAchievements();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const mounted = useIsMounted();
  const [activePageId, setActivePageId] = useState<string>('profile');

  // Ref for ThemePage imperative handle
  const themePageRef = useRef<ThemePageRef>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile(768);

  const utils = trpc.useUtils();

  const handleClose = useCallback(() => {
    playSound('back');
    onClose();
  }, [playSound, onClose]);

  useBodyScrollLock(isOpen, handleClose);

  /**
   * Controller scope. Pushed above the dashboard's, which is what silences the
   * blades and card stack behind it — Phase 2 achieved that by threading a
   * `disabled` prop down from the page, and this replaces it.
   *
   * Registered before the `!mounted || !isOpen` early return below, gated by
   * `enabled` rather than by calling the hook conditionally.
   */
  const { moveFocus } = useSpatialNavigation({
    containerRef: backdropRef,
    enabled: isOpen && !isMobile,
  });

  useGamepadScope({
    id: 'profile-modal',
    enabled: isOpen && !isMobile,
    restoreFocusOnPop: true,
    handlers: {
      up: () => moveFocus('up'),
      down: () => moveFocus('down'),
      left: () => moveFocus('left'),
      right: () => moveFocus('right'),
      back: handleClose,
    },
  });

  const { data: profile } = trpc.user.getProfile.useQuery();
  const { data: avatars } = trpc.user.getAvailableAvatars.useQuery();
  const updateProfileMutation = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      utils.user.getProfile.invalidate();
      unlock('new-you');
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

  const handleSignIn = async () => {
    playSound('navigation');
    await authClient.signIn.social({ provider: 'github', callbackURL: '/' });
  };

  const handleLogout = async () => {
    if (!session?.user) return;
    await authClient.signOut();
    playSound('back');
    onClose();
  };

  // Build blade pages configuration
  // Order: Settings -> Achievements -> Profile (center) -> Theme
  const bladePages: BladePage[] = useMemo(() => {
    if (!profile || !avatars) return [];

    // Shared save action for profile-related pages
    const saveAction: BladeExternalFooterAction = {
      key: 'save',
      label: 'Save',
      buttonIcon: 'A',
      variant: 'green',
      onClick: handleSave,
      disabled: profile.isGuest,
      tooltip: profile.isGuest
        ? 'Sign in to save changes'
        : 'Save changes',
    };

    // Shared sign-in action (for guests)
    const signInAction: BladeExternalFooterAction = {
      key: 'signIn',
      label: 'Sign in',
      buttonIcon: 'A',
      variant: 'green',
      onClick: handleSignIn,
      tooltip: 'Sign in with GitHub',
    };

    // Shared logout action (for authenticated users)
    const logoutAction: BladeExternalFooterAction = {
      key: 'logout',
      label: 'Log out',
      buttonIcon: 'B',
      variant: 'red',
      onClick: handleLogout,
      tooltip: 'Log out of your account',
    };

    // Back action for navigation
    const backAction: BladeExternalFooterAction = {
      key: 'back',
      label: 'Back',
      buttonIcon: 'B',
      variant: 'red',
      onClick: handleClose,
      tooltip: 'Close menu',
    };

    // Select action for menu items
    const selectAction: BladeExternalFooterAction = {
      key: 'select',
      label: 'Select',
      buttonIcon: 'A',
      variant: 'green',
      tooltip: 'Select item',
    };

    // Icon style for consistent gray gradient aesthetic
    const iconClass = styles.headerIcon;

    return [
      {
        id: 'settings',
        label: 'Settings',
        content: <SettingsPage />,
        externalHeader: {
          title: 'System Settings',
          icon: <Settings className={iconClass} size={22} strokeWidth={1.5} />,
          showClock: true,
        },
        externalFooter: {
          actions: [selectAction, backAction],
        },
      },
      {
        id: 'achievements',
        label: 'Achievements',
        content: <AchievementsPage />,
        externalHeader: {
          title: 'Achievements',
          iconSrc: '/assets/icons/toast/trophy.png',
          showClock: true,
        },
        externalFooter: {
          actions: [backAction],
        },
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
        externalHeader: {
          title: 'Change Gamer Picture',
          iconSrc: '/assets/avatars/guest_gamerpic.svg',
          showClock: true,
        },
        externalFooter: {
          actions: profile.isGuest
            ? [signInAction, backAction]
            : [saveAction, logoutAction],
        },
      },
      {
        id: 'theme',
        label: 'Theme',
        content: <ThemePage ref={themePageRef} />,
        externalHeader: {
          title: 'Customize Theme',
          iconSrc: '/assets/icons/profile-modal/pallette.webp',
          showClock: true,
        },
        externalFooter: {
          actions: [
            {
              key: 'apply',
              label: 'Apply',
              buttonIcon: 'A',
              variant: 'green',
              tooltip: 'Apply theme changes',
              onClick: () => {
                if (themePageRef.current) {
                  const wasDirty = themePageRef.current.isDirty;
                  themePageRef.current.apply();
                  playSound('navigation');

                  if (wasDirty) {
                    unlock('fresh-coat');
                    showToast(createSystemToast('Theme settings applied', 'success'));
                  } else {
                    showToast(createSystemToast('No changes to apply', 'info'));
                  }
                }
              },
            },
            backAction,
          ],
        },
      },
    ];
  }, [profile, avatars, selectedAvatar, handleAvatarSelect, handleSave, handleLogout, handleClose, playSound, showToast, unlock]);

  // Handle page change - track active page ID
  const handlePageChange = useCallback((pageId: string) => {
    setActivePageId(pageId);
  }, []);

  // Derive active page's external header/footer from current state
  const activePage = bladePages.find(p => p.id === activePageId);
  const activeExternalHeader = activePage?.externalHeader || null;
  const activeExternalFooter = activePage?.externalFooter || null;

  if (!mounted || !isOpen || !profile) {
    return null;
  }

  // Helper to get button variant class
  const getButtonVariantClass = (variant?: 'green' | 'red' | 'blue' | 'yellow') => {
    switch (variant) {
      case 'red': return styles.buttonIconRed;
      case 'blue': return styles.buttonIconBlue;
      case 'yellow': return styles.buttonIconYellow;
      default: return styles.buttonIconGreen;
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={backdropRef}
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
          {/* Dynamic External Header */}
          <div className={styles.externalHeader}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeExternalHeader?.title || 'default'}
                className={styles.headerLeft}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {activeExternalHeader?.iconSrc ? (
                  <Image
                    src={activeExternalHeader.iconSrc}
                    alt=""
                    width={24}
                    height={24}
                    className={styles.headerImageIcon}
                  />
                ) : activeExternalHeader?.icon ? (
                  <span className={styles.headerIconWrapper}>
                    {activeExternalHeader.icon}
                  </span>
                ) : null}
                <h1 id="modal-title" className={styles.title}>
                  {activeExternalHeader?.title || 'Xbox Dashboard'}
                </h1>
              </motion.div>
            </AnimatePresence>
            {(activeExternalHeader?.showClock !== false) && (
              <Clock className={styles.time} />
            )}
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
              onPageChange={handlePageChange}
            />
          </motion.div>

          {/* Dynamic External Footer */}
          <div className={styles.externalFooter}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeExternalFooter?.actions.map(a => a.key).join('-') || 'default'}
                className={styles.footerActions}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {activeExternalFooter?.actions.map((action) => (
                  <Tooltip
                    key={action.key}
                    content={action.tooltip || action.label}
                    position="top"
                    disabled={!action.tooltip}
                  >
                    <button
                      className={styles.controlButton}
                      onClick={action.onClick}
                      disabled={action.disabled}
                      onMouseEnter={() => playSound('owawa')}
                    >
                      <span className={`${styles.buttonIcon} ${getButtonVariantClass(action.variant)}`}>
                        {action.buttonIcon}
                      </span>
                      <span className={styles.buttonText}>{action.label}</span>
                    </button>
                  </Tooltip>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default ProfileModal;
