'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Background, getBackgroundById, getDefaultBackground } from '../data/backgrounds';

/**
 * BackgroundContext
 * 
 * Manages the current background selection and provides functionality
 * to switch between different backgrounds. Persists user preference
 * to localStorage for consistency across sessions.
 */

interface BackgroundContextType {
  currentBackground: Background;
  setBackground: (backgroundId: string) => void;
  isLoading: boolean;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

const STORAGE_KEY = 'sorosfebria-selected-background';

interface BackgroundProviderProps {
  children: ReactNode;
}

export const BackgroundProvider: React.FC<BackgroundProviderProps> = ({ children }) => {
  const [currentBackground, setCurrentBackground] = useState<Background>(getDefaultBackground());
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load saved background preference from localStorage on mount
   */
  useEffect(() => {
    const loadSavedBackground = () => {
      try {
        const savedBackgroundId = localStorage.getItem(STORAGE_KEY);
        
        if (savedBackgroundId) {
          const background = getBackgroundById(savedBackgroundId);
          if (background) {
            setCurrentBackground(background);
          } else {
            // If saved background no longer exists, use default
            console.warn(`Background "${savedBackgroundId}" not found, using default`);
            setCurrentBackground(getDefaultBackground());
          }
        }
      } catch (error) {
        console.error('Failed to load background preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedBackground();
  }, []);

  /**
   * Switch to a different background and save preference
   */
  const setBackground = (backgroundId: string) => {
    const background = getBackgroundById(backgroundId);
    
    if (!background) {
      console.error(`Background "${backgroundId}" not found`);
      return;
    }

    setCurrentBackground(background);

    // Persist to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, backgroundId);
    } catch (error) {
      console.error('Failed to save background preference:', error);
    }
  };

  const value: BackgroundContextType = useMemo(
    () => ({
      currentBackground,
      setBackground,
      isLoading,
    }),
    [currentBackground, isLoading]
  );

  return (
    <BackgroundContext.Provider value={value}>
      {children}
    </BackgroundContext.Provider>
  );
};

/**
 * Hook to access background context
 * 
 * @example
 * const { currentBackground, setBackground } = useBackground();
 * setBackground('xbox360-animated');
 */
export const useBackground = (): BackgroundContextType => {
  const context = useContext(BackgroundContext);
  
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  
  return context;
};
