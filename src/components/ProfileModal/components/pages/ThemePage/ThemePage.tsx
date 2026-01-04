'use client';

import React, { memo, useCallback, useImperativeHandle, forwardRef } from 'react';
import { LayerCarousel, CarouselItem, LivePreview } from './components';
import { useThemePreviewState } from './hooks/useThemePreviewState';
import { BASE_IMAGE_OPTIONS, ANIMATION_OPTIONS } from './data/layerOptions';
import type { AnimationLayerId } from '../../../../../components/Background/types';
import styles from './ThemePage.module.css';

/** Imperative handle for external control (Apply button) */
export interface ThemePageRef {
  apply: () => void;
  reset: () => void;
  isDirty: boolean;
}

/**
 * ThemePage
 *
 * Background layer configuration interface with:
 * - Upper section: Stacked carousels for base image and animation layers
 * - Lower section: Live preview of combined layers
 *
 * Uses Preview + Apply pattern - changes are previewed locally
 * until user clicks the external "Apply" button.
 */
const ThemePage = forwardRef<ThemePageRef>((_, ref) => {
  const {
    previewState,
    setBaseImage,
    toggleAnimationLayer,
    setAnimationEnabled,
    applyChanges,
    resetToSaved,
    isDirty,
    isAnimationEnabled,
  } = useThemePreviewState();

  // Expose imperative methods for external Apply button
  useImperativeHandle(
    ref,
    () => ({
      apply: applyChanges,
      reset: resetToSaved,
      isDirty,
    }),
    [applyChanges, resetToSaved, isDirty]
  );

  // Handle base image selection
  const handleBaseImageSelect = useCallback(
    (imageId: string) => {
      setBaseImage(imageId);
    },
    [setBaseImage]
  );

  // Handle animation toggle
  const handleAnimationToggle = useCallback(
    (layerId: AnimationLayerId) => {
      toggleAnimationLayer(layerId);
    },
    [toggleAnimationLayer]
  );

  // Handle animation selection (when clicking the carousel item)
  const handleAnimationSelect = useCallback(
    (layerId: AnimationLayerId) => {
      // If clicking a disabled animation, enable it
      if (!isAnimationEnabled(layerId)) {
        setAnimationEnabled(layerId, true);
      }
    },
    [isAnimationEnabled, setAnimationEnabled]
  );

  return (
    <div className={styles.container}>
      {/* Upper section: Layer carousels */}
      <div className={styles.carouselSection}>
        {/* Base Background Carousel */}
        <LayerCarousel title="Background">
          {BASE_IMAGE_OPTIONS.map((option) => (
            <CarouselItem
              key={option.id}
              id={option.id}
              name={option.name}
              thumbnail={option.thumbnail}
              selected={previewState.baseImageId === option.id}
              aspect="wide"
              onClick={() => handleBaseImageSelect(option.id)}
            />
          ))}
        </LayerCarousel>

        {/* Animation Layer Carousels */}
        {ANIMATION_OPTIONS.map((animation) => {
          const isEnabled = isAnimationEnabled(animation.id);

          return (
            <LayerCarousel
              key={animation.id}
              title={animation.name}
              showToggle
              toggleEnabled={isEnabled}
              onToggleChange={() => handleAnimationToggle(animation.id)}
              disabled={!isEnabled}
            >
              <CarouselItem
                id={animation.id}
                name={animation.name}
                selected={isEnabled}
                disabled={!isEnabled}
                aspect="square"
                animationType={animation.id}
                onClick={() => handleAnimationSelect(animation.id)}
              />
            </LayerCarousel>
          );
        })}
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Lower section: Live preview */}
      <div className={styles.previewSection}>
        {/* Unsaved changes indicator */}
        {isDirty && (
          <div className={styles.dirtyIndicator}>
            <span className={styles.dirtyDot} />
            <span className={styles.dirtyText}>
              Unsaved changes — press Apply to save
            </span>
          </div>
        )}

        <LivePreview
          baseImageId={previewState.baseImageId}
          animationStates={previewState.animationStates}
        />
      </div>
    </div>
  );
});

ThemePage.displayName = 'ThemePage';

export default memo(ThemePage);
