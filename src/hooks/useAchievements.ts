/**
 * Convenience hook for the achievement engine
 * Re-exports the context hook for cleaner imports
 *
 * @example
 * ```tsx
 * const { unlock, recordProgress } = useAchievements();
 *
 * // In an event handler — never in an effect:
 * unlock('business-time');
 * recordProgress('gamercardSections', 'skills');
 * ```
 */
export { useAchievementContext as useAchievements } from '../context/AchievementContext';
