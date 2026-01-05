'use client';

import React, { useState, lazy, Suspense } from 'react';
import { Type, Palette, Bell, SquareStack, HelpCircle } from 'lucide-react';
import PageLayout from '@/components/PageLayout/PageLayout';
import SegmentedControl, { SegmentedControlOption } from './_components/SegmentedControl';
import styles from './DesignSystem.module.css';

// Lazy load tab components for code splitting
const ToastTab = lazy(() => import('./_components/tabs/ToastTab'));
const CardTab = lazy(() => import('./_components/tabs/CardTab'));
const ButtonTab = lazy(() => import('./_components/tabs/ButtonTab'));
const ColorsTab = lazy(() => import('./_components/tabs/ColorsTab'));
const TypographyTab = lazy(() => import('./_components/tabs/TypographyTab'));

// Component navigation options - stable constant
const COMPONENT_OPTIONS: SegmentedControlOption[] = [
  { value: 'typography', label: 'Typography', icon: <Type size={18} /> },
  { value: 'colors', label: 'Colors', icon: <Palette size={18} /> },
  { value: 'toast', label: 'Toast', icon: <Bell size={18} /> },
  { value: 'card', label: 'Xbox Card', icon: <SquareStack size={18} /> },
  { value: 'button', label: 'Help Button', icon: <HelpCircle size={18} /> },
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
  const [selectedComponent, setSelectedComponent] = useState('typography');

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
              <TypographyTab isActive={selectedComponent === 'typography'} />
              <ColorsTab isActive={selectedComponent === 'colors'} />
              <ToastTab isActive={selectedComponent === 'toast'} />
              <CardTab isActive={selectedComponent === 'card'} />
              <ButtonTab isActive={selectedComponent === 'button'} />
            </Suspense>
          </div>
        </div>
      </PageLayout.Body>
    </PageLayout>
  );
}
