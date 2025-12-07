'use client';

import React from 'react';
import XboxCard from '../../XboxCard/card/XboxCard';
import styles from './ResponsiveCardGrid.module.css';

interface ResponsiveCardGridProps {
  cards: { route: string; title: string; iconUrl?: string; images?: string[] }[];
  sectionName: string;
}

/**
 * Mobile-only grid layout for Xbox cards.
 * Displays all cards in a scrollable grid - no navigation arrows needed
 * since users can see and scroll through all cards at once.
 */
const ResponsiveCardGrid: React.FC<ResponsiveCardGridProps> = ({
  cards,
  sectionName,
}) => {
  return (
    <div className={styles.mobileContainer}>
      <div className={styles.mobileGrid}>
        {cards.map((card, index) => (
          <div
            key={`${sectionName}-${index}-${card.title}`}
            className={styles.mobileCard}
          >
            <XboxCard
              title={card.title}
              iconUrl={card.iconUrl}
              route={card.route}
              images={card.images}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResponsiveCardGrid;
