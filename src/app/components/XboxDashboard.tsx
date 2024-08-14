import React from 'react';
import XboxCard from './XboxCard';
import styles from './XboxDashboard.module.css';

const XboxDashboard: React.FC = () => {
  const cards = [
    { title: "Games", iconUrl: "/path/to/games-icon.png" },
    { title: "Store", iconUrl: "/path/to/store-icon.png" },
    { title: "Community", iconUrl: "/path/to/community-icon.png" },
    { title: "Profile", iconUrl: "/path/to/profile-icon.png" },
    { title: "Settings", iconUrl: "/path/to/settings-icon.png" },
    { title: "Media", iconUrl: "/path/to/media-icon.png" },
  ];

  return (
    <div className={styles.dashboard}>
      {cards.map((card, index) => (
        <XboxCard key={index} title={card.title} iconUrl={card.iconUrl} />
      ))}
    </div>
  );
};

export default XboxDashboard;