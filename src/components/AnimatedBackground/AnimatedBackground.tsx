'use client';

import React from 'react';
import styles from './AnimatedBackground.module.css';

/**
 * AnimatedBackground Component
 * 
 * Renders an animated background with rippling circular patterns inspired by the Xbox 360 aesthetic.
 * Uses pure CSS animations for optimal performance with GPU acceleration.
 * 
 * Features:
 * - Multiple circle groups positioned to match the original wallpaper design
 * - Concentric circles that expand and contract in a ripple effect
 * - Staggered animation delays for organic movement
 * - Respects prefers-reduced-motion for accessibility
 * - Fixed positioning with z-index management to stay behind all content
 */

interface CircleGroup {
  x: number; // X position as percentage
  y: number; // Y position as percentage
  size: number; // Base size for the circle group
  delay: number; // Animation delay in seconds
  opacity: number; // Base opacity for the group
}

const AnimatedBackground: React.FC = () => {
  // Define circle positions matching the Xbox 360 wallpaper pattern
  // Positioned to recreate the circular pattern clusters from the original design
  const circleGroups: CircleGroup[] = [
    // Top right cluster (main focal point)
    { x: 85, y: 30, size: 80, delay: 0, opacity: 0.3 },
    { x: 78, y: 25, size: 60, delay: 0.5, opacity: 0.25 },
    { x: 72, y: 35, size: 40, delay: 1, opacity: 0.2 },
    { x: 90, y: 20, size: 50, delay: 1.5, opacity: 0.15 },
    { x: 82, y: 40, size: 35, delay: 2, opacity: 0.18 },
    
    // Center right area
    { x: 65, y: 50, size: 45, delay: 1.2, opacity: 0.22 },
    { x: 70, y: 55, size: 30, delay: 1.8, opacity: 0.17 },
    
    // Bottom left cluster
    { x: 5, y: 85, size: 70, delay: 2.2, opacity: 0.25 },
    { x: 2, y: 90, size: 50, delay: 2.7, opacity: 0.2 },
    { x: 8, y: 78, size: 40, delay: 3.1, opacity: 0.18 },
    
    // Scattered circles for depth
    { x: 15, y: 15, size: 35, delay: 2.5, opacity: 0.15 },
    { x: 50, y: 20, size: 30, delay: 3.3, opacity: 0.16 },
    { x: 40, y: 70, size: 38, delay: 1.6, opacity: 0.19 },
    { x: 95, y: 60, size: 42, delay: 2.9, opacity: 0.21 },
  ];

  return (
    <div className={styles.backgroundContainer}>
      {/* Base gradient background matching Xbox 360 green theme */}
      <div className={styles.gradientBase} />
      
      {/* Animated circle groups - SVG for crisp rendering at any resolution */}
      <svg className={styles.circlesSvg} xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Subtle blur for softer appearance */}
          <filter id="blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
        </defs>
        
        {circleGroups.map((group, idx) => {
          const groupKey = `group-${idx}`;
          return (
            <g key={groupKey} data-delay={group.delay}>
              {/* Create 4 concentric circles per group for ripple effect */}
              {[0, 1, 2, 3].map((ringIndex) => {
                const ringClass = `ring${ringIndex}`;
                return (
                  <circle
                    key={`ring-${ringIndex}`}
                    cx={`${group.x}%`}
                    cy={`${group.y}%`}
                    r={group.size * 0.2}
                    className={`${styles.animatedCircle} ${styles[ringClass]}`}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.4)"
                    strokeWidth="2"
                  />
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default AnimatedBackground;
