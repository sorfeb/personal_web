/**
 * Toast Notification Configuration
 * 
 * Centralized configuration for toast notifications component.
 * Defines color schemes and icon mappings for different toast statuses.
 * 
 * @see ToastNotification - Primary consumer of this configuration
 * @see createAchievementToast - Uses TOAST_ICONS for achievement notifications
 * @see createSystemToast - Uses TOAST_ICONS for system notifications
 */

/**
 * Status color configuration for toast notifications
 * These colors are used for progress bars and theme references
 */
export const TOAST_COLORS = {
  /** Success state - bright Xbox achievement green */
  success: '#0CF700',
  /** Info state - blue for informational messages */
  info: '#2F25FD',
  /** Warning state - yellow for caution messages */
  warning: '#F4CC00',
  /** Error state - red for critical alerts */
  error: '#FD2525',
  /** Default state - neutral gray */
  default: '#9ca3af',
} as const;

/**
 * Status icon configuration for toast notifications
 * Maps toast types to their respective icon assets
 */
export const TOAST_ICONS = {
    achievement: '/assets/icons/toast/trophy.png',
    success: '/assets/icons/toast/vault-boy.gif', 
    info: '/assets/icons/toast/info.png',
    config: '/assets/icons/toast/gears.png',
    warning: '/assets/icons/toast/warning.png',
    error: '/assets/icons/toast/face-melting-indiana-jones.gif',
    default: '/favicon.svg',
} as const;
