'use client';

import React, { useMemo } from 'react';
import ComponentShowcase from '../ComponentShowcase';
import ColorSwatch, { ColorDefinition } from '../ColorSwatch';
import styles from './ColorsTab.module.css';

interface ColorsTabProps {
  isActive: boolean;
}

// Xbox color palette - static constant
const XBOX_COLORS: ColorDefinition[] = [
  { name: 'Xbox Green', value: '#0CF700', description: 'Primary brand color, achievements' },
  { name: 'Green Dark', value: '#0aa500', description: 'Gradient end, hover states' },
  { name: 'Error Red', value: '#FD2525', description: 'Error states, destructive actions' },
  { name: 'Red Dark', value: '#d91f1f', description: 'Error gradient end' },
  { name: 'Info Blue', value: '#2F25FD', description: 'Informational states' },
  { name: 'Blue Dark', value: '#251dc8', description: 'Info gradient end' },
  { name: 'Warning Yellow', value: '#F4CC00', description: 'Warning states, caution' },
  { name: 'Yellow Dark', value: '#c9a700', description: 'Warning gradient end' },
  { name: 'Card Green', value: 'rgb(108 184 43 / 60%)', description: 'Dashboard card backgrounds' },
];

/**
 * ColorsTab - Color palette documentation
 * Memoized to prevent unnecessary re-renders
 */
function ColorsTab({ isActive }: ColorsTabProps) {
  const demoContent = useMemo(() => <ColorSwatch colors={XBOX_COLORS} columns={3} />, []);

  const sections = useMemo(
    () => [
      {
        title: 'Usage Guidelines',
        defaultOpen: true,
        children: (
          <div className={styles.guidelinesList}>
            <div className={styles.guideline}>
              <strong>Xbox Green (#0CF700):</strong> Primary brand color, use for success states, achievements, and
              active elements. High contrast on dark backgrounds.
            </div>
            <div className={styles.guideline}>
              <strong>Error Red (#FD2525):</strong> Destructive actions, error states, and warnings. Pair with dark
              red (#d91f1f) for gradients.
            </div>
            <div className={styles.guideline}>
              <strong>Info Blue (#2F25FD):</strong> Informational states, links, and neutral actions. High visibility
              without urgency.
            </div>
            <div className={styles.guideline}>
              <strong>Warning Yellow (#F4CC00):</strong> Caution states, pending actions, and alerts. Use sparingly
              for maximum impact.
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
        name="Color Palette"
        description="Xbox-themed color system with semantic meanings. Includes gradients, opacity variants, and accessibility-conscious contrast ratios."
        demo={demoContent}
        sections={sections}
      />
    </div>
  );
}

export default React.memo(ColorsTab);
