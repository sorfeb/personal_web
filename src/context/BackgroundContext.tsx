'use client';

import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import type { BackgroundConfig, AnimationLayerId, AnimationLayerState } from '../components/Background/types';
import { backgrounds, getBackgroundById, getDefaultBackground } from '../data/backgrounds';
import { useMountEffect } from '../hooks';

/**
 * BackgroundContext
 *
 * Manages the layered background system:
 * - Current background selection (base image + available animations)
 * - User's animation layer toggle states
 * - Persistence to localStorage
 */

interface BackgroundContextType {
  /** Current background configuration */
  currentBackground: BackgroundConfig;
  /** Set background by ID */
  setBackground: (backgroundId: string) => void;
  /** User's animation layer states (enabled/disabled) */
  animationLayers: AnimationLayerState[];
  /** Toggle a specific animation layer */
  toggleAnimationLayer: (layerId: AnimationLayerId) => void;
  /** Set animation layer state directly */
  setAnimationLayerEnabled: (layerId: AnimationLayerId, enabled: boolean) => void;
  /** Loading state */
  isLoading: boolean;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

const BACKGROUND_STORAGE_KEY = 'sorosfebria-selected-background';
const ANIMATIONS_STORAGE_KEY = 'sorosfebria-animation-layers';

interface BackgroundProviderProps {
  children: ReactNode;
}

export const BackgroundProvider: React.FC<BackgroundProviderProps> = ({ children }) => {
  const [currentBackground, setCurrentBackground] = useState<BackgroundConfig>(getDefaultBackground());
  const [animationLayers, setAnimationLayers] = useState<AnimationLayerState[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize animation layer states from background config
   */
  const initializeAnimationLayers = useCallback((background: BackgroundConfig, savedStates?: AnimationLayerState[]) => {
    const layers: AnimationLayerState[] = background.animations.map((anim) => {
      // Check if we have a saved state for this layer
      const savedState = savedStates?.find((s) => s.id === anim.id);
      return {
        id: anim.id as AnimationLayerId,
        enabled: savedState?.enabled ?? anim.enabled,
      };
    });
    setAnimationLayers(layers);
  }, []);

  /**
   * Load saved preferences from localStorage on mount.
   * initializeAnimationLayers is a stable useCallback, so mount-only semantics hold.
   */
  useMountEffect(() => {
    try {
      // Load saved background
      const savedBackgroundId = localStorage.getItem(BACKGROUND_STORAGE_KEY);
      let background = getDefaultBackground();

      if (savedBackgroundId) {
        const found = getBackgroundById(savedBackgroundId);
        if (found) {
          background = found;
        } else {
          console.warn(`Background "${savedBackgroundId}" not found, using default`);
        }
      }

      setCurrentBackground(background);

      // Load saved animation states
      const savedAnimationsJson = localStorage.getItem(ANIMATIONS_STORAGE_KEY);
      const savedAnimations: AnimationLayerState[] | undefined = savedAnimationsJson
        ? JSON.parse(savedAnimationsJson)
        : undefined;

      initializeAnimationLayers(background, savedAnimations);
    } catch (error) {
      console.error('Failed to load background preferences:', error);
      initializeAnimationLayers(getDefaultBackground());
    } finally {
      setIsLoading(false);
    }
  });

  /**
   * Save animation layer states to localStorage
   */
  const saveAnimationLayers = useCallback((layers: AnimationLayerState[]) => {
    try {
      localStorage.setItem(ANIMATIONS_STORAGE_KEY, JSON.stringify(layers));
    } catch (error) {
      console.error('Failed to save animation layers:', error);
    }
  }, []);

  /**
   * Switch to a different background
   */
  const setBackground = useCallback((backgroundId: string) => {
    const background = getBackgroundById(backgroundId);

    if (!background) {
      console.error(`Background "${backgroundId}" not found`);
      return;
    }

    setCurrentBackground(background);

    // Re-initialize animation layers for new background
    // Try to preserve user's enabled/disabled states for matching layer IDs
    setAnimationLayers((prevLayers) => {
      const newLayers = background.animations.map((anim) => {
        const existingState = prevLayers.find((l) => l.id === anim.id);
        return {
          id: anim.id as AnimationLayerId,
          enabled: existingState?.enabled ?? anim.enabled,
        };
      });
      saveAnimationLayers(newLayers);
      return newLayers;
    });

    // Persist background selection
    try {
      localStorage.setItem(BACKGROUND_STORAGE_KEY, backgroundId);
    } catch (error) {
      console.error('Failed to save background preference:', error);
    }
  }, [saveAnimationLayers]);

  /**
   * Toggle animation layer on/off
   */
  const toggleAnimationLayer = useCallback((layerId: AnimationLayerId) => {
    setAnimationLayers((prev) => {
      const updated = prev.map((layer) =>
        layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer
      );
      saveAnimationLayers(updated);
      return updated;
    });
  }, [saveAnimationLayers]);

  /**
   * Set animation layer state directly
   */
  const setAnimationLayerEnabled = useCallback((layerId: AnimationLayerId, enabled: boolean) => {
    setAnimationLayers((prev) => {
      const updated = prev.map((layer) =>
        layer.id === layerId ? { ...layer, enabled } : layer
      );
      saveAnimationLayers(updated);
      return updated;
    });
  }, [saveAnimationLayers]);

  const value: BackgroundContextType = useMemo(
    () => ({
      currentBackground,
      setBackground,
      animationLayers,
      toggleAnimationLayer,
      setAnimationLayerEnabled,
      isLoading,
    }),
    [currentBackground, setBackground, animationLayers, toggleAnimationLayer, setAnimationLayerEnabled, isLoading]
  );

  return (
    <BackgroundContext.Provider value={value}>
      {children}
    </BackgroundContext.Provider>
  );
};

/**
 * Hook to access background context
 *
 * @example
 * const { currentBackground, animationLayers, toggleAnimationLayer } = useBackground();
 *
 * // Toggle circle ripples
 * toggleAnimationLayer('circle-ripples');
 */
export const useBackground = (): BackgroundContextType => {
  const context = useContext(BackgroundContext);

  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }

  return context;
};

// Re-export for convenience
export { backgrounds, getBackgroundById, getDefaultBackground };
