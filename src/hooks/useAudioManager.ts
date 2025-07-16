import { useRef, useCallback, useEffect } from 'react';
import { useVolume } from '@/context/VolumeContext';

interface AudioPool {
  [key: string]: HTMLAudioElement[];
}

const AUDIO_FILES = {
  hover: '/assets/audio/ps2_ding.wav',
  click: '/assets/audio/ps2_zing.wav',
  navigation: '/assets/audio/snd_buttonselect.wav',
  back: '/assets/audio/snd_buttonback.wav',
  panel: '/assets/audio/snd_panelright.wav',
  panelLeft: '/assets/audio/snd_panelleft.wav',
  ting: '/assets/audio/ps2_ting.wav',
  owawa: '/assets/audio/ps2_owawa.wav',
  divine: '/assets/audio/ps2_divine.wav',
  unfold: '/assets/audio/snd_panelunfold.wav',
  channelUp: '/assets/audio/snd_channelup.wav',
  channelDown: '/assets/audio/snd_channeldown.wav',
  swing: '/assets/audio/ps2_swing.wav',
} as const;

export const useAudioManager = () => {
  const { volume } = useVolume();
  const audioPoolRef = useRef<AudioPool>({});

  // Preload and pool audio files
  useEffect(() => {
    Object.entries(AUDIO_FILES).forEach(([key, src]) => {
      audioPoolRef.current[key] = Array.from({ length: 3 }, () => {
        const audio = new Audio(src);
        audio.preload = 'auto';
        audio.volume = volume;
        return audio;
      });
    });
  }, []);

  // Update volume for all pooled audio
  useEffect(() => {
    Object.values(audioPoolRef.current).flat().forEach(audio => {
      audio.volume = volume;
    });
  }, [volume]);

  const playSound = useCallback((soundType: keyof typeof AUDIO_FILES) => {
    const pool = audioPoolRef.current[soundType];
    if (!pool) return;

    const availableAudio = pool.find(audio => audio.paused) || pool[0];
    availableAudio.currentTime = 0;
    availableAudio.play().catch(() => {});
  }, []);

  return { playSound };
};