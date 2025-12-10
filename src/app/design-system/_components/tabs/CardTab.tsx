'use client';

import React, { useMemo } from 'react';
import ComponentShowcase from '../ComponentShowcase';
import styles from '../../DesignSystem.module.css';

interface CardTabProps {
  isActive: boolean;
}

/**
 * CardTab - Xbox Card component documentation
 * Memoized to prevent unnecessary re-renders
 */
function CardTab({ isActive }: CardTabProps) {
  const demoContent = useMemo(
    () => (
      <div className={styles.placeholderDemo}>
        <p>Card interactive demo coming soon...</p>
      </div>
    ),
    []
  );

  const sections = useMemo(
    () => [
      {
        title: 'Design Specs',
        defaultOpen: true,
        children: (
          <div className={styles.specsList}>
            <div className={styles.specItem}>
              <strong>Border Radius:</strong> 16px
            </div>
            <div className={styles.specItem}>
              <strong>Hover Transform:</strong> translateY(-8px) scale(1.02)
            </div>
            <div className={styles.specItem}>
              <strong>Transition:</strong> 0.5s ease
            </div>
            <div className={styles.specItem}>
              <strong>Reflection:</strong> -webkit-box-reflect with gradient mask
            </div>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className={styles.tabPanel} data-hidden={!isActive}>
      <ComponentShowcase
        name="XboxCard"
        description="Dashboard cards with gradient backgrounds, reflection effects, hover animations, and stacking transitions. Core building block of the Xbox 360 interface."
        demo={demoContent}
        sections={sections}
      />
    </div>
  );
}

export default React.memo(CardTab);
