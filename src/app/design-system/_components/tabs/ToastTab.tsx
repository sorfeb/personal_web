'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/useToast';
import { createAchievementToast, createSystemToast } from '@/utils/toastUtils';
import ComponentShowcase from '../ComponentShowcase';
import PropsTable, { PropDefinition } from '../PropsTable';
import CodeBlock from '../CodeBlock';
import styles from '../../DesignSystem.module.css';

interface ToastTabProps {
  isActive: boolean;
}

// Static data - defined outside component to prevent re-creation
const TOAST_PROPS: PropDefinition[] = [
  { name: 'type', type: "'achievement' | 'system'", required: true, description: 'Toast notification type' },
  { name: 'badge', type: 'BadgeConfig', required: true, description: 'Badge icon and ring color configuration' },
  { name: 'title', type: 'string', required: true, description: 'Primary toast title text' },
  { name: 'subtitle', type: 'string', description: 'Optional subtitle/description text' },
  { name: 'duration', type: 'number', defaultValue: '4000', description: 'Display duration in milliseconds' },
  { name: 'showProgressBar', type: 'boolean', defaultValue: 'false', description: 'Show animated progress bar' },
];

const USAGE_CODE = `import { useToast } from '@/hooks/useToast';
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
}`;

/**
 * ToastTab - Toast notification component documentation
 * Memoized to prevent unnecessary re-renders
 */
function ToastTab({ isActive }: ToastTabProps) {
  const { showToast, dismissToast, toasts } = useToast();
  const [customDuration, setCustomDuration] = useState(4000);
  const [showProgress, setShowProgress] = useState(false);

  // Memoize all event handlers to prevent child re-renders
  const handleAchievement = useCallback(() => {
    showToast(
      createAchievementToast(
        'Achievement unlocked',
        '15G – Design System Explorer',
        '/favicon.svg',
        customDuration
      )
    );
  }, [showToast, customDuration]);

  const handleSuccess = useCallback(() => {
    showToast(createSystemToast('Component loaded successfully', 'success', undefined, customDuration));
  }, [showToast, customDuration]);

  const handleError = useCallback(() => {
    showToast(createSystemToast('Failed to load component', 'error', undefined, customDuration));
  }, [showToast, customDuration]);

  const handleInfo = useCallback(() => {
    showToast(createSystemToast('Design system updated', 'info', undefined, customDuration));
  }, [showToast, customDuration]);

  const handleWarning = useCallback(() => {
    showToast(createSystemToast('Deprecated component detected', 'warning', undefined, customDuration));
  }, [showToast, customDuration]);

  // Memoize demo JSX
  const demoContent = useMemo(
    () => (
      <div className={styles.demoButtonGrid}>
        <button onClick={handleAchievement} className={`${styles.demoButton} ${styles.buttonAchievement}`}>
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
    ),
    [handleAchievement, handleSuccess, handleError, handleInfo, handleWarning]
  );

  // Memoize controls JSX
  const controlsContent = useMemo(
    () => (
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
    ),
    [customDuration, showProgress]
  );

  // Memoize active toasts section
  const activeToastsContent = useMemo(
    () =>
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
    [toasts, dismissToast]
  );

  // Memoize sections array
  const sections = useMemo(
    () => [
      {
        title: 'Props',
        defaultOpen: true,
        children: <PropsTable props={TOAST_PROPS} />,
      },
      {
        title: 'Usage Example',
        children: <CodeBlock language="tsx" code={USAGE_CODE} />,
      },
      {
        title: 'Active Toasts',
        children: activeToastsContent,
      },
    ],
    [activeToastsContent]
  );

  return (
    <div className={styles.tabPanel} data-hidden={!isActive}>
      <ComponentShowcase
        name="ToastNotification"
        description="Xbox 360-style achievement notifications with ring blinking animations, badge crossfade effects, and audio feedback. Appears in lower third with immersive entrance/exit sequences."
        demo={demoContent}
        controls={controlsContent}
        sections={sections}
      />
    </div>
  );
}

// Memoize the entire component
export default React.memo(ToastTab);
