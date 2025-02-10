declare module 'react-water-wave' {
  import React from 'react';

  interface WaterWaveProps {
    imageUrl?: string;
    dropRadius?: number;
    perturbance?: number;
    resolution?: number;
    interactive?: boolean;
    children?: (methods: { drop: (args: { x: number; y: number; radius: number; strength: number }) => void }) => React.ReactNode;
  }

  const WaterWave: React.FC<WaterWaveProps>;

  export default WaterWave;
}
