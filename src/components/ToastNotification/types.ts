/**
 * Type definitions for Xbox 360-style toast notification system
 */

export type RingColor = 'success' | 'info' | 'warning' | 'error' | 'default';
export type ToastType = 'achievement' | 'system';
export type AnimationPhase = 'entering' | 'badge-crossfade' | 'active' | 'exiting';

/**
 * Configuration for the circular badge area
 */
export interface BadgeConfig {
  /** Primary icon/logo displayed in the badge */
  primaryIcon: string;
  /** Secondary icon for achievement crossfade animation (optional) */
  secondaryIcon?: string;
  /** Status-coded ring color around the badge */
  ringColor: RingColor;
  /** Badge diameter in pixels (responsive: 56-72px) */
  size?: number;
}

/**
 * Complete configuration for a toast notification
 */
export interface ToastConfig {
  /** Unique identifier for the toast */
  id: string;
  /** Toast variant: achievement (with crossfade) or system (single icon) */
  type: ToastType;
  /** Badge configuration */
  badge: BadgeConfig;
  /** Main notification title */
  title: string;
  /** Optional subtitle/secondary text */
  subtitle?: string;
  /** Display duration in milliseconds (default: 4000ms) */
  duration?: number;
  /** Show progress bar countdown at bottom edge */
  showProgressBar?: boolean;
  /** Callback fired when toast is dismissed */
  onDismiss?: () => void;
}

/**
 * Input configuration for showing a new toast (id is auto-generated)
 */
export type ShowToastConfig = Omit<ToastConfig, 'id'>;

/**
 * Context API for global toast management
 */
export interface ToastContextValue {
  /** Show a new toast notification */
  showToast: (config: ShowToastConfig) => string;
  /** Manually dismiss a toast by ID */
  dismissToast: (id: string) => void;
  /** Array of currently active toasts */
  toasts: ToastConfig[];
}
