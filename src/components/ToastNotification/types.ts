export type RingColor = 'success' | 'info' | 'warning' | 'error' | 'default';
export type ToastType = 'achievement' | 'system';
export type AnimationPhase = 'entering' | 'badge-crossfade' | 'active' | 'exiting';

/**
 * Status color configuration for toast notifications
 */
export const TOAST_COLORS = {
  success: '#0CF700',
  info: '#2F25FD',
  warning: '#F4CC00',
  error: '#FD2525',
  default: '#9ca3af',
} as const;

/**
 * Status icon configuration for toast notifications
 */
export const TOAST_ICONS = {
  achievement: '/assets/icons/toast/trophy.png',
  success: '/favicon.svg',
  info: '/assets/icons/dashboard/info-circle.svg',
  warning: '/assets/icons/dashboard/warning-triangle.svg',
  error: '/assets/icons/dashboard/error-circle.svg',
  default: '/favicon.svg',
} as const;

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
