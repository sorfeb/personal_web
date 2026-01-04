'use client';

import React, { memo, useRef, useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAudioManager } from '../../../../../../../hooks/useAudioManager';
import LayerToggle from '../LayerToggle';
import styles from './LayerCarousel.module.css';

interface LayerCarouselProps {
  /** Carousel title */
  title: string;
  /** Whether to show a toggle switch */
  showToggle?: boolean;
  /** Toggle state (if showToggle is true) */
  toggleEnabled?: boolean;
  /** Toggle change handler */
  onToggleChange?: (enabled: boolean) => void;
  /** Children (CarouselItem components) */
  children: React.ReactNode;
  /** Whether the carousel is disabled (items grayed) */
  disabled?: boolean;
}

/**
 * LayerCarousel
 *
 * Horizontal scrollable carousel for layer options with optional toggle.
 * Features arrow navigation, drag scrolling, and Xbox 360 styling.
 */
const LayerCarousel: React.FC<LayerCarouselProps> = ({
  title,
  showToggle = false,
  toggleEnabled = true,
  onToggleChange,
  children,
  disabled = false,
}) => {
  const { playSound } = useAudioManager();
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);

  // Update scroll indicators
  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const { scrollLeft, scrollWidth, clientWidth } = track;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  // Check scroll state on mount and resize
  useEffect(() => {
    updateScrollState();

    const track = trackRef.current;
    if (!track) return;

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(track);

    return () => resizeObserver.disconnect();
  }, [updateScrollState]);

  // Scroll by amount
  const scroll = useCallback((direction: 'left' | 'right') => {
    const track = trackRef.current;
    if (!track) return;

    const scrollAmount = direction === 'left' ? -200 : 200;
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    playSound('owawa');
  }, [playSound]);

  // Handle scroll event
  const handleScroll = useCallback(() => {
    updateScrollState();
  }, [updateScrollState]);

  // Drag handling for smooth scrolling
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const track = trackRef.current;
    if (!track) return;

    setIsDragging(true);
    dragStartX.current = e.pageX;
    scrollStartX.current = track.scrollLeft;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const track = trackRef.current;
    if (!track) return;

    const deltaX = e.pageX - dragStartX.current;
    track.scrollLeft = scrollStartX.current - deltaX;
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const carouselClass = `${styles.carousel} ${disabled || !toggleEnabled ? styles.disabled : ''}`;
  const trackWrapperClass = [
    styles.trackWrapper,
    canScrollLeft && styles.canScrollLeft,
    canScrollRight && styles.canScrollRight,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={carouselClass}>
      <div className={styles.header}>
        {showToggle && (
          <div className={styles.toggleWrapper}>
            <LayerToggle
              enabled={toggleEnabled}
              onChange={onToggleChange || (() => {})}
              ariaLabel={`Toggle ${title}`}
            />
          </div>
        )}
        <span className={styles.title}>{title}</span>
        <div className={styles.arrows}>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => scroll('left')}
            disabled={!canScrollLeft || disabled}
            aria-label="Scroll left"
          >
            <ChevronLeft className={styles.arrowIcon} />
          </button>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => scroll('right')}
            disabled={!canScrollRight || disabled}
            aria-label="Scroll right"
          >
            <ChevronRight className={styles.arrowIcon} />
          </button>
        </div>
      </div>

      <div className={trackWrapperClass}>
        <div
          ref={trackRef}
          className={styles.track}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {React.Children.count(children) > 0 ? (
            children
          ) : (
            <div className={styles.emptyState}>No options available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(LayerCarousel);
