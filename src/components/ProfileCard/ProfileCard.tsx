import styles from './ProfileCard.module.css';
import Image from 'next/image';
import { useAudioManager } from '../../hooks/useAudioManager';
import { trpc } from '../../utils/trpc';

interface ProfileCardProps {
  // Optional props for override in development/testing
  name?: string;
  gamerscore?: number;
  avatar?: string;
}

/**
 * ProfileCard Component - Xbox 360 Dashboard Style
 * 
 * Displays authenticated user profile with Xbox aesthetic:
 * - Fetches user data via tRPC with guest fallback
 * - Shows gamerscore with Xbox styling
 * - Displays selected avatar from avatar collection
 * - Provides audio feedback on interaction
 * 
 * Guest Mode: Shows "Guest" with default avatar and 0 gamerscore
 */
export const ProfileCard: React.FC<ProfileCardProps> = ({ 
  name: overrideName, 
  gamerscore: overrideGamerscore,
  avatar: overrideAvatar 
}) => {
  const { playSound } = useAudioManager();
  
  const { data: profile, isLoading, error } = trpc.user.getProfile.useQuery();

  const playSelectSound = () => playSound('click');
  const playHoverSound = () => playSound('owawa');

  // Use override props for testing, otherwise use fetched profile
  const displayName = overrideName ?? profile?.name ?? 'Guest';
  const displayGamerscore = overrideGamerscore ?? profile?.gamerscore ?? 0;
  const displayAvatar = overrideAvatar ?? profile?.avatar ?? 'guest_gamerpic.svg';

  const avatarPath = `/assets/avatars/${displayAvatar}`;

  if (profile?.error) {
    console.warn('ProfileCard Error:', profile.error);
  }

  if (error) {
    console.error('tRPC ProfileCard Error:', error.message);
  }

  if (isLoading) {
    return (
      <div className={styles.card}>
        <div className={styles.infoContainer}>
          <h2 className={styles.name}>Loading...</h2>
          <p className={styles.gamerscore}>
            --
            <Image
              src="/assets/icons/Gamerscore.gif"
              alt="Gamerscore"
              width={20}
              height={20}
            />
          </p>
        </div>
        <div className={styles.avatarContainer}>
          <div className={styles.avatarWrapper}>
            <div className={styles.profileIcon} />
          </div>
        </div>
      </div>
    );
  }

  return (
      <div 
        className={styles.card}
        onClick={() => {
          playSelectSound();
        }}
        onMouseEnter={playHoverSound}
      >
        <div className={styles.infoContainer}>
          <h2 className={styles.name}>{displayName}</h2>
          <p className={styles.gamerscore}>
            {displayGamerscore.toLocaleString()}
            <Image
              src="/assets/icons/Gamerscore.gif"
              alt="Gamerscore"
              width={20}
              height={20}
            />
          </p>
        </div>
        <div className={styles.avatarContainer}>
          <div className={styles.avatarWrapper}>
            <Image 
              src={avatarPath}
              alt="Profile Icon"
              width={64}
              height={64}
              className={styles.profileIcon}
              priority
            />
          </div>
        </div>
      </div>
  );
};

export default ProfileCard;