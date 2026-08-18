'use client';

import { useEffect } from 'react';
import { useGamepadContext } from '../context/GamepadContext';
import { useWMPPlayerContext } from '../context/WMPPlayerContext';
import type { AchievementId } from '../constants/achievements';

/**
 * Unlocks achievements from ambient state owned by contexts mounted *above*
 * the AchievementProvider (they cannot call useAchievements themselves):
 * gamepad connection → plug-and-play, media player launch → now-playing.
 * `unlock` is idempotent, so re-fires on reconnect/reopen are no-ops.
 */
export function useAmbientAchievementTriggers(unlock: (id: AchievementId) => void): void {
  const { connected } = useGamepadContext();
  const { isVisible } = useWMPPlayerContext();

  useEffect(() => {
    if (connected) unlock('plug-and-play');
  }, [connected, unlock]);

  useEffect(() => {
    if (isVisible) unlock('now-playing');
  }, [isVisible, unlock]);
}
