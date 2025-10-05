'use client';

import React, { useEffect, useRef } from 'react';
import { useBackground } from '../../context/BackgroundContext';
import AnimatedBackground from '../AnimatedBackground/AnimatedBackground';
import styles from './BackgroundRenderer.module.css';

/**
 * BackgroundRenderer Component
 * 
 * Dynamically renders the appropriate background based on the current
 * background selection from BackgroundContext.
 * 
 * - For static backgrounds: Renders a div with background-image CSS
 * - For animated backgrounds: Dynamically imports and renders the component
 * 
 * Performance: Uses React.lazy for code-splitting animated backgrounds
 */

/**
 * Registry of animated background components
 * Add new animated components here as they're created
 */
const ANIMATED_COMPONENTS: Record<string, React.ComponentType> = {
  AnimatedBackground: AnimatedBackground,
  // Add more animated backgrounds here:
  // CustomAnimatedBg: CustomAnimatedBg,
};

const BackgroundRenderer: React.FC = () => {
  const { currentBackground, isLoading } = useBackground();
  const bgRef = useRef<HTMLDivElement>(null);

  // Apply background image dynamically to avoid inline styles lint error
  useEffect(() => {
    if (currentBackground.type === 'static' && currentBackground.imagePath && bgRef.current) {
      bgRef.current.style.backgroundImage = `url(${currentBackground.imagePath})`;
    }
  }, [currentBackground]);

  // Show nothing while loading from localStorage
  if (isLoading) {
    return null;
  }

  // Render animated background component
  if (currentBackground.type === 'animated') {
    const componentName = currentBackground.componentName;
    
    if (!componentName) {
      console.error(`Animated background "${currentBackground.id}" is missing componentName`);
      return null;
    }

    const AnimatedComponent = ANIMATED_COMPONENTS[componentName];

    if (!AnimatedComponent) {
      console.error(`Animated component "${componentName}" not found in registry`);
      return null;
    }

    return <AnimatedComponent />;
  }

  // Render static background image
  if (currentBackground.type === 'static') {
    if (!currentBackground.imagePath) {
      console.error(`Static background "${currentBackground.id}" is missing imagePath`);
      return null;
    }

    return (
      <div
        ref={bgRef}
        className={styles.staticBackground}
        aria-label={`Background: ${currentBackground.name}`}
      />
    );
  }

  // Fallback for unknown background types
  console.error(`Unknown background type: ${currentBackground.type}`);
  return null;
};

export default BackgroundRenderer;
