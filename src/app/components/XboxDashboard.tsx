import React from 'react';
import XboxCard from './XboxCard';
import styles from './XboxDashboard.module.css';

interface XboxDashboardProps {
  cards: { title: string; iconUrl: string }[];
}

const XboxDashboard: React.FC<XboxDashboardProps> = ({ cards }) => {
  return (
    <div className={styles.dashboard}>
      {cards.map((card, index) => (
        <XboxCard key={index} title={card.title} iconUrl={card.iconUrl} />
      ))}
    </div>
  );
};

export default XboxDashboard;