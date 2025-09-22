import styles from './ProfileCard.module.css';
import Image from 'next/image';
import { useAudioManager } from '../../hooks/useAudioManager';
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
 * 
 */
export const ProfileCard: React.FC<ProfileCardProps> = ({ 
  name: overrideName, 
  gamerscore: overrideGamerscore,
  avatar: overrideAvatar,
  onClick
}) => {
  const { playSound } = useAudioManager();
  
  const { data: profile, isLoading, error } = trpc.user.getProfile.useQuery();

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

  if (isLoading || !profile) {
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
          onClick?.();
        }}
        onMouseEnter={playHoverSound}
      >
        <div className={styles.infoContainer}>
          <h2 className={styles.name}>{displayName}</h2>
          <p className={styles.gamerscore}>
            {displayGamerscore?.toLocaleString()}
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