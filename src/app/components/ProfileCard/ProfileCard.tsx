import React from 'react';
import styles from './ProfileCard.module.css';
import Image from 'next/image';

interface ProfileCardProps {
  name: string;
  level: string;
  gamerscore: number;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, level, gamerscore }) => {
  return (
      <div className={styles.card}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatarWrapper}>
            <Image 
              src="/assets/avatars/Radiohead%20-%20In%20Rainbows%20(Evangelion).png"
              alt="Profile Icon"
              width={64}
              height={64}
              className={styles.profileIcon}
            />
            <div className={styles.shine}></div>
          </div>
        </div>
        <div className={styles.infoContainer}>
          <h2 className={styles.name}>{name}</h2>
          <p className={styles.level}>{level}</p>
          <p className={styles.gamerscore}>
            <Image
              src="/assets/icons/gamerscore-icon.png"
              alt="Gamerscore"
              width={16}
              height={16}
            />
            {gamerscore}
          </p>
        </div>
      </div>
  );
};

export default ProfileCard;