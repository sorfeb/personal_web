'use client';

import { useEffect } from 'react';
import type { AnimationLayerProps } from '../../types';

declare global {
  interface JQuery {
    ripples(options?: Record<string, unknown>): JQuery;
    ripples(method: string, ...args: unknown[]): unknown;
  }
}

/**
 * WaterRipples Animation Layer
 *
 * Interactive water ripple effect using jQuery Ripples.
 * Creates WebGL-based water surface simulation.
 *
 * This layer applies ripples to the .crt container element in the DOM,
 * which wraps all page content. This is required because jQuery Ripples
 * needs to wrap content to create the water distortion effect.
 *
 * Features:
 * - Interactive ripples on mouse/touch
 * - Automatic rain drop animation
 * - Performance optimized (only runs on home page)
 */
const WaterRipples: React.FC<AnimationLayerProps> = ({ enabled, isHomePage }) => {
  // effect:audited — async jQuery Ripples init with dynamic imports,
  // rain-drop interval, and destroy-on-cleanup sequencing. Converting this
  // to the approved hooks would require replicating the promise chain and
  // ordering guarantees inline; kept as useEffect deliberately.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Skip initialization if disabled or not on home page
    if (!enabled || !isHomePage) return;

    // Target the .crt container which wraps all content
    const crtContainer = document.querySelector('.crt') as HTMLElement | null;
    if (!crtContainer) {
      console.warn('WaterRipples: .crt container not found');
      return;
    }

    let rainInterval: NodeJS.Timeout;

    Promise.all([import('jquery'), import('jquery.ripples')])
      .then(([{ default: $ }]) => {
        $(crtContainer).ripples({
          resolution: 256,
          dropRadius: 20,
          perturbance: 0.04,
          interactive: true,
        });

        const createRainDrop = () => {
          const x = Math.random() * crtContainer.clientWidth;
          const y = Math.random() * crtContainer.clientHeight;
          $(crtContainer).ripples('drop', x, y, 20, 0.04 + Math.random() * 0.04);
        };

        rainInterval = setInterval(createRainDrop, 300);
      })
      .catch((err) => {
        console.error('Error loading jQuery Ripples:', err);
      });

    return () => {
      if (rainInterval) {
        clearInterval(rainInterval);
      }
      import('jquery')
        .then(({ default: $ }) => {
          try {
            $(crtContainer).ripples('destroy');
          } catch {
            // Ignore cleanup errors
          }
        })
        .catch(() => {
          // Ignore cleanup errors
        });
    };
  }, [enabled, isHomePage]);

  // This component doesn't render anything - it applies effects to .crt container
  return null;
};

export default WaterRipples;
