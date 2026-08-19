'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { useToastContext } from '../../context/ToastContext';
import { useIsMounted } from '@/hooks';
import ToastNotification from './ToastNotification';
import styles from './ToastContainer.module.css';

/**
 * Global container for rendering toast notifications
 * Uses React portal for DOM isolation and owns toast placement and stacking
 */
export default function ToastContainer() {
  const { toasts } = useToastContext();
  const mounted = useIsMounted();

  if (!mounted || toasts.length === 0) {
    return null;
  }

  return createPortal(
    <div className={styles.toastStack}>
      {toasts.map((toast) => (
        <ToastNotification key={toast.id} {...toast} />
      ))}
    </div>,
    document.body
  );
}
