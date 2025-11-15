'use client';

import React, { memo, useCallback, useMemo } from 'react';
import ResponsiveCardGrid from './ResponsiveCardGrid/ResponsiveCardGrid';
import XboxCard from '../XboxCard/card/XboxCard';
import styles from './XboxDashboard.module.css';
import { useAudioManager } from '../../hooks/useAudioManager';
import { useCardNavigation } from '../../hooks/useCardNavigation';
import { useInitialCardAnimation } from '../../hooks/useInitialCardAnimation';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { useIsMobile } from '../../utils/responsiveUtils';

interface XboxDashboardProps {
  activeIndex: number;
  data: {
    [key: string]: { route: string; title: string; iconUrl?: string; images?: string[]}[];
  };
}

const XboxDashboard: React.FC<XboxDashboardProps> = memo(({ activeIndex, data }) => {
  const { playSound } = useAudioManager();
  const isMobile = useIsMobile(768);

  const sectionNames = useMemo(() => Object.keys(data) as Array<keyof typeof data>, [data]);
  const sectionsData = useMemo(() => Object.values(data), [data]);

  const cardsData = useMemo(() => sectionsData[activeIndex], [sectionsData, activeIndex]);

  const sectionRef = useInitialCardAnimation({
    activeIndex,
    isMobile,
    cardSelector: `.${styles.card}`,
  });

  const {
    currentCardIndex,
    navigateLeft,
    navigateRight,
    canNavigateLeft,
    canNavigateRight,
  } = useCardNavigation({
    totalCards: cardsData.length,
    activeIndex,
    sectionSelector: `.${styles.section}`,
    cardSelector: `.${styles.card}`,
  });

  const playHoverSound = () => playSound('ting');

  // Keyboard navigation (ArrowLeft/ArrowRight)
  useKeyboardNavigation({
    onLeft: navigateLeft,
    onRight: navigateRight,
    canGoLeft: canNavigateLeft,
    canGoRight: canNavigateRight,
    enabled: !isMobile,
  });

  const renderDesktopDashboard = () => (
    <section 
      className={styles.dashboardContainer}
      aria-label="Xbox dashboard card navigation"
    >
      {/* Left Navigation Arrow */}
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

      {/* Cards Section */}
      <div className={styles.sectionContainer}>
        <div ref={sectionRef} className={styles.section}>
          {cardsData.map((card, index) => (
            <div className={styles.card} key={`${sectionNames[activeIndex]}-${index}-${card.title}`}>
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
          {`${currentCardIndex + 1} of ${cardsData.length}`}
        </div>
      </div>

      {/* Right Navigation Arrow */}
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
    </section>
  );

  if (isMobile) {
    return (
      <ResponsiveCardGrid
        cards={cardsData}
        sectionName={sectionNames[activeIndex]}
        activeIndex={activeIndex}
        playHoverSound={playHoverSound}
      />
    );
  }

  return renderDesktopDashboard();
});

XboxDashboard.displayName = 'XboxDashboard';

export default XboxDashboard;