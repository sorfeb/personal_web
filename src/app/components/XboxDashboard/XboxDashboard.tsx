'use client';

import React, { useEffect, useState } from 'react';

import XboxCard from '../XboxCard/XboxCard';
import SlideshowXboxCard from '../SlideshowXboxCard/SlideshowXboxCard';
import styles from './XboxDashboard.module.css';

import { useVolume } from '../../context/VolumeContext';

interface XboxDashboardProps {
  activeIndex: number;
  data: {
    home: { title: string; iconUrl: string }[];
    misc: { title: string; iconUrl: string }[];
    gallery: { title: string; iconUrl: string }[];
    credits: { title: string; iconUrl: string }[];
  };
}

const XboxDashboard: React.FC<XboxDashboardProps> = ({ activeIndex, data }) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const { volume } = useVolume();

  const cardsData = [
    data.home,
    data.misc,
    data.gallery,
    data.credits,
  ][activeIndex];

  useEffect(() => {
    const section = document.querySelector(`.${styles.section}`);
    const cards = section?.querySelectorAll(`.${styles.card}`);
  
    if (!cards) return;
  
    let cumulativeTranslation = 0;
    let decrement = 250; //increment, actually

    const playUnfoldSound = () => {
      if (isAudioPlaying) return;
      setIsAudioPlaying(true);

      const audio = new Audio('/assets/audio/snd_panelunfold.wav');
      audio.volume = volume/4;
      audio.play();

      setTimeout(() => setIsAudioPlaying(false), 600);
    };
    
    playUnfoldSound();

    // Reset cards to a consistent state
    cards.forEach((card) => {
      const cardElement = card as HTMLElement;
   
      cardElement.style.transition = 'none';
      cardElement.style.opacity = '0';
      cardElement.style.transform = `translateX(-100px) scale(0.9)`;
    });
  
    // Start animations after a short delay to allow reset
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
      }, index * 80); //Unfolding delay
  
      animationTimeouts.push(timeout);
    });
  
    // Cleanup previous animations if `activeIndex` changes rapidly
    return () => {
      animationTimeouts.forEach((timeout) => clearTimeout(timeout));
      cards.forEach((card) => {
        const cardElement = card as HTMLElement;
        cardElement.style.transition = 'none';
      });
    };
  }, [activeIndex]);

  const handleArrowClick = () => {
    let cumulativeTranslation = 0;
    let decrement = 250; //increment, actually

    if (currentCardIndex >= cardsData.length - 1) return; // Stop if at the last card

    const section = document.querySelector(`.${styles.section}`);
    const cards = section?.querySelectorAll(`.${styles.card}`);

    if (!cards) return;

    // Animate the first card
    const firstCard = cards[0] as HTMLElement;
    firstCard.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    firstCard.style.transform = `translateX(-100%)`;
    firstCard.style.opacity = '0';

    // Move the remaining cards to the left
    for (let i = 1; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      card.style.transition = 'transform 0.5s ease';
      card.style.transform = `translateX(${cumulativeTranslation}px) scale(${1 - i * 0.1})`;
      card.style.zIndex = `${cards.length - i}`;

      cumulativeTranslation += decrement;
      decrement *= 0.78;
    }

    setTimeout(() => {
      setCurrentCardIndex((prev) => prev + 1);
    }, 500); // Match the duration of the animation
  };
  
  
  const componentMapping: Record<number, JSX.Element> = {
    0: (
      <div className={styles.dashboardContainer}>
        <div className={styles.arrowContainer}>
          <button className={styles.leftArrow} onClick={handleArrowClick}>
            ◀
          </button>
        </div>
        <div className={styles.sectionContainer}>
          <div className={styles.section}>
            {data.home.map((card, index) => (
              <div className={styles.card} key={index}>
                <XboxCard key={index} title={card.title} iconUrl={card.iconUrl} />
              </div>
            ))}
          </div>
          <div className={styles.position}>
          {`1 of ${data.home.length}`}
          </div>
        </div>
      </div>
    ),
    1: (
      <div className={styles.dashboardContainer}>
        <div className={styles.arrowContainer}>
          <button className={styles.leftArrow} onClick={handleArrowClick}>
            ◀
          </button>
        </div>
        <div className={styles.section}>
          {data.misc.map((card, index) => (
            <div className={styles.card} key={index}>
            <XboxCard key={index} title={card.title} iconUrl={card.iconUrl} />
            </div>
          ))}
          <div className={styles.card}>
          <SlideshowXboxCard
              title= 'My Playlist'
              images= {[
                'https://mosaic.scdn.co/640/ab67616d00001e02512219d757d294b1b8ceb6fdab67616d00001e02b95dc41b1ea299b71415c870ab67616d00001e02d6ebb6f586a549c57189f2f9ab67616d00001e02e82b9063af74c25efea29973',
                'https://mosaic.scdn.co/640/ab67616d00001e0259eaf2f9fca6f4c449fc9fc0ab67616d00001e02aec44761574de2a7e8784f11ab67616d00001e02cb9172e927b9f4a7eba3e992ab67616d00001e02d421c7b2de6846831a2c3814',
                'https://mosaic.scdn.co/640/ab67616d00001e0209835613d695644fbc99cf9cab67616d00001e021d1ff8b3a6fe52ee3123078eab67616d00001e023607a6aab3a44e9d6cb71e41ab67616d00001e0278eea627fe9c77256adea633',
              ]}
          />
          </div>
        </div>       
      
        <div className={styles.position}>
            {`1 of ${data.misc.length}`}
        </div>
      </div>
    ),
    2: (
      <div className={styles.dashboardContainer}>
        <div className={styles.arrowContainer}>
          <button className={styles.leftArrow} onClick={handleArrowClick}>
            ◀
          </button>
        </div>
        <div className={styles.section}>
          {data.gallery.map((card, index) => (
            <div className={styles.card} key={index}>
              <XboxCard key={index} title={card.title} iconUrl={card.iconUrl} />
            </div>
          ))}
        </div>
            <div className={styles.position}>
              {`1 of ${data.gallery.length}`}
          </div>
      </div>
    ),
    3: (
      <div className={styles.dashboardContainer}>
        <div className={styles.arrowContainer}>
          <button className={styles.leftArrow} onClick={handleArrowClick}>
            ◀
          </button>
        </div>
        <div className={styles.section}>
          {data.credits.map((card, index) => (
            <div className={styles.card} key={index}>
              <XboxCard key={index} title={card.title} iconUrl={card.iconUrl} />
            </div>
          ))}
        </div>
          <div className={styles.position}>
            {`1 of ${data.credits.length}`}
          </div>
      </div>
    ),
  };

  return componentMapping[activeIndex] || <div>No content available</div>;
};

export default XboxDashboard;
