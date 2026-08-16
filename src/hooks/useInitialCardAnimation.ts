import { useEffect, useRef, type RefObject } from 'react';
import { useAudioManager } from './useAudioManager';
import { ANIMATION_CONFIG } from '../constants/cardAnimationConfig';

interface UseInitialCardAnimationProps {
  /**
   * The current active section index
   */
  activeIndex: number;
  /**
   * Whether the device is mobile (skip animation on mobile)
   */
  isMobile: boolean;
  /**
   * The card elements, in DOM order — the same ref array `useCardNavigation`
   * reads, so both hooks are guaranteed to be animating the same nodes.
   */
  cardRefs: RefObject<(HTMLElement | null)[]>;
  /**
   * How many cards the active section has. The ref array is reused across
   * sections and can retain trailing entries from a longer one.
   */
  cardCount: number;
}

/**
 * Custom hook that handles the initial "unfold" animation for Xbox dashboard cards.
 *
 * Features:
 * - Staggered card entrance animation with scale and translation
 * - Audio feedback (unfold sound)
 * - Proper cleanup of timeouts and transitions
 * - Uses centralized ANIMATION_CONFIG for consistency
 * - Skips animation on mobile devices
 *
 * @param props - Configuration for the animation
 */
export const useInitialCardAnimation = ({
  activeIndex,
  isMobile,
  cardRefs,
  cardCount,
}: UseInitialCardAnimationProps) => {
  const timeoutsRef = useRef<number[]>([]);
  const isAudioPlayingRef = useRef(false);
  const { playSound } = useAudioManager();

  useEffect(() => {
    if (isMobile) return;

    const cards = (cardRefs.current ?? [])
      .slice(0, cardCount)
      .filter((card): card is HTMLElement => card !== null);
    if (cards.length === 0) return;

    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current = [];

    // Animation configuration
    let cumulativeTranslation = 0;
    let decrement = ANIMATION_CONFIG.STACK_OFFSET_INITIAL;
    const durationMs = ANIMATION_CONFIG.ANIMATION_DURATION;
    const staggerDelayMs = 80; // Delay between each card's animation start

    /**
     * Plays the unfold sound effect once per section change
     */
    const playUnfoldSound = () => {
      if (isAudioPlayingRef.current) return;

      isAudioPlayingRef.current = true;
      playSound('unfold');

      setTimeout(() => {
        isAudioPlayingRef.current = false;
      }, durationMs + 100);
    };

    playUnfoldSound();

    // Step 1: Set initial state for all cards (invisible, off-screen)
    cards.forEach((el) => {
      el.style.transition = 'none';
      el.style.opacity = '0';
      el.style.transform = `translateX(-100px) scale(${1 - ANIMATION_CONFIG.SCALE_DECREMENT_PER_POSITION})`;
    });

    // Step 2: Stagger the animation for each card
    cards.forEach((el, index) => {
      const scale = 1 - index * ANIMATION_CONFIG.SCALE_DECREMENT_PER_POSITION;

      const timeout = window.setTimeout(() => {
        el.style.transition = `transform ${durationMs}ms ease, opacity ${durationMs}ms ease`;
        el.style.opacity = '1';
        el.style.transform = `translateX(${cumulativeTranslation}px) scale(${scale})`;
        el.style.zIndex = `${cards.length - index}`;

        // Update position for next card
        cumulativeTranslation += decrement;
        decrement *= ANIMATION_CONFIG.STACK_OFFSET_DECREMENT_FACTOR;
      }, index * staggerDelayMs);

      timeoutsRef.current.push(timeout);
    });

    // Cleanup function
    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      timeoutsRef.current = [];

      cards.forEach((el) => {
        el.style.transition = 'none';
      });
    };
  }, [activeIndex, isMobile, cardRefs, cardCount, playSound]);
};
