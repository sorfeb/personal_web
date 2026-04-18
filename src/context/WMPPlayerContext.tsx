'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  ReactNode,
} from 'react';
import type { Track } from '@/types/wmp';

/**
 * WMPPlayerContext
 *
 * Manages the global Windows Media Player state:
 * - Player visibility and position (persisted to localStorage)
 * - Current playlist (session-only, not persisted per user preference)
 * - Minimize state
 */

interface WMPPlayerContextState {
  isVisible: boolean;
  isMinimized: boolean;
  position: { x: number; y: number };
  currentPlaylist: Track[];
  isLoading: boolean;
}

interface WMPPlayerContextValue {
  // State
  isVisible: boolean;
  isMinimized: boolean;
  position: { x: number; y: number };
  currentPlaylist: Track[];
  isLoading: boolean;

  // Actions
  showPlayer: () => void;
  hidePlayer: () => void;
  togglePlayer: () => void;
  minimize: () => void;
  restore: () => void;
  setPosition: (pos: { x: number; y: number }) => void;
  setCurrentPlaylist: (tracks: Track[]) => void;

  // Refs for controlling playback
  playerRef: React.RefObject<{ pause: () => void; play: () => void } | null>;
}

const WMPPlayerContext = createContext<WMPPlayerContextValue | undefined>(undefined);

const STORAGE_KEYS = {
  VISIBLE: 'sorosfebria-wmp-visible',
  MINIMIZED: 'sorosfebria-wmp-minimized',
  POSITION: 'sorosfebria-wmp-position',
  // Note: Playlist NOT persisted per user preference
};

const PLAYER_DIMENSIONS = {
  WIDTH: 760,
  HEIGHT: 394,
  TITLE_BAR: 32,
  TOTAL_HEIGHT: 426, // 394 + 32
};

/**
 * Calculate default centered position
 */
const getDefaultPosition = (): { x: number; y: number } => {
  if (typeof window === 'undefined') {
    return { x: 0, y: 0 };
  }

  // Center of screen (user preference)
  return {
    x: Math.max(0, (window.innerWidth - PLAYER_DIMENSIONS.WIDTH) / 2),
    y: Math.max(0, (window.innerHeight - PLAYER_DIMENSIONS.TOTAL_HEIGHT) / 2),
  };
};

interface WMPPlayerProviderProps {
  children: ReactNode;
}

export const WMPPlayerProvider: React.FC<WMPPlayerProviderProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPositionState] = useState<{ x: number; y: number }>(
    getDefaultPosition()
  );
  const [currentPlaylist, setCurrentPlaylist] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Ref to control player playback from context
  const playerRef = useRef<{ pause: () => void; play: () => void } | null>(null);

  /**
   * Load saved preferences from localStorage on mount
   */
  useEffect(() => {
    const loadSavedPreferences = () => {
      try {
        // Load saved position
        const savedPosition = localStorage.getItem(STORAGE_KEYS.POSITION);
        if (savedPosition) {
          const parsed = JSON.parse(savedPosition);
          setPositionState(parsed);
        } else {
          setPositionState(getDefaultPosition());
        }

        // Load saved visibility
        const savedVisible = localStorage.getItem(STORAGE_KEYS.VISIBLE);
        if (savedVisible !== null) {
          setIsVisible(savedVisible === 'true');
        }

        // Load saved minimized state
        const savedMinimized = localStorage.getItem(STORAGE_KEYS.MINIMIZED);
        if (savedMinimized !== null) {
          setIsMinimized(savedMinimized === 'true');
        }
      } catch (error) {
        console.error('Failed to load WMP player preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedPreferences();
  }, []);

  /**
   * Show player (manual toggle only per user preference)
   */
  const showPlayer = useCallback(() => {
    setIsVisible(true);
    localStorage.setItem(STORAGE_KEYS.VISIBLE, 'true');
  }, []);

  /**
   * Hide player and pause music (per user preference)
   */
  const hidePlayer = useCallback(() => {
    // Pause music when closing player
    if (playerRef.current) {
      playerRef.current.pause();
    }

    setIsVisible(false);
    localStorage.setItem(STORAGE_KEYS.VISIBLE, 'false');
  }, []);

  /**
   * Toggle player visibility
   */
  const togglePlayer = useCallback(() => {
    if (isVisible) {
      hidePlayer();
    } else {
      showPlayer();
    }
  }, [isVisible, hidePlayer, showPlayer]);

  /**
   * Minimize player (hide content, keep title bar)
   */
  const minimize = useCallback(() => {
    setIsMinimized(true);
    localStorage.setItem(STORAGE_KEYS.MINIMIZED, 'true');
  }, []);

  /**
   * Restore player from minimized state
   */
  const restore = useCallback(() => {
    setIsMinimized(false);
    localStorage.setItem(STORAGE_KEYS.MINIMIZED, 'false');
  }, []);

  /**
   * Set position and persist to localStorage
   */
  const setPosition = useCallback((pos: { x: number; y: number }) => {
    setPositionState(pos);
    try {
      localStorage.setItem(STORAGE_KEYS.POSITION, JSON.stringify(pos));
    } catch (error) {
      console.error('Failed to save WMP player position:', error);
    }
  }, []);

  const value: WMPPlayerContextValue = useMemo(
    () => ({
      isVisible,
      isMinimized,
      position,
      currentPlaylist,
      isLoading,
      showPlayer,
      hidePlayer,
      togglePlayer,
      minimize,
      restore,
      setPosition,
      setCurrentPlaylist,
      playerRef,
    }),
    [
      isVisible,
      isMinimized,
      position,
      currentPlaylist,
      isLoading,
      showPlayer,
      hidePlayer,
      togglePlayer,
      minimize,
      restore,
      setPosition,
    ]
  );

  return (
    <WMPPlayerContext.Provider value={value}>
      {children}
    </WMPPlayerContext.Provider>
  );
};

/**
 * Hook to access WMP player context
 *
 * @example
 * const { showPlayer, setCurrentPlaylist } = useWMPPlayerContext();
 *
 * // Show player with playlist
 * setCurrentPlaylist(tracks);
 * showPlayer();
 */
export function useWMPPlayerContext(): WMPPlayerContextValue {
  const context = useContext(WMPPlayerContext);

  if (!context) {
    throw new Error('useWMPPlayerContext must be used within WMPPlayerProvider');
  }

  return context;
}

// Export constants for use in components
export { PLAYER_DIMENSIONS };
