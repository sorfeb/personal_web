'use client';

import React, { useState, useEffect } from 'react';
import styles from './Clock.module.css';

interface ClockProps {
  className?: string;
  format?: '12h' | '24h';
  showSeconds?: boolean;
}

/**
 * Clock Component - Real-time Digital Clock
 * 
 * Features:
 * - Real-time updates every second
 * - Configurable 12h/24h format
 * - Optional seconds display
 * - Custom styling support
 * - Proper cleanup on unmount
 */
export const Clock: React.FC<ClockProps> = ({ 
  className = '',
  format = '12h',
  showSeconds = false
}) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        ...(showSeconds && { second: '2-digit' }),
        ...(format === '12h' && { hour12: true }),
        ...(format === '24h' && { hour12: false })
      };

      setCurrentTime(now.toLocaleTimeString('en-US', timeOptions));
    };

    // Initial time set
    updateTime();
    
    // Update every second
    const interval = setInterval(updateTime, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [format, showSeconds]);

  return (
    <div className={`${styles.clock} ${className}`}>
      {currentTime}
    </div>
  );
};

export default Clock;