'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { ToastConfig, ShowToastConfig, ToastContextValue } from '../components/ToastNotification/types';

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const MAX_TOASTS = 3;
let toastIdCounter = 0;

const generateToastId = (): string => {
  toastIdCounter += 1;
  return `toast-${Date.now()}-${toastIdCounter}`;
};

interface ToastProviderProps {
  readonly children: React.ReactNode;
}

/**
 * Global toast notification provider
 * Manages toast queue and lifecycle
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  /**
   * Remove toast from queue
   */
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /**
   * Show a new toast notification
   * Returns the toast ID for manual dismissal
   */
  const showToast = useCallback((config: ShowToastConfig): string => {
    const id = generateToastId();
    const handleDismiss = () => {
      removeToast(id);
      config.onDismiss?.();
    };

    const newToast: ToastConfig = {
      ...config,
      id,
      onDismiss: handleDismiss,
    };

    setToasts((prev) => {
      // Limit to MAX_TOASTS, remove oldest if necessary
      const updated = [...prev, newToast];
      return updated.length > MAX_TOASTS
        ? updated.slice(updated.length - MAX_TOASTS)
        : updated;
    });

    return id;
  }, [removeToast]);

  /**
   * Manually dismiss a toast by ID
   * Triggers exit animation before removal
   */
  const dismissToast = useCallback((id: string) => {
    const toast = toasts.find((t) => t.id === id);
    if (toast?.onDismiss) {
      toast.onDismiss();
    }
  }, [toasts]);

  const value: ToastContextValue = useMemo(() => ({
    showToast,
    dismissToast,
    toasts,
  }), [showToast, dismissToast, toasts]);

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

/**
 * Hook to access toast context
 * Must be used within ToastProvider
 */
export function useToastContext(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
}
