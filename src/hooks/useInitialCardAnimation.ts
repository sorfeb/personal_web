import { useEffect, useRef } from 'react';
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
   * CSS class name for the card elements
   */
  cardSelector: string;
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
 * @returns A ref that must be attached to the section container element
 */
export const useInitialCardAnimation = ({
  activeIndex,
  isMobile,
  cardSelector,
}: UseInitialCardAnimationProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<number[]>([]);
  const isAudioPlayingRef = useRef(false);
  const { playSound } = useAudioManager();

  useEffect(() => {
    if (isMobile) return;

    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll(cardSelector);
    if (!cards || cards.length === 0) return;

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
    cards.forEach((card) => {
      const el = card as HTMLElement;
      el.style.transition = 'none';
      el.style.opacity = '0';
      el.style.transform = `translateX(-100px) scale(${1 - ANIMATION_CONFIG.SCALE_DECREMENT_PER_POSITION})`;
    });

    // Step 2: Stagger the animation for each card
    cards.forEach((card, index) => {
      const el = card as HTMLElement;
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

      cards.forEach((card) => {
        const el = card as HTMLElement;
        el.style.transition = 'none';
      });
    };
  }, [activeIndex, isMobile, cardSelector, playSound]);

  return sectionRef;
};
