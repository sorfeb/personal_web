'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { useToastContext } from '../../context/ToastContext';
import ToastNotification from './ToastNotification';
import styles from './ToastContainer.module.css';

/**
 * Global container for rendering toast notifications
 * Uses React portal for DOM isolation
 */
export default function ToastContainer() {
  const { toasts } = useToastContext();
  const [mounted, setMounted] = React.useState(false);

  // Client-side only rendering
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || globalThis.window === undefined) {
    return null;
  }

  // Don't render portal if no toasts
  if (toasts.length === 0) {
    return null;
  }

  return createPortal(
    <div className={styles.toastStack}>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className={styles.toastItem}
          data-index={index}
        >
          <ToastNotification {...toast} />
        </div>
      ))}
    </div>,
    document.body
  );
}
