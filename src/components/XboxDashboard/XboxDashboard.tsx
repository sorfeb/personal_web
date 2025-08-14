'use client';

import React, { JSX, useEffect, useState } from 'react';
import ResponsiveCardGrid from './ResponsiveCardGrid/ResponsiveCardGrid';
import XboxCard from '../XboxCard/card/XboxCard';
import styles from './XboxDashboard.module.css';
import { useAudioManager } from '../../hooks/useAudioManager';
import { useVolume } from '../../context/VolumeContext';

interface XboxDashboardProps {
  activeIndex: number;
  data: {
    home: { route: string; title: string; iconUrl?: string; images?: string[]}[];
    misc: { route: string; title: string; iconUrl?: string; images?: string[]}[];
    gallery: { route: string; title: string; iconUrl?: string; images?: string[]}[];
    credits: { route: string; title: string; iconUrl?: string; images?: string[]}[];
  };
}

const XboxDashboard: React.FC<XboxDashboardProps> = ({ activeIndex, data }) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { playSound } = useAudioManager();
  const { volume } = useVolume();

  const cardsData = [
    data.home,
    data.misc,
    data.gallery,
    data.credits,
  ][activeIndex];

  const sectionNames = ['home', 'misc', 'gallery', 'credits'];

  const playLeftSound = () => playSound('panelLeft');
  const playRightSound = () => playSound('panel');
  const playHoverSound = () => playSound('ting');

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset currentCardIndex when activeIndex changes
  useEffect(() => {
    setCurrentCardIndex(0);
  }, [activeIndex]);

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

  //REGRESS
  const handleLeftArrowClick = () => {
    playLeftSound();
    if (currentCardIndex <= 0) return; // Stop if at the first card
  
    const section = document.querySelector(`.${styles.section}`);
    const cards = section?.querySelectorAll(`.${styles.card}`);
  
    if (!cards) return;
  
    // Scale down the current active card before sliding the previous card in
    const currentCard = cards[currentCardIndex] as HTMLElement;
    currentCard.style.transition = 'transform 0.5s ease';
    currentCard.style.transform = `translateX(250px) scale(0.9)`; // Scale down and shift to the right
    currentCard.style.zIndex = `${cards.length - currentCardIndex}`;
  
    // Slide the following cards to the right with consistent gaps
    let cumulativeTranslation = 250 + 250 * 0.78; // Initial gap + decrement for the next card
    let decrement = 250 * 0.78 * 0.78; // Decrement factor for subsequent cards
  
    for (let i = currentCardIndex + 1; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      card.style.transition = 'transform 0.5s ease';
      card.style.transform = `translateX(${cumulativeTranslation}px) scale(${1 - (i - currentCardIndex) * 0.1})`;
      card.style.zIndex = `${cards.length - i}`;
      cumulativeTranslation += decrement;
      decrement *= 0.78; // Apply the decrement factor
    }
  
    // Slide the previous card into view from the left, with the correct gap
    const previousCard = cards[currentCardIndex - 1] as HTMLElement;
    previousCard.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    previousCard.style.opacity = '1';
    previousCard.style.transform = `translateX(0) scale(1)`; // Previous card slides in at translateX(0)
    previousCard.style.zIndex = `${cards.length - (currentCardIndex - 1)}`;
  
    // Update the current card index after the animation
    setTimeout(() => {
      setCurrentCardIndex((prev) => prev - 1);
    }, 100); // Match the duration of the animation
  };

  //PROGRESS
  const handleRightArrowClick = () => {
    playRightSound();
    if (currentCardIndex >= cardsData.length - 1) return; // Stop if at the last card
  
    const section = document.querySelector(`.${styles.section}`);
    const cards = section?.querySelectorAll(`.${styles.card}`);
  
    if (!cards) return;
  
    // Animate the current card to the left and fade out
    const currentCard = cards[currentCardIndex] as HTMLElement;
    currentCard.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    currentCard.style.transform = `translateX(-100%)`;
    currentCard.style.opacity = '0';
  
    // Move the remaining cards to the left using the same decrement logic as initial load
    let cumulativeTranslation = 0;
    let decrement = 250; // Initial decrement value
  
    for (let i = currentCardIndex + 1; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      card.style.transition = 'transform 0.5s ease';
      card.style.transform = `translateX(${cumulativeTranslation}px) scale(${1 - (i - currentCardIndex - 1) * 0.1})`;
      card.style.zIndex = `${cards.length - i}`;
      cumulativeTranslation += decrement;
      decrement *= 0.78; // Apply the decrement factor
    }
  
    // Update the current card index after the animation
    setTimeout(() => {
      setCurrentCardIndex((prev) => prev + 1);
    }, 100); // Match the duration of the animation
  };

  const componentMapping: Record<number, JSX.Element> = {
    0: (
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
            onClick={handleRightArrowClick}
            disabled={currentCardIndex === data.home.length-1}
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
            onClick={handleRightArrowClick}
            disabled={currentCardIndex === data.misc.length-1}
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
            onClick={handleRightArrowClick}
            disabled={currentCardIndex === data.gallery.length-1}
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
            onClick={handleRightArrowClick}
            disabled={currentCardIndex === data.credits.length-1}
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
        currentCardIndex={currentCardIndex}
        onCardIndexChange={setCurrentCardIndex}
        playHoverSound={playHoverSound}
        playLeftSound={playLeftSound}
        playRightSound={playRightSound}
      />
    );
  }

  return componentMapping[activeIndex] || <div>No content available</div>;
};

export default XboxDashboard;