import { ShowToastConfig, RingColor } from '../components/ToastNotification/types';

/**
 * Show an achievement unlock notification with crossfade animation
 * 
 * @param title - Achievement title
 * @param subtitle - Achievement subtitle (e.g., "15G – Village of Adanti")
 * @param icon - Icon URL for the achievement badge
 * @param duration - Display duration in milliseconds (default: 5000ms for achievements)
 */
export function createAchievementToast(
  title: string,
  subtitle: string,
  icon: string,
  duration = 5000
): ShowToastConfig {
  return {
    type: 'achievement',
    badge: {
      primaryIcon: '/assets/icons/dashboard/xbox-logo.svg', // Default Xbox logo
      secondaryIcon: icon,
      ringColor: 'success',
    },
    title,
    subtitle,
    duration,
    showProgressBar: true,
  };
}

/**
 * Show a system notification
 * 
 * @param message - Notification message
 * @param status - Notification status (success, error, info, warning)
 * @param icon - Optional custom icon URL
 * @param duration - Display duration in milliseconds (default: 4000ms)
 */
export function createSystemToast(
  message: string,
  status: Extract<RingColor, 'success' | 'error' | 'info' | 'warning'> = 'info',
  icon?: string,
  duration = 4000
): ShowToastConfig {
  const statusIcons: Record<typeof status, string> = {
    success: '/assets/icons/dashboard/check-circle.svg',
    error: '/assets/icons/dashboard/error-circle.svg',
    info: '/assets/icons/dashboard/info-circle.svg',
    warning: '/assets/icons/dashboard/warning-triangle.svg',
  };

  return {
    type: 'system',
    badge: {
      primaryIcon: icon || statusIcons[status],
      ringColor: status,
    },
    title: message,
    duration,
    showProgressBar: false,
  };
}

/**
 * Sanitize and truncate text to prevent UI overflow
 * 
 * @param text - Text to sanitize
 * @param maxLength - Maximum character length
 */
export function sanitizeToastText(text: string, maxLength: number): string {
  // Basic XSS prevention: strip HTML tags
  const cleaned = text.replace(/<[^>]*>/g, '');
  
  // Truncate if necessary
  if (cleaned.length > maxLength) {
    return `${cleaned.substring(0, maxLength - 3)}...`;
  }
  
  return cleaned;
}

/**
 * Validate toast configuration before displaying
 * Enforces character limits and sanitizes input
 */
export function validateToastConfig(config: ShowToastConfig): ShowToastConfig {
  const MAX_TITLE_LENGTH = 50;
  const MAX_SUBTITLE_LENGTH = 80;

  return {
    ...config,
    title: sanitizeToastText(config.title, MAX_TITLE_LENGTH),
    subtitle: config.subtitle
      ? sanitizeToastText(config.subtitle, MAX_SUBTITLE_LENGTH)
      : undefined,
  };
}
