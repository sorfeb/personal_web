'use client';

import React from 'react';
import { useIsMobile } from '../../../utils/responsiveUtils';
import { useCardNavigation } from '../../../hooks/useCardNavigation';
import XboxCard from '../../XboxCard/card/XboxCard';
import styles from './ResponsiveCardGrid.module.css';

interface ResponsiveCardGridProps {
  cards: { route: string; title: string; iconUrl?: string; images?: string[] }[];
  sectionName: string;
  activeIndex: number;
  playHoverSound: () => void;
}

const ResponsiveCardGrid: React.FC<ResponsiveCardGridProps> = ({
  cards,
  sectionName,
  activeIndex,
  playHoverSound,
}) => {
  const isMobile = useIsMobile(768);
  
  // Use the same navigation hook as XboxDashboard
  const {
    currentCardIndex,
    navigateLeft,
    navigateRight,
    canNavigateLeft,
    canNavigateRight,
  } = useCardNavigation({
    totalCards: cards.length,
    activeIndex,
    sectionSelector: `.${styles.section}`,
    cardSelector: `.${styles.card}`,
  });

  if (isMobile) {
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
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.leftArrowContainer}>
        <button
          className={styles.leftArrow}
          onClick={navigateLeft}
          disabled={!canNavigateLeft}
          onMouseEnter={playHoverSound}
        >
          <img
            src="./assets/icons/buttonLeft.webp"
            alt="Left Arrow"
            className={styles.leftArrow}
          />
        </button>
      </div>
      <div className={styles.sectionContainer}>
        <div className={styles.section}>
          {cards.map((card, index) => (
            <div className={styles.card} key={`${sectionName}-${index}-${card.title}`}>
              <XboxCard
                title={card.title}
                iconUrl={card.iconUrl}
                route={card.route}
                images={card.images}
              />
            </div>
          ))}
        </div>
        <div className={styles.position}>
          {`${currentCardIndex + 1} of ${cards.length}`}
        </div>
      </div>
      <div className={styles.rightArrowContainer}>
        <button
          className={styles.rightArrow}
          onClick={navigateRight}
          disabled={!canNavigateRight}
          onMouseEnter={playHoverSound}
        >
          <img
            src="./assets/icons/buttonRight.webp"
            alt="Right Arrow"
            className={styles.rightArrow}
          />
        </button>
      </div>
    </div>
  );
};

export default ResponsiveCardGrid;
