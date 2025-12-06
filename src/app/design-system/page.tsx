'use client';

import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout/PageLayout';
import { useToast } from '@/hooks/useToast';
import { createAchievementToast, createSystemToast } from '@/utils/toastUtils';
import styles from './DesignSystem.module.css';

/**
 * Design System Showcase Page
 * Demonstrates UI interactions, animations, and components used across the portfolio
 */
export default function DesignSystemPage() {
  const { showToast, dismissToast, toasts } = useToast();
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
    <PageLayout
      title="Design System"
      variant="windowed"
    >
      <div className={styles.container}>
        {/* Toast Notifications Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🔔 Toast Notifications</h2>
          <p className={styles.sectionDescription}>
            Xbox 360-style achievement notifications with ring blinking animations and icon crossfades
          </p>

          {/* Configuration Controls */}
          <div className={styles.controlsCard}>
            <h3 className={styles.cardTitle}>Configuration</h3>
            
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

          {/* Toast Triggers */}
          <div className={styles.demoCard}>
            <div className={styles.buttonGrid}>
              <button onClick={handleAchievement} className={`${styles.demoButton} ${styles.buttonAchievement}`}>
                <span className={styles.buttonIcon}>🏆</span>
                Achievement
              </button>
              
              <button onClick={handleSuccess} className={`${styles.demoButton} ${styles.buttonSuccess}`}>
                <span className={styles.buttonIcon}>✓</span>
                Success
              </button>
              
              <button onClick={handleError} className={`${styles.demoButton} ${styles.buttonError}`}>
                <span className={styles.buttonIcon}>✕</span>
                Error
              </button>
              
              <button onClick={handleInfo} className={`${styles.demoButton} ${styles.buttonInfo}`}>
                <span className={styles.buttonIcon}>ℹ</span>
                Info
              </button>
              
              <button onClick={handleWarning} className={`${styles.demoButton} ${styles.buttonWarning}`}>
                <span className={styles.buttonIcon}>⚠</span>
                Warning
              </button>
            </div>
          </div>

          {/* Active Toasts List */}
          {toasts.length > 0 && (
            <div className={styles.activeToastsCard}>
              <h3 className={styles.cardTitle}>Active Toasts ({toasts.length}/3)</h3>
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
                    <button
                      onClick={() => dismissToast(toast.id)}
                      className={styles.dismissButton}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Cards Section (Placeholder) */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🎴 Xbox Cards</h2>
          <p className={styles.sectionDescription}>
            Interactive dashboard cards with stacking animations and hover effects
          </p>
          <div className={styles.placeholderCard}>
            <p className={styles.placeholderText}>Card demos coming soon...</p>
          </div>
        </section>

        {/* Audio Section (Placeholder) */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🔊 Audio System</h2>
          <p className={styles.sectionDescription}>
            PS2/Xbox audio feedback with volume control and audio pooling
          </p>
          <div className={styles.placeholderCard}>
            <p className={styles.placeholderText}>Audio demos coming soon...</p>
          </div>
        </section>

        {/* Animations Section (Placeholder) */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>✨ Animations</h2>
          <p className={styles.sectionDescription}>
            CSS transitions, transforms, and keyframe animations
          </p>
          <div className={styles.placeholderCard}>
            <p className={styles.placeholderText}>Animation demos coming soon...</p>
          </div>
        </section>

        {/* Info Note */}
        <div className={styles.infoNote}>
          <p>
            <strong>💡 About:</strong> This design system is built with CSS Modules, TypeScript, and React 18. 
            All components follow Xbox 360 aesthetic with retro gaming vibes. Components are modular, 
            accessible, and optimized for both desktop and mobile experiences.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
