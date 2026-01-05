'use client';

import React from 'react';
import styles from './SegmentedControl.module.css';

export interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * SegmentedControl - Tabbed navigation with beveled, embossed design
 */
export default function SegmentedControl({
  options,
  value,
  onChange,
  className = '',
}: SegmentedControlProps) {
  const activeIndex = options.findIndex((opt) => opt.value === value);

  return (
    <div className={`${styles.container} ${className}`}>
      <div
        className={styles.track}
        style={{ '--segment-count': options.length } as React.CSSProperties}
      >
        {/* Active indicator - positioned via CSS calc based on active index */}
        <div
          className={styles.indicator}
          style={{ '--active-index': activeIndex } as React.CSSProperties}
        />

        {/* Option buttons */}
        {options.map((option) => (
          <button
            key={option.value}
            className={`${styles.option} ${value === option.value ? styles.active : ''}`}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {option.icon && <span className={styles.icon} aria-hidden="true">{option.icon}</span>}
            <span className={styles.label}>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
