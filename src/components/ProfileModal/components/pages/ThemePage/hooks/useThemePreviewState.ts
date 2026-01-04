'use client';

import { useState, useCallback, useMemo } from 'react';
import { useBackground } from '../../../../../../context/BackgroundContext';
import type { AnimationLayerId } from '../../../../../../components/Background/types';

/**
 * Preview state for theme customization
 *
 * Manages local preview state that's separate from the persisted background
 * state until the user explicitly applies changes.
 */

export interface ThemePreviewState {
  /** Currently selected base image ID */
  baseImageId: string;
  /** Animation layer enabled/disabled states */
  animationStates: Record<AnimationLayerId, boolean>;
}

export interface UseThemePreviewStateReturn {
  /** Current preview state */
  previewState: ThemePreviewState;
  /** Set the base image for preview */
  setBaseImage: (imageId: string) => void;
  /** Toggle an animation layer on/off */
  toggleAnimationLayer: (layerId: AnimationLayerId) => void;
  /** Set animation layer state directly */
  setAnimationEnabled: (layerId: AnimationLayerId, enabled: boolean) => void;
  /** Apply current preview state to the actual background */
  applyChanges: () => void;
  /** Reset preview to match current saved state */
  resetToSaved: () => void;
  /** Whether there are unsaved changes */
  isDirty: boolean;
  /** Check if a specific animation is enabled in preview */
  isAnimationEnabled: (layerId: AnimationLayerId) => boolean;
}

export const useThemePreviewState = (): UseThemePreviewStateReturn => {
  const {
    currentBackground,
    animationLayers,
    setBackground,
    setAnimationLayerEnabled,
  } = useBackground();

  // Initialize preview state from current saved state
  const getInitialState = useCallback((): ThemePreviewState => {
    const animationStates: Record<AnimationLayerId, boolean> = {} as Record<AnimationLayerId, boolean>;
    animationLayers.forEach((layer) => {
      animationStates[layer.id] = layer.enabled;
    });

    return {
      baseImageId: currentBackground.id,
      animationStates,
    };
  }, [currentBackground.id, animationLayers]);

  const [previewState, setPreviewState] = useState<ThemePreviewState>(getInitialState);

  // Set base image
  const setBaseImage = useCallback((imageId: string) => {
    setPreviewState((prev) => ({
      ...prev,
      baseImageId: imageId,
    }));
  }, []);

  // Toggle animation layer
  const toggleAnimationLayer = useCallback((layerId: AnimationLayerId) => {
    setPreviewState((prev) => ({
      ...prev,
      animationStates: {
        ...prev.animationStates,
        [layerId]: !prev.animationStates[layerId],
      },
    }));
  }, []);

  // Set animation layer state directly
  const setAnimationEnabled = useCallback((layerId: AnimationLayerId, enabled: boolean) => {
    setPreviewState((prev) => ({
      ...prev,
      animationStates: {
        ...prev.animationStates,
        [layerId]: enabled,
      },
    }));
  }, []);

  // Check if animation is enabled
  const isAnimationEnabled = useCallback(
    (layerId: AnimationLayerId): boolean => {
      return previewState.animationStates[layerId] ?? false;
    },
    [previewState.animationStates]
  );

  // Apply changes to the actual background context
  const applyChanges = useCallback(() => {
    // Update base image if changed
    if (previewState.baseImageId !== currentBackground.id) {
      setBackground(previewState.baseImageId);
    }

    // Update animation states
    Object.entries(previewState.animationStates).forEach(([layerId, enabled]) => {
      const currentState = animationLayers.find((l) => l.id === layerId);
      if (currentState && currentState.enabled !== enabled) {
        setAnimationLayerEnabled(layerId as AnimationLayerId, enabled);
      }
    });
  }, [previewState, currentBackground.id, animationLayers, setBackground, setAnimationLayerEnabled]);

  // Reset to saved state
  const resetToSaved = useCallback(() => {
    setPreviewState(getInitialState());
  }, [getInitialState]);

  // Check if there are unsaved changes
  const isDirty = useMemo(() => {
    if (previewState.baseImageId !== currentBackground.id) {
      return true;
    }

    for (const layer of animationLayers) {
      if (previewState.animationStates[layer.id] !== layer.enabled) {
        return true;
      }
    }

    return false;
  }, [previewState, currentBackground.id, animationLayers]);

  return {
    previewState,
    setBaseImage,
    toggleAnimationLayer,
    setAnimationEnabled,
    applyChanges,
    resetToSaved,
    isDirty,
    isAnimationEnabled,
  };
};
