'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useBackground } from '../../context/BackgroundContext';
import { useAudioManager } from '../../hooks/useAudioManager';
import { backgrounds } from '../../data/backgrounds';
import styles from './BackgroundSelector.module.css';

/**
 * BackgroundSelector Component
 * 
 * User interface for browsing and selecting different backgrounds.
 * Displays background thumbnails in a grid with audio feedback on selection.
 * 
 * Features:
 * - Grid layout with background thumbnails
 * - Visual indication of current selection
 * - Xbox-style audio feedback on hover and selection
 * - Keyboard navigation support
 * - Close button to dismiss
 */

interface BackgroundSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ isOpen, onClose }) => {
  const { currentBackground, setBackground } = useBackground();
  const { playSound } = useAudioManager();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleBackgroundSelect = (backgroundId: string) => {
    if (backgroundId !== currentBackground.id) {
      playSound('click');
      setBackground(backgroundId);
    }
  };

  const handleMouseEnter = (backgroundId: string) => {
    if (backgroundId !== hoveredId) {
      playSound('hover');
      setHoveredId(backgroundId);
    }
  };

  const handleClose = () => {
    playSound('back');
    onClose();
  };

  // Handle backdrop click to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Handle escape key to close
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    // Backdrop click-to-dismiss is a pointer-only convenience; the keyboard
    // equivalent is Escape, handled by onKeyDown below. A backdrop must not be
    // a tab stop, so the native-element fix does not apply here.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="background-selector-title"
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title} id="background-selector-title">Select Background</h2>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            onMouseEnter={() => playSound('hover')}
            aria-label="Close background selector"
          >
            ✕
          </button>
        </div>

        <div className={styles.grid}>
          {backgrounds.map((background) => {
            const isSelected = background.id === currentBackground.id;
            const isHovered = background.id === hoveredId;

            return (
              <button
                key={background.id}
                className={`${styles.backgroundCard} ${isSelected ? styles.selected : ''} ${
                  isHovered ? styles.hovered : ''
                }`}
                onClick={() => handleBackgroundSelect(background.id)}
                onMouseEnter={() => handleMouseEnter(background.id)}
                onMouseLeave={() => setHoveredId(null)}
                aria-label={`Select ${background.name}`}
                aria-current={isSelected}
              >
                <div className={styles.thumbnail}>
                  <Image
                    src={background.thumbnail}
                    alt={background.name}
                    className={styles.thumbnailImage}
                    fill
                    sizes="(max-width: 768px) 180px, 250px"
                  />
                  {isSelected && (
                    <div className={styles.selectedBadge}>
                      <span>✓</span>
                    </div>
                  )}
                  {background.animations?.some(a => a.enabled) && (
                    <div className={styles.animatedBadge}>
                      <span>🎬</span>
                    </div>
                  )}
                </div>
                <div className={styles.info}>
                  <h3 className={styles.backgroundName}>{background.name}</h3>
                  {background.description && (
                    <p className={styles.description}>{background.description}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BackgroundSelector;
