'use client';

import React, { useMemo } from 'react';
import ComponentShowcase from '../ComponentShowcase';
import styles from './ButtonTab.module.css';

interface ButtonTabProps {
  isActive: boolean;
}

/**
 * ButtonTab - Help Button component documentation
 * Memoized to prevent unnecessary re-renders
 */
function ButtonTab({ isActive }: ButtonTabProps) {
  const demoContent = useMemo(
    () => (
      <div className={styles.placeholderDemo}>
        <p>Button interactive demo coming soon...</p>
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
              <strong>Size:</strong> 60px diameter
            </div>
            <div className={styles.specItem}>
              <strong>Glow Animation:</strong> 3s infinite pulse
            </div>
            <div className={styles.specItem}>
              <strong>Hover Scale:</strong> 1.1x
            </div>
            <div className={styles.specItem}>
              <strong>Box Shadow:</strong> Layered with green glow
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
        name="HelpButton"
        description="Circular glossy button with 3D sphere appearance, glow animation, and hover scaling. Uses radial gradients for beveled effect."
        demo={demoContent}
        sections={sections}
      />
    </div>
  );
}

export default React.memo(ButtonTab);
