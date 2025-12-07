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
        <div className={styles.positionContainer}>
          <button
            className={`${styles.navArrow} ${canNavigateLeft ? '' : styles.disabled}`}
            onClick={navigateLeft}
            disabled={!canNavigateLeft}
            onMouseEnter={playHoverSound}
            aria-label="Navigate left"
          >
            &lt;
          </button>
          <span className={styles.position}>
            {`${currentCardIndex + 1} of ${cardsData.length}`}
          </span>
          <button
            className={`${styles.navArrow} ${canNavigateRight ? '' : styles.disabled}`}
            onClick={navigateRight}
            disabled={!canNavigateRight}
            onMouseEnter={playHoverSound}
            aria-label="Navigate right"
          >
            &gt;
          </button>
        </div>
      </div>
    </section>
  );

  if (isMobile) {
    return (
      <ResponsiveCardGrid
        cards={cardsData}
        sectionName={String(sectionNames[activeIndex])}
      />
    );
  }

  return renderDesktopDashboard();
});

XboxDashboard.displayName = 'XboxDashboard';

export default XboxDashboard;