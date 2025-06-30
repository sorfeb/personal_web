import { useCallback } from 'react';
import { useAudioManager } from './useAudioManager';
import { useRouter } from 'next/navigation';

export const useNavigationSound = () => {
  const { playSound } = useAudioManager();
  const router = useRouter();

  const navigateWithSound = useCallback((path: string, soundType: 'back' | 'navigation' = 'navigation') => {
    playSound(soundType);
    router.push(path);
  }, [playSound, router]);

  const playNavigationSound = useCallback(() => playSound('navigation'), [playSound]);
  const playBackSound = useCallback(() => playSound('back'), [playSound]);

  return {
    navigateWithSound,
    playNavigationSound,
    playBackSound,
  };
};
