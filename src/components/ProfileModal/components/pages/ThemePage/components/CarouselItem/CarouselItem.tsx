'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAudioManager } from '../../../../../../../hooks/useAudioManager';
import type { AnimationLayerId } from '../../../../../../../components/Background/types';
import styles from './CarouselItem.module.css';

interface CarouselItemProps {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Thumbnail image path (optional for animations) */
  thumbnail?: string;
  /** Whether this item is currently selected */
  selected: boolean;
  /** Whether this item is disabled (layer toggle off) */
  disabled?: boolean;
  /** Aspect ratio type */
  aspect?: 'wide' | 'square';
  /** Animation type for preview (if animation layer) */
  animationType?: AnimationLayerId;
  /** Click handler */
  onClick: () => void;
}

/**
 * CarouselItem
 *
 * Selectable thumbnail for layer carousels with Xbox 360 styling.
 * Shows green glow when selected, grayed when disabled.
 */
const CarouselItem: React.FC<CarouselItemProps> = ({
  id,
  name,
  thumbnail,
  selected,
  disabled = false,
  aspect = 'wide',
  animationType,
  onClick,
}) => {
  const { playSound } = useAudioManager();

  const handleClick = () => {
    if (disabled) return;
    playSound('navigation');
    onClick();
  };

  const handleMouseEnter = () => {
    if (!disabled) {
      playSound('owawa');
    }
  };

  const renderContent = () => {
    // Animation preview for animation layers - contained preview versions
    if (animationType) {
      return (
        <div className={styles.animationPreview}>
          {animationType === 'circle-ripples' && (
            <div className={styles.circleRipplesPreview}>
              <div className={styles.rippleCircle} />
              <div className={styles.rippleCircle} />
              <div className={styles.rippleCircle} />
            </div>
          )}
          {animationType === 'water-ripples' && (
            <div className={styles.waterRipplesPreview}>
              <div className={styles.waterWave} />
              <div className={styles.waterWave} />
            </div>
          )}
        </div>
      );
    }

    // Regular thumbnail image
    if (thumbnail) {
      return (
        <Image
          src={thumbnail}
          alt={name}
          fill
          sizes={aspect === 'wide' ? '120px' : '80px'}
          className={styles.thumbnail}
        />
      );
    }

    return null;
  };

  const classNames = [
    styles.item,
    aspect === 'wide' ? styles.aspectWide : styles.aspectSquare,
    selected && styles.selected,
    disabled && styles.disabled,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.button
      type="button"
      className={classNames}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.15 }}
      aria-pressed={selected}
      aria-label={`${name}${selected ? ' (selected)' : ''}${disabled ? ' (disabled)' : ''}`}
    >
      {renderContent()}
      <span className={styles.label}>{name}</span>
    </motion.button>
  );
};

export default memo(CarouselItem);
