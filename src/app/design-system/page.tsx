'use client';

import React, { useState, lazy, Suspense } from 'react';
import PageLayout from '@/components/PageLayout/PageLayout';
import SegmentedControl, { SegmentedControlOption } from './_components/SegmentedControl';
import styles from './DesignSystem.module.css';

// Lazy load tab components for code splitting
const ToastTab = lazy(() => import('./_components/tabs/ToastTab'));
const CardTab = lazy(() => import('./_components/tabs/CardTab'));
const ButtonTab = lazy(() => import('./_components/tabs/ButtonTab'));
const ColorsTab = lazy(() => import('./_components/tabs/ColorsTab'));

// Component navigation options - stable constant
const COMPONENT_OPTIONS: SegmentedControlOption[] = [
  { value: 'toast', label: 'Toast', icon: '🔔' },
  { value: 'card', label: 'Xbox Card', icon: '🎴' },
  { value: 'button', label: 'Help Button', icon: '❓' },
  { value: 'colors', label: 'Colors', icon: '🎨' },
];

// Loading fallback component
function TabLoadingFallback() {
  return (
    <div className={styles.placeholderDemo}>
      <p>Loading component...</p>
    </div>
  );
}

/**
 * Design System Showcase Page
 * Interactive documentation with lazy-loaded tab components for optimal performance
 */
export default function DesignSystemPage() {
  const [selectedComponent, setSelectedComponent] = useState('toast');

  return (
    <PageLayout title="Design System" size="wide" variant="windowed">
      <PageLayout.Header />
      <PageLayout.Body>
        <div className={styles.container}>
          {/* Component Navigation */}
          <div className={styles.navigationContainer}>
            <SegmentedControl options={COMPONENT_OPTIONS} value={selectedComponent} onChange={setSelectedComponent} />
          </div>

          {/* Connected Content Area - All tabs stay mounted for instant switching */}
          <div className={styles.contentArea}>
            <Suspense fallback={<TabLoadingFallback />}>
              <ToastTab isActive={selectedComponent === 'toast'} />
              <CardTab isActive={selectedComponent === 'card'} />
              <ButtonTab isActive={selectedComponent === 'button'} />
              <ColorsTab isActive={selectedComponent === 'colors'} />
            </Suspense>
          </div>
        </div>
      </PageLayout.Body>
    </PageLayout>
  );
}
