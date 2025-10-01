import { useState, useEffect, useCallback } from 'react';
import { useAudioManager } from './useAudioManager';
import { ANIMATION_CONFIG } from '../constants/cardAnimationConfig';

interface UseCardNavigationProps {
  totalCards: number;
  activeIndex: number;
  sectionSelector: string;
  cardSelector: string;
}

export const useCardNavigation = ({ totalCards, activeIndex, sectionSelector, cardSelector }: UseCardNavigationProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const { playSound } = useAudioManager();

  // Reset current card index when section changes
  useEffect(() => {
    setCurrentCardIndex(0);
  }, [activeIndex]);

  /**
   * Calculates the scale value for a card based on its position in the stack
   * @param position - The position of the card in the visual stack (0 = active, 1 = first behind, etc.)
   * @returns The scale value (1.0 = full size, 0.9 = 90% size, etc.)
   */
  const calculateCardScale = (position: number): number => {
    return 1 - position * ANIMATION_CONFIG.SCALE_DECREMENT_PER_POSITION;
  };

  /**
   * Calculates the cumulative translation offset for cards in the stack
   * @param position - The position of the card in the visual stack
   * @returns Object containing the translation offset and next decrement value
   */
  const calculateStackTranslation = (position: number) => {
    let translation = 0;
    let decrement = ANIMATION_CONFIG.STACK_OFFSET_INITIAL;
    
    for (let i = 0; i < position; i++) {
      translation += decrement;
      decrement *= ANIMATION_CONFIG.STACK_OFFSET_DECREMENT_FACTOR;
    }
    
    return { translation, nextDecrement: decrement * ANIMATION_CONFIG.STACK_OFFSET_DECREMENT_FACTOR };
  };

  /**
   * Applies transform and styling to a card element
   * @param card - The card DOM element to style
   * @param translateX - Horizontal translation in pixels
   * @param scale - Scale factor (1.0 = normal size)
   * @param zIndex - Z-index for layering
   * @param opacity - Opacity value (0-1)
   */
  const applyCardTransform = (
    card: HTMLElement, 
    translateX: number, 
    scale: number, 
    zIndex: number, 
    opacity: number = 1
  ): void => {
    card.style.transition = `transform ${ANIMATION_CONFIG.ANIMATION_DURATION}ms ease, opacity ${ANIMATION_CONFIG.ANIMATION_DURATION}ms ease`;
    card.style.transform = `translateX(${translateX}px) scale(${scale})`;
    card.style.zIndex = `${zIndex}`;
    card.style.opacity = `${opacity}`;
  };

  /**
   * Gets all card elements from the DOM
   * @returns NodeList of card elements or null if not found
   */
  const getCardElements = () => {
    const section = document.querySelector(sectionSelector);
    return section?.querySelectorAll(cardSelector);
  };

  /**
   * Handles navigation to the left (previous card becomes active)
   * Repositions all cards to maintain the visual stack effect
   */
  const navigateLeft = useCallback(() => {
    if (currentCardIndex <= 0) return;
    
    playSound('panelLeft');
    const cards = getCardElements();
    if (!cards) return;

    const newActiveIndex = currentCardIndex - 1;

    // Position the new active card (previous card)
    const newActiveCard = cards[newActiveIndex] as HTMLElement;
    applyCardTransform(newActiveCard, 0, calculateCardScale(0), cards.length);

    // Position the old active card (now second in stack)
    const oldActiveCard = cards[currentCardIndex] as HTMLElement;
    const { translation: secondPosition } = calculateStackTranslation(1);
    applyCardTransform(oldActiveCard, secondPosition, calculateCardScale(1), cards.length - 1);

    // Reposition all following cards in the stack
    let { translation: cumulativeTranslation, nextDecrement: decrement } = calculateStackTranslation(1);
    
    for (let i = currentCardIndex + 1; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      const stackPosition = i - newActiveIndex;
      
      cumulativeTranslation += decrement;
      applyCardTransform(card, cumulativeTranslation, calculateCardScale(stackPosition), cards.length - stackPosition);
      decrement *= ANIMATION_CONFIG.STACK_OFFSET_DECREMENT_FACTOR;
    }

    // Update state after animation starts
    setTimeout(() => {
      setCurrentCardIndex(newActiveIndex);
    }, ANIMATION_CONFIG.STATE_UPDATE_DELAY);
  }, [currentCardIndex, playSound, sectionSelector, cardSelector]);

  /**
   * Handles navigation to the right (next card becomes active)
   * Moves current card off-screen and repositions remaining cards
   */
  const navigateRight = useCallback(() => {
    if (currentCardIndex >= totalCards - 1) return;
    
    playSound('panel');
    const cards = getCardElements();
    if (!cards) return;

    // Hide the current card by moving it off-screen
    const currentCard = cards[currentCardIndex] as HTMLElement;
    applyCardTransform(currentCard, -window.innerWidth, 1, 0, 0);

    // Reposition all remaining cards to fill the gap
    let cumulativeTranslation = 0;
    let decrement = ANIMATION_CONFIG.STACK_OFFSET_INITIAL;

    for (let i = currentCardIndex + 1; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      const newStackPosition = i - currentCardIndex - 1;
      
      applyCardTransform(card, cumulativeTranslation, calculateCardScale(newStackPosition), cards.length - newStackPosition);
      
      cumulativeTranslation += decrement;
      decrement *= ANIMATION_CONFIG.STACK_OFFSET_DECREMENT_FACTOR;
    }

    // Update state after animation starts
    setTimeout(() => {
      setCurrentCardIndex((prev) => prev + 1);
    }, ANIMATION_CONFIG.STATE_UPDATE_DELAY);
  }, [currentCardIndex, totalCards, playSound, sectionSelector, cardSelector]);

  return {
    currentCardIndex,
    navigateLeft,
    navigateRight,
    canNavigateLeft: currentCardIndex > 0,
    canNavigateRight: currentCardIndex < totalCards - 1,
  };
};
