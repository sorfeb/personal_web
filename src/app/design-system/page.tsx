'use client';

import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout/PageLayout';
import { useToast } from '@/hooks/useToast';
import { createAchievementToast, createSystemToast } from '@/utils/toastUtils';
import SegmentedControl, { SegmentedControlOption } from './_components/SegmentedControl';
import ComponentShowcase from './_components/ComponentShowcase';
import PropsTable, { PropDefinition } from './_components/PropsTable';
import CodeBlock from './_components/CodeBlock';
import ColorSwatch, { ColorDefinition } from './_components/ColorSwatch';
import styles from './DesignSystem.module.css';

// Component navigation options
const componentOptions: SegmentedControlOption[] = [
  { value: 'toast', label: 'Toast', icon: '🔔' },
  { value: 'card', label: 'Xbox Card', icon: '🎴' },
  { value: 'button', label: 'Help Button', icon: '❓' },
  { value: 'colors', label: 'Colors', icon: '🎨' },
];

// Color palette definitions
const xboxColors: ColorDefinition[] = [
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

// Toast component props
const toastProps: PropDefinition[] = [
  { name: 'type', type: "'achievement' | 'system'", required: true, description: 'Toast notification type' },
  { name: 'badge', type: 'BadgeConfig', required: true, description: 'Badge icon and ring color configuration' },
  { name: 'title', type: 'string', required: true, description: 'Primary toast title text' },
  { name: 'subtitle', type: 'string', description: 'Optional subtitle/description text' },
  { name: 'duration', type: 'number', defaultValue: '4000', description: 'Display duration in milliseconds' },
  { name: 'showProgressBar', type: 'boolean', defaultValue: 'false', description: 'Show animated progress bar' },
];

/**
 * Design System Showcase Page
 * Interactive documentation for custom Xbox-themed React components
 */
export default function DesignSystemPage() {
  const { showToast, dismissToast, toasts } = useToast();
  const [selectedComponent, setSelectedComponent] = useState('toast');
  const [customDuration, setCustomDuration] = useState(4000);
  const [showProgress, setShowProgress] = useState(false);

  // Toast Notification Tests
  const handleAchievement = () => {
    showToast(
      createAchievementToast(
        'Achievement unlocked',
        '15G – Design System Explorer',
        '/favicon.svg',
        customDuration
      )
    );
  };

  const handleSuccess = () => {
    showToast(createSystemToast('Component loaded successfully', 'success', undefined, customDuration));
  };

  const handleError = () => {
    showToast(createSystemToast('Failed to load component', 'error', undefined, customDuration));
  };

  const handleInfo = () => {
    showToast(createSystemToast('Design system updated', 'info', undefined, customDuration));
  };

  const handleWarning = () => {
    showToast(createSystemToast('Deprecated component detected', 'warning', undefined, customDuration));
  };

  return (
    <PageLayout title="Design System" size="wide" variant="windowed">
      <PageLayout.Header />
      <PageLayout.Body>
        <div className={styles.container}>
          {/* Component Navigation */}
          <div className={styles.navigationContainer}>
            <SegmentedControl
              options={componentOptions}
              value={selectedComponent}
              onChange={setSelectedComponent}
            />
          </div>

          {/* Connected Content Area */}
          <div className={styles.contentArea}>
            {/* Toast Notification Component */}
            {selectedComponent === 'toast' && (
              <ComponentShowcase
                name="ToastNotification"
                description="Xbox 360-style achievement notifications with ring blinking animations, badge crossfade effects, and audio feedback. Appears in lower third with immersive entrance/exit sequences."
                demo={
                  <div className={styles.demoButtonGrid}>
                    <button
                      onClick={handleAchievement}
                      className={`${styles.demoButton} ${styles.buttonAchievement}`}
                    >
                      Achievement
                    </button>
                    <button onClick={handleSuccess} className={`${styles.demoButton} ${styles.buttonSuccess}`}>
                      Success
                    </button>
                    <button onClick={handleError} className={`${styles.demoButton} ${styles.buttonError}`}>
                      Error
                    </button>
                    <button onClick={handleInfo} className={`${styles.demoButton} ${styles.buttonInfo}`}>
                      Info
                    </button>
                    <button onClick={handleWarning} className={`${styles.demoButton} ${styles.buttonWarning}`}>
                      Warning
                    </button>
                  </div>
                }
                controls={
                  <div className={styles.controlsGrid}>
                    <div className={styles.controlGroup}>
                      <label htmlFor="duration" className={styles.label}>
                        Duration: {customDuration}ms ({(customDuration / 1000).toFixed(1)}s)
                      </label>
                      <input
                        id="duration"
                        type="range"
                        min="1000"
                        max="10000"
                        step="500"
                        value={customDuration}
                        onChange={(e) => setCustomDuration(Number(e.target.value))}
                        className={styles.slider}
                      />
                    </div>
                    <div className={styles.controlGroup}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={showProgress}
                          onChange={(e) => setShowProgress(e.target.checked)}
                          className={styles.checkbox}
                        />
                        Show Progress Bar
                      </label>
                    </div>
                  </div>
                }
                sections={[
                  {
                    title: 'Props',
                    defaultOpen: true,
                    children: <PropsTable props={toastProps} />,
                  },
                  {
                    title: 'Usage Example',
                    children: (
                      <CodeBlock
                        language="tsx"
                        code={`import { useToast } from '@/hooks/useToast';
import { createAchievementToast, createSystemToast } from '@/utils/toastUtils';

function MyComponent() {
  const { showToast } = useToast();

  const handleClick = () => {
    showToast(
      createAchievementToast(
        'Achievement unlocked',
        '15G – Design System Explorer',
        '/favicon.svg',
        4000
      )
    );
  };

  return <button onClick={handleClick}>Show Toast</button>;
}`}
                      />
                    ),
                  },
                  {
                    title: 'Active Toasts',
                    children:
                      toasts.length > 0 ? (
                        <div className={styles.toastList}>
                          {toasts.map((toast, index) => (
                            <div key={toast.id} className={styles.toastListItem}>
                              <div className={styles.toastInfo}>
                                <span className={styles.toastIndex}>#{index + 1}</span>
                                <span className={styles.toastTitle}>{toast.title}</span>
                                <span className={styles.toastBadge} data-ring={toast.badge.ringColor}>
                                  {toast.badge.ringColor}
                                </span>
                              </div>
                              <button onClick={() => dismissToast(toast.id)} className={styles.dismissButton}>
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className={styles.emptyState}>No active toasts. Click a button above to test!</p>
                      ),
                  },
                ]}
              />
            )}

            {/* Xbox Card Component */}
            {selectedComponent === 'card' && (
              <ComponentShowcase
                name="XboxCard"
                description="Dashboard cards with gradient backgrounds, reflection effects, hover animations, and stacking transitions. Core building block of the Xbox 360 interface."
                demo={
                  <div className={styles.placeholderDemo}>
                    <p>Card interactive demo coming soon...</p>
                  </div>
                }
                sections={[
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
                ]}
              />
            )}

            {/* Help Button Component */}
            {selectedComponent === 'button' && (
              <ComponentShowcase
                name="HelpButton"
                description="Circular glossy button with 3D sphere appearance, glow animation, and hover scaling. Uses radial gradients for beveled effect."
                demo={
                  <div className={styles.placeholderDemo}>
                    <p>Button interactive demo coming soon...</p>
                  </div>
                }
                sections={[
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
                ]}
              />
            )}

            {/* Color System */}
            {selectedComponent === 'colors' && (
              <ComponentShowcase
                name="Color Palette"
                description="Xbox-themed color system with semantic meanings. Includes gradients, opacity variants, and accessibility-conscious contrast ratios."
                demo={<ColorSwatch colors={xboxColors} columns={3} />}
                sections={[
                  {
                    title: 'Usage Guidelines',
                    defaultOpen: true,
                    children: (
                      <div className={styles.guidelinesList}>
                        <div className={styles.guideline}>
                          <strong>Xbox Green (#0CF700):</strong> Primary brand color, use for success states,
                          achievements, and active elements. High contrast on dark backgrounds.
                        </div>
                        <div className={styles.guideline}>
                          <strong>Error Red (#FD2525):</strong> Destructive actions, error states, and warnings.
                          Pair with dark red (#d91f1f) for gradients.
                        </div>
                        <div className={styles.guideline}>
                          <strong>Info Blue (#2F25FD):</strong> Informational states, links, and neutral actions.
                          High visibility without urgency.
                        </div>
                        <div className={styles.guideline}>
                          <strong>Warning Yellow (#F4CC00):</strong> Caution states, pending actions, and alerts.
                          Use sparingly for maximum impact.
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            )}
          </div>
        </div>
      </PageLayout.Body>
    </PageLayout>
  );
}
