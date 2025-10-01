'use client';

import React, { JSX, useState, useEffect, memo, useCallback, useMemo } from 'react';
import ResponsiveCardGrid from './ResponsiveCardGrid/ResponsiveCardGrid';
import XboxCard from '../XboxCard/card/XboxCard';
import styles from './XboxDashboard.module.css';
import { useAudioManager } from '../../hooks/useAudioManager';
import { useVolume } from '../../context/VolumeContext';
import { useCardNavigation } from '../../hooks/useCardNavigation';
import { useIsMobile } from '../../utils/responsiveUtils';

interface XboxDashboardProps {
  activeIndex: number;
  data: {
    home: { route: string; title: string; iconUrl?: string; images?: string[]}[];
    misc: { route: string; title: string; iconUrl?: string; images?: string[]}[];
    gallery: { route: string; title: string; iconUrl?: string; images?: string[]}[];
    credits: { route: string; title: string; iconUrl?: string; images?: string[]}[];
  };
}

const XboxDashboard: React.FC<XboxDashboardProps> = memo(({ activeIndex, data }) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const { playSound } = useAudioManager();
  const { volume } = useVolume();
  const isMobile = useIsMobile(768);

  const cardsData = useMemo(() => [
    data.home,
    data.misc,
    data.gallery,
    data.credits,
  ][activeIndex], [data, activeIndex]);

  const sectionNames = ['home', 'misc', 'gallery', 'credits'];

  // Card navigation hook
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

  // Initial animation for the cards (desktop only)
  useEffect(() => {
    const section = document.querySelector(`.${styles.section}`);
    const cards = section?.querySelectorAll(`.${styles.card}`);

    if (!cards) return;

    let cumulativeTranslation = 0;
    let decrement = 250;

    const playUnfoldSound = () => {
      if (isAudioPlaying) return;
      setIsAudioPlaying(true);
      playSound('unfold');
      setTimeout(() => setIsAudioPlaying(false), 600);
    };

    playUnfoldSound();

    cards.forEach((card) => {
      const cardElement = card as HTMLElement;
      cardElement.style.transition = 'none';
      cardElement.style.opacity = '0';
      cardElement.style.transform = `translateX(-100px) scale(0.9)`;
    });

    const animationTimeouts: NodeJS.Timeout[] = [];
    cards.forEach((card, index) => {
      const cardElement = card as HTMLElement;

      const timeout = setTimeout(() => {
        cardElement.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        cardElement.style.opacity = '1';
        cardElement.style.transform = `translateX(${cumulativeTranslation}px) scale(${1 - index * 0.1})`;
        cardElement.style.zIndex = `${cards.length - index}`;

        cumulativeTranslation += decrement;
        decrement *= 0.78;
      }, index * 80);

      animationTimeouts.push(timeout);
    });

    return () => {
      animationTimeouts.forEach((timeout) => clearTimeout(timeout));
      cards.forEach((card) => {
        const cardElement = card as HTMLElement;
        cardElement.style.transition = 'none';
      });
    };
  }, [activeIndex, playSound]);



  const componentMapping: Record<number, JSX.Element> = {
    0: (
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
            {data.home.map((card, index) => (
              <div className={styles.card} key={`home-${index}-${card.title}`}>
                <XboxCard 
                  key={`home-${index}-${card.title}`}
                  title={card.title} 
                  iconUrl={card.iconUrl}
                  route={card.route}
                  images={card.images}
                />
              </div>
            ))}
          </div>
          <div className={styles.position}>
            {`${currentCardIndex + 1} of ${data.home.length}`}
          </div>
        </div>
        <div className={styles.rightArrowContainer}>
          <button
            className={styles.rightArrow}
            onClick={navigateRight}
            disabled={!canNavigateRight}
            onMouseEnter={playHoverSound}>
          <img
              src="./assets/icons/buttonRight.webp"
              alt="Right Arrow"
              className={styles.rightArrow}
            />
          </button>
        </div>
      </div>
    ),
    1: (
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
            {data.misc.map((card, index) => (
              <div className={styles.card} key={`misc-${index}-${card.title}`}>
                <XboxCard 
                  key={`misc-${index}-${card.title}`}
                  title={card.title} 
                  iconUrl={card.iconUrl}
                  route={card.route}
                  images={card.images}
                />
              </div>
            ))}
          </div>
          <div className={styles.position}>
            {`${currentCardIndex + 1} of ${data.misc.length}`}
          </div>
        </div>
        <div className={styles.rightArrowContainer}>
        <button
            className={styles.rightArrow}
            onClick={navigateRight}
            disabled={!canNavigateRight}
            onMouseEnter={playHoverSound}>
          <img
              src="./assets/icons/buttonRight.webp"
              alt="Right Arrow"
              className={styles.rightArrow}
            />
          </button>
        </div>
      </div>
    ),
    2: (
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
            {data.gallery.map((card, index) => (
              <div className={styles.card} key={`gallery-${index}-${card.title}`}>
                <XboxCard 
                  key={`gallery-${index}-${card.title}`}
                  title={card.title} 
                  iconUrl={card.iconUrl}
                  route={card.route}
                  images={card.images}
                />
              </div>
            ))}
          </div>
          <div className={styles.position}>
            {`${currentCardIndex + 1} of ${data.gallery.length}`}
          </div>
        </div>
        <div className={styles.rightArrowContainer}>
        <button
            className={styles.rightArrow}
            onClick={navigateRight}
            disabled={!canNavigateRight}
            onMouseEnter={playHoverSound}>
          <img
              src="./assets/icons/buttonRight.webp"
              alt="Right Arrow"
              className={styles.rightArrow}
            />
          </button>
        </div>
      </div>
    ),
    3: (
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
            {data.credits.map((card, index) => (
              <div className={styles.card} key={`credits-${index}-${card.title}`}>
                <XboxCard 
                  key={`credits-${index}-${card.title}`}
                  title={card.title} 
                  iconUrl={card.iconUrl}
                  route={card.route}
                  images={card.images}
                />
              </div>
            ))}
          </div>
          <div className={styles.position}>
            {`${currentCardIndex + 1} of ${data.credits.length}`}
          </div>
        </div>
        <div className={styles.rightArrowContainer}>
          <button
            className={styles.rightArrow}
            onClick={navigateRight}
            disabled={!canNavigateRight}
            onMouseEnter={playHoverSound}>
          <img
              src="./assets/icons/buttonRight.webp"
              alt="Right Arrow"
              className={styles.rightArrow}
            />
          </button>
        </div>
      </div>
    ),
  };

  // If mobile, render ResponsiveCardGrid
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

  return componentMapping[activeIndex] || <div>No content available</div>;
});

XboxDashboard.displayName = 'XboxDashboard';

export default XboxDashboard;