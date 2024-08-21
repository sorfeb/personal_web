import React from 'react';
import styles from './ProfileCard.module.css';

interface ProfileCardProps {
    name: string;
    level: string;
  }

const ProfileCard: React.FC = () => {
  return (
    <div className={styles.dashboard}>
      {cards.map((card, index) => (
        <ProfileCard key={index} title={card.title} iconUrl={card.iconUrl} />
      ))}
    </div>
  );
};

export default ProfileCard;