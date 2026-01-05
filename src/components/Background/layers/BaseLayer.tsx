'use client';

import React from 'react';
import styles from './BaseLayer.module.css';

interface BaseLayerProps {
  imagePath: string;
  alt?: string;
}

/**
 * BaseLayer - Static background image layer
 *
 * Renders a fixed, full-screen background image as the base layer
 * for the layered background system.
 */
const BaseLayer: React.FC<BaseLayerProps> = ({ imagePath, alt = 'Background' }) => {
  return (
    <div
      className={styles.baseLayer}
      style={{ backgroundImage: `url(${imagePath})` }}
      role="img"
      aria-label={alt}
    />
  );
};

export default BaseLayer;
