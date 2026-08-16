'use client';

import React, { memo, useMemo, useRef } from 'react';
import ResponsiveCardGrid from './ResponsiveCardGrid/ResponsiveCardGrid';
import XboxCard from '../XboxCard/card/XboxCard';
import styles from './XboxDashboard.module.css';
import { useAudioManager } from '../../hooks/useAudioManager';
import { useCardNavigation } from '../../hooks/useCardNavigation';
import { useInitialCardAnimation } from '../../hooks/useInitialCardAnimation';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { useGamepadScope } from '../../hooks/useGamepadScope';
import { useIsMobile } from '../../utils/responsiveUtils';
import {
  bladeTabId,
  DASHBOARD_PANEL_ID,
  DASHBOARD_SCOPE_ID,
} from '../../constants/dashboardNavigation';

interface XboxDashboardProps {
  activeIndex: number;
  data: {
    [key: string]: { route: string; title: string; iconUrl?: string; images?: string[]}[];
  };
  /**
   * Suspend controller navigation — passed the same value the blade menu gets,
   * so both halves of the dashboard scope go quiet together while a modal is
   * open. Phase 3 replaces this prop with a real modal scope pushed on top of
   * the stack, which silences everything beneath it without being told.
   */
  disabled?: boolean;
}

const XboxDashboard: React.FC<XboxDashboardProps> = memo(({ activeIndex, data, disabled = false }) => {
  const { playSound } = useAudioManager();
  const isMobile = useIsMobile(768);

  const sectionNames = useMemo(() => Object.keys(data) as Array<keyof typeof data>, [data]);
  const sectionsData = useMemo(() => Object.values(data), [data]);

  const cardsData = useMemo(() => sectionsData[activeIndex], [sectionsData, activeIndex]);

  /**
   * The card elements themselves. Both animation hooks read this array rather
   * than running `document.querySelector` on a CSS-module class, so they are
   * guaranteed to be moving the same nodes this component rendered.
   */
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useInitialCardAnimation({
    activeIndex,
    isMobile,
    cardRefs,
    cardCount: cardsData.length,
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
    cardRefs,
  });

  const playHoverSound = () => playSound('ting');

  // Keyboard navigation (ArrowLeft/ArrowRight). Phase 3 migrates this onto the
  // same scope stack the gamepad already uses, so both share one router.
  useKeyboardNavigation({
    onLeft: navigateLeft,
    onRight: navigateRight,
    canGoLeft: canNavigateLeft,
    canGoRight: canNavigateRight,
    enabled: !isMobile,
  });

  // The card stack's half of the dashboard scope. `useCardNavigation` already
  // refuses moves at the ends and mid-transition, so no boundary check here.
  useGamepadScope({
    id: DASHBOARD_SCOPE_ID,
    enabled: !isMobile && !disabled,
    handlers: {
      left: navigateLeft,
      right: navigateRight,
      pageLeft: navigateLeft,
      pageRight: navigateRight,
    },
  });

  const renderDesktopDashboard = () => (
    <section
      className={styles.dashboardContainer}
      id={DASHBOARD_PANEL_ID}
      role="tabpanel"
      aria-labelledby={bladeTabId(activeIndex)}
    >
      {/* Cards Section */}
      <div className={styles.sectionContainer}>
        <div className={styles.section}>
          {cardsData.map((card, index) => (
            <div
              className={styles.card}
              key={`${sectionNames[activeIndex]}-${index}-${card.title}`}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
            >
              <XboxCard
                title={card.title}
                iconUrl={card.iconUrl}
                route={card.route}
                images={card.images}
                offscreen={index < currentCardIndex}
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
        labelledBy={bladeTabId(activeIndex)}
      />
    );
  }

  return renderDesktopDashboard();
});

XboxDashboard.displayName = 'XboxDashboard';

export default XboxDashboard;