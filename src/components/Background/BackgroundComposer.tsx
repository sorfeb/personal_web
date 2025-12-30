'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useBackground } from '../../context/BackgroundContext';
import BaseLayer from './layers/BaseLayer';
import { ANIMATION_REGISTRY } from './layers/animations';
import type { AnimationLayerId } from './types';

/**
 * BackgroundComposer
 *
 * Orchestrates the layered background system by composing:
 * 1. Base layer (static image)
 * 2. Animation layers (circle ripples, water ripples, etc.)
 *
 * Handles:
 * - Reading background config from context
 * - Route-based performance optimization (animations only on home)
 * - Rendering layers in correct z-order
 */
const BackgroundComposer: React.FC = () => {
  const { currentBackground, animationLayers, isLoading } = useBackground();
  const pathname = usePathname();

  const isHomePage = pathname === '/';

  // Don't render while loading to prevent flash
  if (isLoading) {
    return null;
  }

  return (
    <>
      {/* Layer 1: Static base image */}
      <BaseLayer
        imagePath={currentBackground.baseImage}
        alt={`Background: ${currentBackground.name}`}
      />

      {/* Layer 2+: Animation overlays */}
      {currentBackground.animations.map((animConfig) => {
        const AnimationComponent = ANIMATION_REGISTRY[animConfig.id as AnimationLayerId];

        if (!AnimationComponent) {
          console.warn(`Animation layer "${animConfig.id}" not found in registry`);
          return null;
        }

        // Check if user has this layer enabled
        const layerState = animationLayers.find((l) => l.id === animConfig.id);
        const isEnabled = layerState?.enabled ?? animConfig.enabled;

        return (
          <AnimationComponent
            key={animConfig.id}
            enabled={isEnabled}
            isHomePage={isHomePage}
          />
        );
      })}
    </>
  );
};

export default BackgroundComposer;
