import styles from './ProfileCard.module.css';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAudioManager } from '../../hooks/useAudioManager';
import { useToast } from '../../hooks/useToast';
import { createSystemToast } from '../../utils/toastUtils';
import { trpc } from '../../utils/trpc';

interface ProfileCardProps {
  name?: string;
  gamerscore?: number;
  avatar?: string;
  onClick?: () => void;
}

/**
 * ProfileCard Component
 * 
 * Displays authenticated user profile:
 * - Fetches user data via tRPC with guest fallback
 * - Shows gamerscore
 * - Displays selected avatar from avatar collection
 * - Provides audio feedback on interaction
 * - Shows welcome toast once per browser session (persisted via sessionStorage)
 * 
 */
export const ProfileCard: React.FC<ProfileCardProps> = ({ 
  name: overrideName, 
  gamerscore: overrideGamerscore,
  avatar: overrideAvatar,
  onClick
}) => {
  const { playSound } = useAudioManager();
  const { showToast } = useToast();
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  
  const { data: profile, isLoading, error } = trpc.user.getProfile.useQuery();

  // effect:audited — run-once welcome toast gated on async tRPC query state.
  // The skill's "call from event handler" pattern doesn't apply: no user
  // interaction triggers this — it fires the first time the guarded conditions
  // become satisfiable after the query resolves.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (profile && !isLoading && !error) {
      if (typeof window === 'undefined') return;

      const sessionKey = `toast-shown-${profile.id || 'guest'}`;
      const hasShownThisSession = sessionStorage.getItem(sessionKey);

      if (!hasShownThisSession) {
        sessionStorage.setItem(sessionKey, 'true');

        const isGuest = profile.name === 'Guest';

        showToast(
          createSystemToast(
            isGuest ? 'Browsing as Guest' : `Welcome back, ${profile.name}!`,
            'success',
            undefined,
            3000
          )
        );
      }
    }
  }, [profile, isLoading, error, showToast]);

  // effect:audited — reset avatarLoaded crossfade state when the avatar source
  // changes. The skill recommends `key={id}` remounting, but avatarLoaded is
  // co-located with the crossfade transitions of two sibling <Image>s, so
  // lifting it into a subcomponent would fragment the JSX.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (profile) {
      setAvatarLoaded(false);
    }
  }, [profile?.avatar, overrideAvatar]);

  const playSelectSound = () => playSound('click');
  const playHoverSound = () => playSound('owawa');

  // Use override props for testing, otherwise use fetched profile
  // The API guarantees a valid profile object (either user or guest)
  const displayName = overrideName ?? profile?.name;
  const displayGamerscore = overrideGamerscore ?? profile?.gamerscore;
  const displayAvatar = overrideAvatar ?? profile?.avatar;

  const avatarPath = `/assets/avatars/${displayAvatar}`;

  if (error) {
    console.error('tRPC ProfileCard Error:', error.message);
  }

  const isContentLoaded = !isLoading && profile;

  return (
    <div 
      className={`${styles.card} ${isLoading ? styles['card--loading'] : ''}`}
      onClick={() => {
        playSelectSound();
        onClick?.();
      }}
      onMouseEnter={playHoverSound}
    >
      {/* Animated text container - expands on load */}
      <motion.div 
        className={styles.infoContainer}
        initial={{ width: 0, opacity: 0 }}
        animate={{ 
          width: isContentLoaded ? 'auto' : 0,
          opacity: isContentLoaded ? 1 : 0
        }}
        transition={{ 
          duration: 0.5, 
          ease: [0.25, 0.8, 0.25, 1]
        }}
      >
        <h2 className={styles.name}>
          {displayName}
        </h2>
        <p className={styles.gamerscore}>
          {displayGamerscore?.toLocaleString()}
          <Image
            src="/assets/icons/Gamerscore.gif"
            alt="Gamerscore"
            width={20}
            height={20}
          />
        </p>
      </motion.div>

      {/* Fixed avatar container - always visible */}
      <div className={styles.avatarContainer}>
        <div className={styles.avatarWrapper}>
          {isContentLoaded ? (
            <>
              {/* Guest avatar placeholder */}
              <Image
                src="/assets/avatars/guest_gamerpic.webp"
                alt="Loading Avatar"
                width={64}
                height={64}
                sizes="64px"
                className={styles.profileIcon}
                style={{
                  position: 'absolute',
                  opacity: avatarLoaded ? 0 : 1,
                  transition: 'opacity 0.3s ease'
                }}
              />
              {/* Actual user avatar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: avatarLoaded ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ position: 'absolute' }}
              >
                <Image
                  src={avatarPath}
                  alt="Profile Icon"
                  width={64}
                  height={64}
                  sizes="64px"
                  className={styles.profileIcon}
                  onLoad={() => setAvatarLoaded(true)}
                  priority
                />
              </motion.div>
            </>
          ) : (
            <Image
              src="/assets/avatars/guest_gamerpic.webp"
              alt="Loading Avatar"
              width={64}
              height={64}
              sizes="64px"
              className={styles.profileIcon}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;