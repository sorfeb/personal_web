import { useState, useEffect, useCallback, useRef, type RefObject } from 'react';
import { useAudioManager } from './useAudioManager';
import { ANIMATION_CONFIG } from '../constants/cardAnimationConfig';

interface UseCardNavigationProps {
  totalCards: number;
  activeIndex: number;
  /**
   * The card elements, in DOM order. A ref array rather than a CSS-module class
   * string: the previous version reached for `document.querySelector`, which
   * finds cards belonging to *any* mounted dashboard and silently breaks the
   * moment a second one exists.
   */
  cardRefs: RefObject<(HTMLElement | null)[]>;
}

export const useCardNavigation = ({ totalCards, activeIndex, cardRefs }: UseCardNavigationProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const { playSound } = useAudioManager();

  /**
   * Re-entry guard.
   *
   * The stack transition runs for ANIMATION_DURATION (400ms) but the index is
   * committed after STATE_UPDATE_DELAY (100ms), so for 300ms the state and the
   * visible stack disagree. A held direction — D-pad auto-repeat at 150ms, or
   * OS key repeat — lands inside that window and transforms cards from the
   * *previous* frame's layout, desyncing the stack.
   *
   * The fix belongs here rather than as a clamp in the input layer: the bug is
   * reachable today by holding an arrow key, with no controller involved.
   */
  const isAnimatingRef = useRef(false);
  const timeoutsRef = useRef<number[]>([]);

  const clearPendingTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
    timeoutsRef.current = [];
  }, []);

  // Reset current card index when section changes
  useEffect(() => {
    clearPendingTimeouts();
    isAnimatingRef.current = false;
    setCurrentCardIndex(0);
  }, [activeIndex, clearPendingTimeouts]);

  useEffect(() => clearPendingTimeouts, [clearPendingTimeouts]);

  /**
   * Opens a transition: commits the new index part-way through, and holds the
   * guard closed for the full animation.
   */
  const beginTransition = useCallback(
    (commit: () => void) => {
      isAnimatingRef.current = true;

      timeoutsRef.current.push(
        window.setTimeout(commit, ANIMATION_CONFIG.STATE_UPDATE_DELAY),
        window.setTimeout(() => {
          isAnimatingRef.current = false;
        }, ANIMATION_CONFIG.ANIMATION_DURATION),
      );
    },
    [],
  );

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
   * The live card elements. Sliced to `totalCards` because the ref array is
   * reused across sections and can retain trailing entries from a longer one.
   */
  const getCardElements = useCallback((): HTMLElement[] => {
    const cards = cardRefs.current ?? [];
    return cards.slice(0, totalCards).filter((card): card is HTMLElement => card !== null);
  }, [cardRefs, totalCards]);

  /**
   * Handles navigation to the left (previous card becomes active)
   * Repositions all cards to maintain the visual stack effect
   */
  const navigateLeft = useCallback(() => {
    if (isAnimatingRef.current) return;
    if (currentCardIndex <= 0) return;

    const cards = getCardElements();
    if (cards.length === 0) return;

    playSound('panelLeft');

    const newActiveIndex = currentCardIndex - 1;

    // Position the new active card (previous card)
    applyCardTransform(cards[newActiveIndex], 0, calculateCardScale(0), cards.length);

    // Position the old active card (now second in stack)
    const { translation: secondPosition } = calculateStackTranslation(1);
    applyCardTransform(cards[currentCardIndex], secondPosition, calculateCardScale(1), cards.length - 1);

    // Reposition all following cards in the stack
    let { translation: cumulativeTranslation, nextDecrement: decrement } = calculateStackTranslation(1);

    for (let i = currentCardIndex + 1; i < cards.length; i++) {
      const stackPosition = i - newActiveIndex;

      cumulativeTranslation += decrement;
      applyCardTransform(cards[i], cumulativeTranslation, calculateCardScale(stackPosition), cards.length - stackPosition);
      decrement *= ANIMATION_CONFIG.STACK_OFFSET_DECREMENT_FACTOR;
    }

    beginTransition(() => setCurrentCardIndex(newActiveIndex));
  }, [currentCardIndex, playSound, getCardElements, beginTransition]);

  /**
   * Handles navigation to the right (next card becomes active)
   * Moves current card off-screen and repositions remaining cards
   */
  const navigateRight = useCallback(() => {
    if (isAnimatingRef.current) return;
    if (currentCardIndex >= totalCards - 1) return;

    const cards = getCardElements();
    if (cards.length === 0) return;

    playSound('panel');

    // Hide the current card by moving it off-screen
    applyCardTransform(cards[currentCardIndex], -window.innerWidth, 1, 0, 0);

    // Reposition all remaining cards to fill the gap
    let cumulativeTranslation = 0;
    let decrement = ANIMATION_CONFIG.STACK_OFFSET_INITIAL;

    for (let i = currentCardIndex + 1; i < cards.length; i++) {
      const newStackPosition = i - currentCardIndex - 1;

      applyCardTransform(cards[i], cumulativeTranslation, calculateCardScale(newStackPosition), cards.length - newStackPosition);

      cumulativeTranslation += decrement;
      decrement *= ANIMATION_CONFIG.STACK_OFFSET_DECREMENT_FACTOR;
    }

    beginTransition(() => setCurrentCardIndex((prev) => prev + 1));
  }, [currentCardIndex, totalCards, playSound, getCardElements, beginTransition]);

  return {
    currentCardIndex,
    navigateLeft,
    navigateRight,
    canNavigateLeft: currentCardIndex > 0,
    canNavigateRight: currentCardIndex < totalCards - 1,
  };
};
