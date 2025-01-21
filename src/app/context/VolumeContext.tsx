'use client';

import React, { createContext, useContext, useState } from 'react';

interface VolumeContextProps {
  volume: number;
  setVolume: (volume: number) => void;
}

const VolumeContext = createContext<VolumeContextProps | undefined>(undefined);

export const VolumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [volume, setVolume] = useState(0.5); // Default global volume: 50%

  return (
    <VolumeContext.Provider value={{ volume, setVolume }}>
      {children}
    </VolumeContext.Provider>
  );
};

export const useVolume = (): VolumeContextProps => {
  const context = useContext(VolumeContext);
  if (!context) {
    throw new Error('useVolume must be used within a VolumeProvider');
  }
  return context;
};
