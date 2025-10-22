/**
 * Convenience hook for accessing toast functionality
 * Re-exports the context hook for cleaner imports
 * 
 * @example
 * ```tsx
 * const { showToast } = useToast();
 * 
 * showToast({
 *   type: 'achievement',
 *   badge: { ... },
 *   title: 'Achievement unlocked',
 *   subtitle: '15G – Village of Adanti'
 * });
 * ```
 */
export { useToastContext as useToast } from '../context/ToastContext';

