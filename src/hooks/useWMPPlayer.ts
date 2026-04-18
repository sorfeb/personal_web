/**
 * Windows Media Player state management hook
 * Handles playback, playlist, and UI state
 */

'use client';

import { useCallback, useEffect, useReducer, useRef } from 'react';
import type {
  Track,
  WMPPlayerState,
  WMPPlayerAction,
} from '@/types/wmp';
import { useVolume } from '@/context/VolumeContext';

// Helper to format time in M:SS format
function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Initial state
const initialState: WMPPlayerState = {
  isPlaying: false,
  isPaused: false,
  isStopped: true,
  currentTrack: null,
  currentTime: 0,
  duration: 0,
  positionString: '0:00',
  durationString: '0:00',
  trackName: '',
  artist: '',
  playlist: [],
  playlistIndex: -1,
  volume: 75,
  balance: 0,
  muted: false,
  eq: {
    enabled: false,
    gains: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 10 bands
  },
  eqDrawerOpen: false,
  playlistDrawerOpen: false,
  visualizerOpen: false,
  isLoading: false,
  error: null,
};

// Reducer function
function playerReducer(
  state: WMPPlayerState,
  action: WMPPlayerAction
): WMPPlayerState {
  switch (action.type) {
    case 'PLAY': {
      const track = action.track || state.currentTrack;
      return {
        ...state,
        isPlaying: true,
        isPaused: false,
        isStopped: false,
        currentTrack: track,
        trackName: track?.name || '',
        artist: track?.artist || '',
        error: null,
      };
    }

    case 'PAUSE':
      return {
        ...state,
        isPlaying: false,
        isPaused: true,
        isStopped: false,
      };

    case 'STOP':
      return {
        ...state,
        isPlaying: false,
        isPaused: false,
        isStopped: true,
        currentTime: 0,
      };

    case 'RESUME':
      return {
        ...state,
        isPlaying: true,
        isPaused: false,
        isStopped: false,
      };

    case 'NEXT': {
      const nextIndex = Math.min(state.playlistIndex + 1, state.playlist.length - 1);
      return {
        ...state,
        playlistIndex: nextIndex,
        currentTrack: state.playlist[nextIndex] || null,
        currentTime: 0,
      };
    }

    case 'PREV': {
      const prevIndex = Math.max(state.playlistIndex - 1, 0);
      return {
        ...state,
        playlistIndex: prevIndex,
        currentTrack: state.playlist[prevIndex] || null,
        currentTime: 0,
      };
    }

    case 'SEEK':
      return {
        ...state,
        currentTime: action.time,
      };

    case 'SET_VOLUME':
      return {
        ...state,
        volume: Math.max(0, Math.min(100, action.volume)),
      };

    case 'SET_BALANCE':
      return {
        ...state,
        balance: Math.max(-100, Math.min(100, action.balance)),
      };

    case 'TOGGLE_MUTE':
      return {
        ...state,
        muted: !state.muted,
      };

    case 'SET_PLAYLIST':
      return {
        ...state,
        playlist: action.playlist,
        playlistIndex: action.playlist.length > 0 ? 0 : -1,
        currentTrack: action.playlist[0] || null,
      };

    case 'SET_PLAYLIST_INDEX':
      return {
        ...state,
        playlistIndex: action.index,
        currentTrack: state.playlist[action.index] || null,
        currentTime: 0,
      };

    case 'UPDATE_TIME':
      return {
        ...state,
        currentTime: action.time,
        positionString: formatTime(action.time),
      };

    case 'UPDATE_DURATION':
      return {
        ...state,
        duration: action.duration,
        durationString: formatTime(action.duration),
      };

    case 'TOGGLE_EQ_DRAWER':
      return {
        ...state,
        eqDrawerOpen: !state.eqDrawerOpen,
      };

    case 'TOGGLE_PLAYLIST_DRAWER':
      return {
        ...state,
        playlistDrawerOpen: !state.playlistDrawerOpen,
      };

    case 'TOGGLE_VISUALIZER':
      return {
        ...state,
        visualizerOpen: !state.visualizerOpen,
      };

    case 'SET_EQ_GAIN': {
      const newGains = [...state.eq.gains];
      newGains[action.band] = Math.max(-14, Math.min(14, action.gain));
      return {
        ...state,
        eq: {
          ...state.eq,
          gains: newGains,
        },
      };
    }

    case 'RESET_EQ':
      return {
        ...state,
        eq: {
          ...state.eq,
          gains: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };

    case 'TRACK_ENDED': {
      // Auto-advance to next track
      const nextIndex = state.playlistIndex + 1;
      if (nextIndex < state.playlist.length) {
        return {
          ...state,
          playlistIndex: nextIndex,
          currentTrack: state.playlist[nextIndex],
          currentTime: 0,
        };
      }
      // End of playlist
      return {
        ...state,
        isPlaying: false,
        isStopped: true,
        currentTime: 0,
      };
    }

    default:
      return state;
  }
}

/**
 * Hook for WMP player state and controls
 */
export function useWMPPlayer() {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { volume: globalVolume } = useVolume();

  // Initialize audio element
  useEffect(() => {
    if (typeof window === 'undefined') return;

    audioRef.current = new Audio();
    audioRef.current.preload = 'auto';

    // Set up event listeners
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      dispatch({ type: 'UPDATE_TIME', time: audio.currentTime });
    };

    const handleDurationChange = () => {
      dispatch({ type: 'UPDATE_DURATION', duration: audio.duration });
    };

    const handleEnded = () => {
      dispatch({ type: 'TRACK_ENDED' });
    };

    const handleError = () => {
      dispatch({
        type: 'SET_ERROR',
        error: 'Failed to load audio track',
      });
    };

    const handleLoadStart = () => {
      dispatch({ type: 'SET_LOADING', isLoading: true });
    };

    const handleCanPlay = () => {
      dispatch({ type: 'SET_LOADING', isLoading: false });
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Sync volume with global volume context and player state
  useEffect(() => {
    if (!audioRef.current) return;

    // Use player state volume, but scale by global volume
    const effectiveVolume = (state.volume / 100) * (globalVolume / 100);
    audioRef.current.volume = state.muted ? 0 : effectiveVolume;
  }, [state.volume, state.muted, globalVolume]);

  // Handle track changes
  useEffect(() => {
    if (!audioRef.current || !state.currentTrack) return;

    const audio = audioRef.current;
    audio.src = state.currentTrack.url;

    if (state.isPlaying) {
      audio.play().catch((error) => {
        console.error('Failed to play audio:', error);
        dispatch({ type: 'SET_ERROR', error: 'Failed to play audio' });
      });
    }
  }, [state.currentTrack]);

  // Handle play/pause state changes
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    if (state.isPlaying && !state.isPaused) {
      audio.play().catch((error) => {
        console.error('Failed to play audio:', error);
        dispatch({ type: 'SET_ERROR', error: 'Failed to play audio' });
      });
    } else {
      audio.pause();
    }
  }, [state.isPlaying, state.isPaused]);

  // Playback controls
  const play = useCallback((track?: Track) => {
    if (track) {
      dispatch({ type: 'PLAY', track });
    } else if (state.isPaused) {
      dispatch({ type: 'RESUME' });
    } else {
      dispatch({ type: 'PLAY' });
    }
  }, [state.isPaused]);

  const pause = useCallback(() => {
    dispatch({ type: 'PAUSE' });
  }, []);

  const stop = useCallback(() => {
    dispatch({ type: 'STOP' });
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, []);

  const next = useCallback(() => {
    dispatch({ type: 'NEXT' });
  }, []);

  const prev = useCallback(() => {
    dispatch({ type: 'PREV' });
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    dispatch({ type: 'SEEK', time });
  }, []);

  const setVolume = useCallback((volume: number) => {
    dispatch({ type: 'SET_VOLUME', volume });
  }, []);

  const setBalance = useCallback((balance: number) => {
    dispatch({ type: 'SET_BALANCE', balance });
  }, []);

  const toggleMute = useCallback(() => {
    dispatch({ type: 'TOGGLE_MUTE' });
  }, []);

  const setPlaylist = useCallback((playlist: Track[]) => {
    dispatch({ type: 'SET_PLAYLIST', playlist });
  }, []);

  const setPlaylistIndex = useCallback((index: number) => {
    dispatch({ type: 'SET_PLAYLIST_INDEX', index });
  }, []);

  const toggleEqDrawer = useCallback(() => {
    dispatch({ type: 'TOGGLE_EQ_DRAWER' });
  }, []);

  const togglePlaylistDrawer = useCallback(() => {
    dispatch({ type: 'TOGGLE_PLAYLIST_DRAWER' });
  }, []);

  const toggleVisualizer = useCallback(() => {
    dispatch({ type: 'TOGGLE_VISUALIZER' });
  }, []);

  const setEqGain = useCallback((band: number, gain: number) => {
    dispatch({ type: 'SET_EQ_GAIN', band, gain });
  }, []);

  const resetEq = useCallback(() => {
    dispatch({ type: 'RESET_EQ' });
  }, []);

  return {
    state,
    audioRef,
    // Playback controls
    play,
    pause,
    stop,
    next,
    prev,
    seek,
    // Audio settings
    setVolume,
    setBalance,
    toggleMute,
    // Playlist
    setPlaylist,
    setPlaylistIndex,
    // UI controls
    toggleEqDrawer,
    togglePlaylistDrawer,
    toggleVisualizer,
    // EQ controls
    setEqGain,
    resetEq,
  };
}
