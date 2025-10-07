'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

/**
 * CRTFilterContext
 * 
 * Manages the CRT filter visibility state across the application.
 * Provides functionality to toggle the retro CRT screen effect on/off.
 * Persists user preference to localStorage.
 */

interface CRTFilterContextType {
  isEnabled: boolean;
  toggleCRTFilter: () => void;
  setEnabled: (enabled: boolean) => void;
}

const CRTFilterContext = createContext<CRTFilterContextType | undefined>(undefined);

const STORAGE_KEY = 'sorosfebria-crt-filter-enabled';

interface CRTFilterProviderProps {
  children: ReactNode;
}

/**
 * CRTFilterProvider Component
 * 
 * Wraps the application to provide CRT filter state management.
 * Loads saved preference from localStorage on mount.
 */
export const CRTFilterProvider: React.FC<CRTFilterProviderProps> = ({ children }) => {
  // Default to enabled for authentic Xbox experience
  const [isEnabled, setIsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load saved CRT filter preference from localStorage on mount
   */
  useEffect(() => {
    const loadSavedPreference = () => {
      try {
        const savedPreference = localStorage.getItem(STORAGE_KEY);
        
        if (savedPreference !== null) {
          setIsEnabled(savedPreference === 'true');
        }
      } catch (error) {
        console.error('Failed to load CRT filter preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedPreference();
  }, []);

  /**
   * Toggle CRT filter on/off and save preference
   */
  const toggleCRTFilter = () => {
    setIsEnabled((prev) => {
      const newValue = !prev;
      
      // Persist to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, String(newValue));
      } catch (error) {
        console.error('Failed to save CRT filter preference:', error);
      }
      
      return newValue;
    });
  };

  /**
   * Set CRT filter state directly
   */
  const setEnabled = (enabled: boolean) => {
    setIsEnabled(enabled);
    
    // Persist to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, String(enabled));
    } catch (error) {
      console.error('Failed to save CRT filter preference:', error);
    }
  };

  const value: CRTFilterContextType = useMemo(
    () => ({
      isEnabled,
      toggleCRTFilter,
      setEnabled,
    }),
    [isEnabled]
  );

  // Don't render until we've loaded the preference to avoid flash
  if (isLoading) {
    return <>{children}</>;
  }

  return (
    <CRTFilterContext.Provider value={value}>
      {children}
    </CRTFilterContext.Provider>
  );
};

/**
 * Hook to access CRT filter context
 * 
 * @example
 * const { isEnabled, toggleCRTFilter } = useCRTFilter();
 * 
 * // Toggle the filter
 * <button onClick={toggleCRTFilter}>
 *   {isEnabled ? 'Disable' : 'Enable'} CRT Effect
 * </button>
 */
export const useCRTFilter = (): CRTFilterContextType => {
  const context = useContext(CRTFilterContext);
  
  if (context === undefined) {
    throw new Error('useCRTFilter must be used within a CRTFilterProvider');
  }
  
  return context;
};
