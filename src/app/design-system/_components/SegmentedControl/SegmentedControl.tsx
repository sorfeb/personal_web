'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './SegmentedControl.module.css';

export interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: string;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * SegmentedControl - Xbox-themed tabbed navigation with beveled, embossed design
 * Features smooth active indicator animation and horizontal scroll on mobile
 */
export default function SegmentedControl({
  options,
  value,
  onChange,
  className = '',
}: SegmentedControlProps) {
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Update active indicator position when value changes
  useEffect(() => {
    const activeButton = optionRefs.current.get(value);
    const track = containerRef.current?.querySelector(`.${styles.track}`);
    
    if (activeButton && track) {
      const trackRect = track.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      
      setIndicatorStyle({
        width: buttonRect.width,
        transform: `translateX(${buttonRect.left - trackRect.left - 4}px)`,
      });
    }
  }, [value]);

  return (
    <div className={`${styles.container} ${className}`} ref={containerRef}>
      <div className={styles.track}>
        {/* Active indicator with beveled effect */}
        <div className={styles.indicator} style={indicatorStyle} />

        {/* Option buttons */}
        {options.map((option) => (
          <button
            key={option.value}
            ref={(el) => {
              if (el) {
                optionRefs.current.set(option.value, el);
              }
            }}
            className={`${styles.option} ${value === option.value ? styles.active : ''}`}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {option.icon && <span className={styles.icon}>{option.icon}</span>}
            <span className={styles.label}>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
