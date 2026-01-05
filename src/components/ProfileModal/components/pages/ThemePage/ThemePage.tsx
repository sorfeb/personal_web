'use client';

import React, { memo, useCallback, useImperativeHandle, forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { LayerCarousel, CarouselItem, LivePreview } from './components';
import { useThemePreviewState } from './hooks/useThemePreviewState';
import { useAudioManager } from '../../../../../hooks/useAudioManager';
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
 * - Preview section in its own container
 * - Collapsible control panel overlay with translucent blur
 *
 * Uses Preview + Apply pattern - changes are previewed locally
 * until user clicks the external "Apply" button.
 */
const ThemePage = forwardRef<ThemePageRef>((_, ref) => {
  const { playSound } = useAudioManager();
  const [isControlPanelExpanded, setIsControlPanelExpanded] = useState(true);

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

  // Toggle control panel expansion
  const toggleControlPanel = useCallback(() => {
    playSound('navigation');
    setIsControlPanelExpanded((prev) => !prev);
  }, [playSound]);

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
      {/* Collapsible control panel */}
      <div className={styles.controlPanelWrapper}>
        <motion.div
          className={styles.controlPanel}
          initial={false}
          animate={{
            height: isControlPanelExpanded ? 'auto' : 0,
            opacity: isControlPanelExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <div className={styles.controlPanelContent}>
            {/* Unsaved changes indicator */}
            <AnimatePresence>
              {isDirty && (
                <motion.div
                  className={styles.dirtyIndicator}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <span className={styles.dirtyDot} />
                  <span className={styles.dirtyText}>
                    Unsaved changes — press Apply to save
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Layer carousels */}
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
          </div>
        </motion.div>

        {/* Pull tab */}
        <button
          type="button"
          className={styles.pullTab}
          onClick={toggleControlPanel}
          onMouseEnter={() => playSound('owawa')}
          aria-label={isControlPanelExpanded ? 'Collapse control panel' : 'Expand control panel'}
          aria-expanded={isControlPanelExpanded}
        >
          <span className={styles.pullTabLine} />
          {isControlPanelExpanded ? (
            <ChevronUp className={styles.pullTabIcon} size={16} />
          ) : (
            <ChevronDown className={styles.pullTabIcon} size={16} />
          )}
          <span className={styles.pullTabLine} />
        </button>
      </div>

      {/* Preview section - in its own designated container */}
      <div className={styles.previewSection}>
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
