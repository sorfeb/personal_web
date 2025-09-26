'use client';

import React, { useEffect, useState } from 'react';
import { useIsMobile } from '../../../utils/responsiveUtils';
import XboxCard from '../../XboxCard/card/XboxCard';
import styles from './ResponsiveCardGrid.module.css';

interface ResponsiveCardGridProps {
  cards: { route: string; title: string; iconUrl?: string; images?: string[] }[];
  sectionName: string;
  currentCardIndex: number;
  onCardIndexChange: (index: number) => void;
  playHoverSound: () => void;
  playLeftSound: () => void;
  playRightSound: () => void;
}

const ResponsiveCardGrid: React.FC<ResponsiveCardGridProps> = ({
  cards,
  sectionName,
  currentCardIndex,
  onCardIndexChange,
  playHoverSound,
  playLeftSound,
  playRightSound,
}) => {
  const isMobile = useIsMobile(768);

  const handleLeftArrowClick = () => {
    playLeftSound();
    if (currentCardIndex <= 0) return;

    if (isMobile) {
      onCardIndexChange(currentCardIndex - 1);
      return;
    }

    // Desktop horizontal scroll logic
    const section = document.querySelector(`.${styles.section}`);
    const cardElements = section?.querySelectorAll(`.${styles.card}`);

    if (!cardElements) return;

    // ...existing desktop animation logic...
    const currentCard = cardElements[currentCardIndex] as HTMLElement;
    currentCard.style.transition = 'transform 0.5s ease';
    currentCard.style.transform = `translateX(250px) scale(0.9)`;
    currentCard.style.zIndex = `${cardElements.length - currentCardIndex}`;

    let cumulativeTranslation = 250 + 250 * 0.78;
    let decrement = 250 * 0.78 * 0.78;

    for (let i = currentCardIndex + 1; i < cardElements.length; i++) {
      const card = cardElements[i] as HTMLElement;
      card.style.transition = 'transform 0.5s ease';
      card.style.transform = `translateX(${cumulativeTranslation}px) scale(${1 - (i - currentCardIndex) * 0.1})`;
      card.style.zIndex = `${cardElements.length - i}`;
      cumulativeTranslation += decrement;
      decrement *= 0.78;
    }

    const previousCard = cardElements[currentCardIndex - 1] as HTMLElement;
    previousCard.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    previousCard.style.opacity = '1';
    previousCard.style.transform = `translateX(0) scale(1)`;
    previousCard.style.zIndex = `${cardElements.length - (currentCardIndex - 1)}`;

    setTimeout(() => {
      onCardIndexChange(currentCardIndex - 1);
    }, 100);
  };

  const handleRightArrowClick = () => {
    playRightSound();
    if (currentCardIndex >= cards.length - 1) return;

    if (isMobile) {
      onCardIndexChange(currentCardIndex + 1);
      return;
    }

    // Desktop horizontal scroll logic
    const section = document.querySelector(`.${styles.section}`);
    const cardElements = section?.querySelectorAll(`.${styles.card}`);

    if (!cardElements) return;

    const currentCard = cardElements[currentCardIndex] as HTMLElement;
    currentCard.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    currentCard.style.transform = `translateX(-100%)`;
    currentCard.style.opacity = '0';

    let cumulativeTranslation = 0;
    let decrement = 250;

    for (let i = currentCardIndex + 1; i < cardElements.length; i++) {
      const card = cardElements[i] as HTMLElement;
      card.style.transition = 'transform 0.5s ease';
      card.style.transform = `translateX(${cumulativeTranslation}px) scale(${1 - (i - currentCardIndex - 1) * 0.1})`;
      card.style.zIndex = `${cardElements.length - i}`;
      cumulativeTranslation += decrement;
      decrement *= 0.78;
    }

    setTimeout(() => {
      onCardIndexChange(currentCardIndex + 1);
    }, 100);
  };

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
          onClick={handleLeftArrowClick}
          disabled={currentCardIndex === 0}
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
          onClick={handleRightArrowClick}
          disabled={currentCardIndex === cards.length - 1}
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
