'use client';

import React, { useCallback, useState } from 'react';
import { useInterval, useMountEffect } from '@/hooks';
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

  const updateTime = useCallback(() => {
    const now = new Date();

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      ...(showSeconds && { second: '2-digit' }),
      ...(format === '12h' && { hour12: true }),
      ...(format === '24h' && { hour12: false }),
    };

    setCurrentTime(now.toLocaleTimeString('en-US', timeOptions));
  }, [format, showSeconds]);

  // Initial client-side set (avoids SSR hydration mismatch)
  useMountEffect(() => {
    updateTime();
  });

  // Keep the clock ticking every second. useInterval saves the latest
  // callback via ref, so format/showSeconds changes take effect on the
  // next tick (up to 1s later) without tearing down the interval.
  useInterval(updateTime, 1000);

  return (
    <div className={`${styles.clock} ${className}`}>
      {currentTime}
    </div>
  );
};

export default Clock;