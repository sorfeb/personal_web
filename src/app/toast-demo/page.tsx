'use client';

import React, { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { useAchievements } from '@/hooks/useAchievements';
import { TOTAL_GAMERSCORE, ACHIEVEMENTS } from '@/constants/achievements';
import { createAchievementToast, createSystemToast } from '@/utils/toastUtils';
import styles from './ToastDemo.module.css';

/**
 * Demo page showing toast notification usage with comprehensive controls
 * Allows testing all toast states: appearance, persistence, and exit
 */
export default function ToastDemoPage() {
  const { showToast, dismissToast, toasts } = useToast();
  const { unlock, unlockedIds, localGamerscore, reset } = useAchievements();
  const [lastToastId, setLastToastId] = useState<string | null>(null);
  const [customDuration, setCustomDuration] = useState(4000);
  const [showProgress, setShowProgress] = useState(false);

  // Achievement toast
  const handleAchievement = () => {
    const id = showToast(
      createAchievementToast(
        'Achievement unlocked',
        '15G – Explorer Badge',
        '/favicon.svg',
        customDuration
      )
    );
    setLastToastId(id);
  };

  // System toasts with different statuses
  const handleSuccess = () => {
    const id = showToast(createSystemToast('Profile updated successfully', 'success', undefined, customDuration));
    setLastToastId(id);
  };

  const handleError = () => {
    const id = showToast(createSystemToast('Connection failed', 'error', undefined, customDuration));
    setLastToastId(id);
  };

  const handleInfo = () => {
    const id = showToast(createSystemToast('New message received', 'info', undefined, customDuration));
    setLastToastId(id);
  };

  const handleWarning = () => {
    const id = showToast(createSystemToast('Storage almost full', 'warning', undefined, customDuration));
    setLastToastId(id);
  };

  // Persistent toast (very long duration)
  const handlePersistent = () => {
    const id = showToast({
      type: 'system',
      badge: {
        primaryIcon: '/favicon.svg',
        ringColor: 'info',
      },
      title: 'Persistent notification',
      subtitle: 'This will stay for 30 seconds',
      duration: 30000,
      showProgressBar: true,
    });
    setLastToastId(id);
  };

  // Custom toast with progress bar
  const handleCustomWithProgress = () => {
    const id = showToast({
      type: 'system',
      badge: {
        primaryIcon: '/favicon.svg',
        ringColor: 'info',
      },
      title: 'Custom notification',
      subtitle: 'With progress bar countdown',
      duration: customDuration,
      showProgressBar: showProgress,
    });
    setLastToastId(id);
  };

  // Long text test
  const handleLongText = () => {
    const id = showToast({
      type: 'achievement',
      badge: {
        primaryIcon: '/favicon.svg',
        secondaryIcon: '/favicon.svg',
        ringColor: 'success',
      },
      title: 'This is a very long title that will be truncated if it exceeds the maximum character limit',
      subtitle: 'And this is an extremely long subtitle that describes something in excessive detail and should also be truncated appropriately to prevent UI overflow issues',
      duration: customDuration,
      showProgressBar: true,
    });
    setLastToastId(id);
  };

  // Multi-toast test (queue)
  const handleMultipleToasts = () => {
    showToast(createSystemToast('First toast', 'info', undefined, 8000));
    setTimeout(() => {
      showToast(createSystemToast('Second toast', 'success', undefined, 8000));
    }, 500);
    setTimeout(() => {
      showToast(createSystemToast('Third toast', 'warning', undefined, 8000));
    }, 1000);
  };

  // Manual dismiss last toast
  const handleDismissLast = () => {
    if (lastToastId) {
      dismissToast(lastToastId);
      setLastToastId(null);
    }
  };

  // Dismiss all toasts
  const handleDismissAll = () => {
    toasts.forEach(toast => dismissToast(toast.id));
    setLastToastId(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Toast Notification Design Lab</h1>
        <p className={styles.description}>
          Comprehensive controls to test all toast appearances, persistence, and exit behaviors
        </p>

        {/* Status Section */}
        <div className={styles.statusSection}>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Active Toasts:</span>
            <span className={styles.statusValue}>{toasts.length}</span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Last Toast ID:</span>
            <span className={styles.statusValue}>{lastToastId ? lastToastId.substring(0, 20) + '...' : 'None'}</span>
          </div>
        </div>

        {/* Configuration Controls */}
        <div className={styles.controlsSection}>
          <h2 className={styles.sectionTitle}>⚙️ Configuration</h2>
          
          <div className={styles.controlGroup}>
            <label htmlFor="duration" className={styles.label}>
              Duration: {customDuration}ms ({(customDuration / 1000).toFixed(1)}s)
            </label>
            <input
              id="duration"
              type="range"
              min="1000"
              max="30000"
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

        {/* Toast Appearance Tests */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>🎨 Appearance Tests</h2>
          <div className={styles.buttonGrid}>
            <button onClick={handleAchievement} className={styles.buttonAchievement}>
              🏆 Achievement
            </button>
            
            <button onClick={handleSuccess} className={styles.buttonSuccess}>
              ✓ Success
            </button>
            
            <button onClick={handleError} className={styles.buttonError}>
              ✕ Error
            </button>
            
            <button onClick={handleInfo} className={styles.buttonInfo}>
              ℹ Info
            </button>
            
            <button onClick={handleWarning} className={styles.buttonWarning}>
              ⚠ Warning
            </button>
            
            <button onClick={handleCustomWithProgress} className={styles.buttonCustom}>
              ⚙ Custom Config
            </button>
          </div>
        </div>

        {/* Persistence Tests */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>⏱️ Persistence Tests</h2>
          <div className={styles.buttonGrid}>
            <button onClick={handlePersistent} className={styles.buttonInfo}>
              📌 Persistent (30s)
            </button>
            
            <button onClick={handleLongText} className={styles.buttonWarning}>
              📝 Long Text
            </button>
            
            <button onClick={handleMultipleToasts} className={styles.buttonCustom}>
              🎯 Queue Test (3x)
            </button>
          </div>
        </div>

        {/* Achievement Engine QA */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>🏆 Achievement Engine ({localGamerscore}/{TOTAL_GAMERSCORE}G · {unlockedIds.length}/{ACHIEVEMENTS.length})</h2>
          <div className={styles.buttonGrid}>
            <button
              onClick={() => unlock('scanline-purist')}
              className={styles.buttonAchievement}
            >
              🔓 Unlock Test (scanline-purist)
            </button>

            <button
              onClick={() => unlock('completionist')}
              className={styles.buttonAchievement}
            >
              🔓 Unlock Test (completionist)
            </button>

            <button onClick={reset} className={styles.buttonDanger}>
              ♻️ Reset All Progress
            </button>
          </div>
        </div>

        {/* Exit Controls */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>🚪 Exit Controls</h2>
          <div className={styles.buttonGrid}>
            <button 
              onClick={handleDismissLast} 
              className={styles.buttonDanger}
              disabled={!lastToastId}
            >
              ❌ Dismiss Last
            </button>
            
            <button 
              onClick={handleDismissAll} 
              className={styles.buttonDanger}
              disabled={toasts.length === 0}
            >
              🗑️ Dismiss All ({toasts.length})
            </button>
          </div>
        </div>

        {/* Active Toasts List */}
        {toasts.length > 0 && (
          <div className={styles.activeToastsSection}>
            <h2 className={styles.sectionTitle}>📋 Active Toasts</h2>
            <div className={styles.toastList}>
              {toasts.map((toast, index) => (
                <div key={toast.id} className={styles.toastListItem}>
                  <div className={styles.toastInfo}>
                    <span className={styles.toastIndex}>#{index + 1}</span>
                    <span className={styles.toastTitle}>{toast.title}</span>
                    <span className={styles.toastType} data-type={toast.type}>
                      {toast.type}
                    </span>
                    <span className={styles.toastRing} data-ring={toast.badge.ringColor}>
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

        <div className={styles.note}>
          <p>
            <strong>💡 Tips:</strong> Adjust duration with the slider, toggle progress bar, and test different combinations. 
            Watch the animations for entrance (250ms fade-in), active state, and exit sequence (500ms collapse). 
            Max 3 toasts can be queued simultaneously.
          </p>
        </div>
      </div>
    </div>
  );
}
