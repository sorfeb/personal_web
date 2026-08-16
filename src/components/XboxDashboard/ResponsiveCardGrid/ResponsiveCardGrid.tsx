'use client';

import React from 'react';
import XboxCard from '../../XboxCard/card/XboxCard';
import styles from './ResponsiveCardGrid.module.css';
import { DASHBOARD_PANEL_ID } from '../../../constants/dashboardNavigation';

interface ResponsiveCardGridProps {
  cards: { route: string; title: string; iconUrl?: string; images?: string[] }[];
  sectionName: string;
  /** Id of the blade tab this grid is the panel for (WAI-ARIA tabs relationship). */
  labelledBy: string;
}

/**
 * Mobile-only grid layout for Xbox cards.
 * Displays all cards in a scrollable grid - no navigation arrows needed
 * since users can see and scroll through all cards at once.
 */
const ResponsiveCardGrid: React.FC<ResponsiveCardGridProps> = ({
  cards,
  sectionName,
  labelledBy,
}) => {
  return (
    <div
      className={styles.mobileContainer}
      id={DASHBOARD_PANEL_ID}
      role="tabpanel"
      aria-labelledby={labelledBy}
    >
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
