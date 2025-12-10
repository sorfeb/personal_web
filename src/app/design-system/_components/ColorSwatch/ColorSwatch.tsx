'use client';

import React, { useState } from 'react';
import styles from './ColorSwatch.module.css';

export interface ColorDefinition {
  name: string;
  value: string;
  description?: string;
}

interface ColorSwatchProps {
  colors: ColorDefinition[];
  columns?: number;
  className?: string;
}

/**
 * ColorSwatch - Display color palette with hex codes and copy functionality
 * Shows color preview, name, hex value, and optional description
 */
export default function ColorSwatch({ colors, columns = 3, className = '' }: ColorSwatchProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleCopy = async (colorValue: string) => {
    try {
      await navigator.clipboard.writeText(colorValue);
      setCopiedColor(colorValue);
      setTimeout(() => setCopiedColor(null), 1500);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  return (
    <div
      className={`${styles.grid} ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {colors.map((color) => (
        <button
          key={color.name}
          className={styles.swatch}
          onClick={() => handleCopy(color.value)}
          type="button"
          title={`Copy ${color.value}`}
        >
          <div
            className={styles.colorPreview}
            style={{ background: color.value }}
          >
            {copiedColor === color.value && (
              <span className={styles.copiedIndicator}>✓</span>
            )}
          </div>
          <div className={styles.colorInfo}>
            <span className={styles.colorName}>{color.name}</span>
            <span className={styles.colorValue}>{color.value}</span>
            {color.description && (
              <span className={styles.colorDescription}>{color.description}</span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
