import { useState, useEffect, useCallback } from 'react';
import { useAudioManager } from './useAudioManager';

interface UseCardNavigationProps {
  totalCards: number;
  activeIndex: number;
  sectionSelector: string;
  cardSelector: string;
}

export const useCardNavigation = ({ totalCards, activeIndex, sectionSelector, cardSelector }: UseCardNavigationProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const { playSound } = useAudioManager();

  useEffect(() => {
    setCurrentCardIndex(0);
  }, [activeIndex]);

  const navigateLeft = useCallback(() => {
    if (currentCardIndex <= 0) return;
    
    playSound('panelLeft');
    const section = document.querySelector(sectionSelector);
    const cards = section?.querySelectorAll(cardSelector);
    
    if (!cards) return;

    const currentCard = cards[currentCardIndex] as HTMLElement;
    currentCard.style.transition = 'transform 0.5s ease';
    currentCard.style.transform = `translateX(250px) scale(${1 - 1 * 0.1})`;    
    currentCard.style.zIndex = `${cards.length - currentCardIndex}`;

    let cumulativeTranslation = 250 + 250 * 0.78;
    let decrement = 250 * 0.78 * 0.78;

    for (let i = currentCardIndex + 1; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      card.style.transition = 'transform 0.5s ease';
      const newPosition = i - currentCardIndex + 1;
      card.style.transform = `translateX(${cumulativeTranslation}px) scale(${1 - newPosition * 0.1})`;
      card.style.zIndex = `${cards.length - i}`;
      cumulativeTranslation += decrement;
      decrement *= 0.78;
    }

    const previousCard = cards[currentCardIndex - 1] as HTMLElement;
    previousCard.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    previousCard.style.opacity = '1';
    previousCard.style.transform = `translateX(0) scale(1)`;
    previousCard.style.zIndex = `${cards.length - (currentCardIndex - 1)}`;

    setTimeout(() => {
      setCurrentCardIndex((prev) => prev - 1);
    }, 100);
  }, [currentCardIndex, playSound, sectionSelector, cardSelector]);

  const navigateRight = useCallback(() => {
    if (currentCardIndex >= totalCards - 1) return;
    
    playSound('panel');
    const section = document.querySelector(sectionSelector);
    const cards = section?.querySelectorAll(cardSelector);
    
    if (!cards) return;

    // ...existing animation logic...
    const currentCard = cards[currentCardIndex] as HTMLElement;
    currentCard.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    currentCard.style.transform = `translateX(-100%)`;
    currentCard.style.opacity = '0';

    let cumulativeTranslation = 0;
    let decrement = 250;

    for (let i = currentCardIndex + 1; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      card.style.transition = 'transform 0.5s ease';
      card.style.transform = `translateX(${cumulativeTranslation}px) scale(${1 - (i - currentCardIndex - 1) * 0.1})`;
      card.style.zIndex = `${cards.length - i}`;
      cumulativeTranslation += decrement;
      decrement *= 0.78;
    }

    setTimeout(() => {
      setCurrentCardIndex((prev) => prev + 1);
    }, 100);
  }, [currentCardIndex, totalCards, playSound, sectionSelector, cardSelector]);

  return {
    currentCardIndex,
    navigateLeft,
    navigateRight,
    canNavigateLeft: currentCardIndex > 0,
    canNavigateRight: currentCardIndex < totalCards - 1,
  };
};
