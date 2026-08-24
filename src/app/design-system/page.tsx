'use client';

import React, { useState, lazy, Suspense } from 'react';
import { Type, Palette, Bell, SquareStack, HelpCircle } from 'lucide-react';
import PageLayout from '@/components/PageLayout/PageLayout';
import Tabs, { type TabItem } from '@/components/ui/Tabs';
import styles from './DesignSystem.module.css';

// Lazy load tab components for code splitting
const ToastTab = lazy(() => import('./_components/tabs/ToastTab'));
const CardTab = lazy(() => import('./_components/tabs/CardTab'));
const ButtonTab = lazy(() => import('./_components/tabs/ButtonTab'));
const ColorsTab = lazy(() => import('./_components/tabs/ColorsTab'));
const TypographyTab = lazy(() => import('./_components/tabs/TypographyTab'));

// Component navigation options - stable constant
const COMPONENT_ITEMS: readonly TabItem[] = [
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
 *
 * Uses the shared ui/Tabs primitive rather than a page-local control, so the
 * page that documents the conventions also follows them.
 *
 * Each panel mounts only while it is active, which is what the lazy() imports
 * were always for: the chunk loads on first visit to that tab instead of all
 * five loading up front. `isActive` stays on the tab components because they
 * each still use it to gate their own content.
 */
export default function DesignSystemPage() {
  const [selectedComponent, setSelectedComponent] = useState('typography');

  return (
    <PageLayout title="Design System" size="wide" variant="windowed">
      <PageLayout.Header />
      <PageLayout.Body>
        <div className={styles.container}>
          <Tabs
            items={COMPONENT_ITEMS}
            value={selectedComponent}
            onChange={setSelectedComponent}
            label="Design system sections"
            variant="segmented"
            listClassName={styles.navigationContainer}
          >
            <div className={styles.contentArea}>
              <Suspense fallback={<TabLoadingFallback />}>
                <Tabs.Panel value="typography">
                  <TypographyTab isActive />
                </Tabs.Panel>
                <Tabs.Panel value="colors">
                  <ColorsTab isActive />
                </Tabs.Panel>
                <Tabs.Panel value="toast">
                  <ToastTab isActive />
                </Tabs.Panel>
                <Tabs.Panel value="card">
                  <CardTab isActive />
                </Tabs.Panel>
                <Tabs.Panel value="button">
                  <ButtonTab isActive />
                </Tabs.Panel>
              </Suspense>
            </div>
          </Tabs>
        </div>
      </PageLayout.Body>
    </PageLayout>
  );
}
