'use client';

import React from 'react';
import { useToast } from '@/hooks/useToast';
import { createAchievementToast, createSystemToast } from '@/utils/toastUtils';
import styles from './ToastDemo.module.css';

/**
 * Demo page showing toast notification usage
 * Remove this file if not needed - it's just for testing
 */
export default function ToastDemoPage() {
  const { showToast } = useToast();

  const handleAchievement = () => {
    showToast(
      createAchievementToast(
        'Achievement unlocked',
        '15G – Explorer Badge',
        '/assets/icons/dashboard/trophy.svg',
        5000
      )
    );
  };

  const handleSuccess = () => {
    showToast(createSystemToast('Profile updated successfully', 'success'));
  };

  const handleError = () => {
    showToast(createSystemToast('Connection failed', 'error'));
  };

  const handleInfo = () => {
    showToast(createSystemToast('New message received', 'info'));
  };

  const handleWarning = () => {
    showToast(createSystemToast('Storage almost full', 'warning'));
  };

  const handleCustom = () => {
    showToast({
      type: 'system',
      badge: {
        primaryIcon: '/assets/icons/dashboard/info-circle.svg',
        ringColor: 'info',
      },
      title: 'Custom notification',
      subtitle: 'This is a custom toast with progress bar',
      duration: 6000,
      showProgressBar: true,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Toast Notification Demo</h1>
        <p className={styles.description}>
          Click the buttons below to test different toast notification styles
        </p>

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
          
          <button onClick={handleCustom} className={styles.buttonCustom}>
            ⚙ Custom
          </button>
        </div>

        <div className={styles.note}>
          <p>
            <strong>Note:</strong> This is a demo page. Remove <code>src/app/toast-demo</code> folder if not needed.
          </p>
        </div>
      </div>
    </div>
  );
}
