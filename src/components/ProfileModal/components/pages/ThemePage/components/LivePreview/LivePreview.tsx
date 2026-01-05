'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { BASE_IMAGE_OPTIONS } from '../../data/layerOptions';
import type { AnimationLayerId } from '../../../../../../../components/Background/types';
import styles from './LivePreview.module.css';

interface LivePreviewProps {
  /** Selected base image ID */
  baseImageId: string;
  /** Animation layer states */
  animationStates: Record<AnimationLayerId, boolean>;
}

/**
 * LivePreview
 *
 * Miniature preview of the combined background layers.
 * Shows base image with enabled animation overlays.
 */
const LivePreview: React.FC<LivePreviewProps> = ({
  baseImageId,
  animationStates,
}) => {
  // Find the selected base image
  const baseImage = BASE_IMAGE_OPTIONS.find((img) => img.id === baseImageId);
  const imageSrc = baseImage?.fullImage || BASE_IMAGE_OPTIONS[0]?.fullImage || '';

  const circleRipplesEnabled = animationStates['circle-ripples'] ?? false;
  const waterRipplesEnabled = animationStates['water-ripples'] ?? false;

  return (
    <div className={styles.container}>
      <span className={styles.label}>Preview</span>

      <div className={styles.frame}>
        <div className={styles.preview}>
          {/* Base image layer */}
          <div className={styles.baseLayer}>
            {imageSrc && (
              <Image
                src={imageSrc}
                alt="Background preview"
                fill
                sizes="500px"
                className={styles.baseImage}
                priority
              />
            )}
          </div>

          {/* Animation layers - contained preview versions */}
          <div className={styles.animationLayers}>
            {/* Circle Ripples preview */}
            {circleRipplesEnabled && (
              <div className={styles.circleRipplesLayer}>
                <svg className={styles.circleRipplesSvg} xmlns="http://www.w3.org/2000/svg">
                  {/* Preview circles in similar positions to real component */}
                  {[
                    { x: 85, y: 30, delay: 0 },
                    { x: 78, y: 25, delay: 0.5 },
                    { x: 15, y: 75, delay: 1 },
                    { x: 25, y: 85, delay: 1.5 },
                    { x: 65, y: 50, delay: 2 },
                  ].map((group, idx) => (
                    <g key={`group-${idx}`}>
                      {[0, 1, 2, 3].map((ringIndex) => (
                        <circle
                          key={`ring-${ringIndex}`}
                          cx={`${group.x}%`}
                          cy={`${group.y}%`}
                          r={8}
                          className={`${styles.animatedCircle} ${styles[`ring${ringIndex}`]}`}
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.3)"
                          strokeWidth="1"
                          style={{ animationDelay: `${group.delay + ringIndex * 0.3}s` }}
                        />
                      ))}
                    </g>
                  ))}
                </svg>
              </div>
            )}

            {/* Water Ripples preview */}
            {waterRipplesEnabled && (
              <div className={styles.waterRipplesLayer}>
                <div className={styles.waterEffect} />
                <div className={styles.waterEffect} />
                <div className={styles.waterEffect} />
              </div>
            )}
          </div>

          {/* Visual effects overlays */}
          <div className={styles.scanlines} />
          <div className={styles.reflection} />

          {/* Live status indicator */}
          <div className={styles.status}>
            <span className={styles.statusDot} />
            <span className={styles.statusText}>Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(LivePreview);
