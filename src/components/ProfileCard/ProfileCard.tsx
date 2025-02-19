import styles from './ProfileCard.module.css';
import Image from 'next/image';
import { useVolume } from '../../context/VolumeContext';
import { useShepherdTour } from '../../context/ShepherdTourContext';

interface ProfileCardProps {
  name: string;
  level: string;
  gamerscore: number;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, level, gamerscore }) => {
  const { volume } = useVolume();
  const { startTour } = useShepherdTour();

  const playSelectSound = () => {
    const audio = new Audio('/assets/audio/ps2_zing.wav');
    audio.volume = volume;
    audio.play();
  };

  const playHoverSound = () => {
    const audio = new Audio('/assets/audio/ps2_owawa.wav');
    audio.volume = volume;
    audio.play();
  };

  return (
      <div 
        className={styles.card}
        onClick={() => {
          playSelectSound();
          startTour();
        }}
        onMouseEnter={playHoverSound}
      >
        <div className={styles.infoContainer}>
          <h2 className={styles.name}>{name}</h2>
          <p className={styles.gamerscore}>
            {gamerscore}
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
              src="/assets/avatars/2000c.png"
              alt="Profile Icon"
              width={64}
              height={64}
              className={styles.profileIcon}
            />
          </div>
        </div>
      </div>
  );
};

export default ProfileCard;