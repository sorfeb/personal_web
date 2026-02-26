/**
 * WMP Slider - Renders interactive sliders with drag support
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { SkinElement, SkinAssets, WMPPlayerState } from '@/types/wmp';
import styles from './WMPSlider.module.css';

interface WMPSliderProps {
  element: SkinElement;
  assets: SkinAssets;
  left: number;
  top: number;
  playerState: WMPPlayerState;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onBalanceChange: (balance: number) => void;
  onEqGainChange: (band: number, gain: number) => void;
}

export function WMPSlider({
  element,
  assets,
  left,
  top,
  playerState,
  onSeek,
  onVolumeChange,
  onBalanceChange,
  onEqGainChange,
}: WMPSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [thumbState, setThumbState] = useState<'default' | 'hover' | 'down'>(
    'default'
  );
  const sliderRef = useRef<HTMLDivElement>(null);

  const isHorizontal = element.direction !== 'vertical';
  const min = element.min ?? 0;
  const max = element.max ?? 100;

  // Get current value based on slider ID/binding
  const getCurrentValue = useCallback(() => {
    const id = element.id?.toLowerCase() || '';

    if (id === 'seek') {
      return playerState.currentTime;
    } else if (id === 'volume') {
      return playerState.volume;
    } else if (id === 'balance') {
      return playerState.balance;
    } else if (id.startsWith('eq')) {
      // Extract band number from id (e.g., "eq1" -> 0, "eq2" -> 1)
      const bandNum = parseInt(id.replace('eq', ''), 10) - 1;
      if (bandNum >= 0 && bandNum < 10) {
        return playerState.eq.gains[bandNum];
      }
    }

    return min;
  }, [element.id, playerState, min]);

  const currentValue = getCurrentValue();

  // Calculate thumb position
  const calculateThumbPosition = useCallback(() => {
    const range = max - min;
    const valueRatio = (currentValue - min) / range;

    if (isHorizontal) {
      const sliderWidth = element.dimensions?.width || 100;
      const borderSize = element.borderSize || 0;
      const usableWidth = sliderWidth - borderSize * 2;
      return borderSize + valueRatio * usableWidth;
    } else {
      const sliderHeight = element.dimensions?.height || 100;
      const borderSize = element.borderSize || 0;
      const usableHeight = sliderHeight - borderSize * 2;
      // Vertical sliders are inverted (top = max, bottom = min)
      return borderSize + (1 - valueRatio) * usableHeight;
    }
  }, [currentValue, min, max, isHorizontal, element.dimensions, element.borderSize]);

  const thumbPosition = calculateThumbPosition();

  // Handle value changes
  const updateValue = useCallback(
    (newValue: number) => {
      const clampedValue = Math.max(min, Math.min(max, newValue));
      const id = element.id?.toLowerCase() || '';

      if (id === 'seek') {
        onSeek(clampedValue);
      } else if (id === 'volume') {
        onVolumeChange(clampedValue);
      } else if (id === 'balance') {
        onBalanceChange(clampedValue);
      } else if (id.startsWith('eq')) {
        const bandNum = parseInt(id.replace('eq', ''), 10) - 1;
        if (bandNum >= 0 && bandNum < 10) {
          onEqGainChange(bandNum, clampedValue);
        }
      }
    },
    [element.id, min, max, onSeek, onVolumeChange, onBalanceChange, onEqGainChange]
  );

  // Handle mouse/drag events
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsDragging(true);
      setThumbState('down');

      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const borderSize = element.borderSize || 0;

      let newValue: number;

      if (isHorizontal) {
        const x = e.clientX - rect.left - borderSize;
        const usableWidth = (element.dimensions?.width || 100) - borderSize * 2;
        const ratio = Math.max(0, Math.min(1, x / usableWidth));
        newValue = min + ratio * (max - min);
      } else {
        const y = e.clientY - rect.top - borderSize;
        const usableHeight = (element.dimensions?.height || 100) - borderSize * 2;
        const ratio = 1 - Math.max(0, Math.min(1, y / usableHeight));
        newValue = min + ratio * (max - min);
      }

      updateValue(newValue);
    },
    [element.borderSize, element.dimensions, isHorizontal, min, max, updateValue]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const borderSize = element.borderSize || 0;

      let newValue: number;

      if (isHorizontal) {
        const x = e.clientX - rect.left - borderSize;
        const usableWidth = (element.dimensions?.width || 100) - borderSize * 2;
        const ratio = Math.max(0, Math.min(1, x / usableWidth));
        newValue = min + ratio * (max - min);
      } else {
        const y = e.clientY - rect.top - borderSize;
        const usableHeight = (element.dimensions?.height || 100) - borderSize * 2;
        const ratio = 1 - Math.max(0, Math.min(1, y / usableHeight));
        newValue = min + ratio * (max - min);
      }

      updateValue(newValue);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setThumbState('default');
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, element.borderSize, element.dimensions, isHorizontal, min, max, updateValue]);

  // Get images
  const backgroundUrl = element.images?.background
    ? assets.images.get(element.images.background)
    : undefined;

  const foregroundUrl = element.images?.foreground
    ? assets.images.get(element.images.foreground)
    : undefined;

  const getThumbImage = () => {
    switch (thumbState) {
      case 'hover':
        return element.images?.thumbHover || element.images?.thumb;
      case 'down':
        return element.images?.thumbDown || element.images?.thumb;
      default:
        return element.images?.thumb;
    }
  };

  const thumbImageFile = getThumbImage();
  const thumbUrl = thumbImageFile ? assets.images.get(thumbImageFile) : undefined;

  return (
    <div
      ref={sliderRef}
      className={styles.slider}
      style={{
        position: 'absolute',
        left,
        top,
        width: element.dimensions?.width,
        height: element.dimensions?.height,
        zIndex: element.position.zIndex,
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
        backgroundRepeat: element.tiled ? 'repeat' : 'no-repeat',
        cursor: 'pointer',
      }}
      onMouseDown={handleMouseDown}
      title={element.toolTip}
    >
      {/* Foreground/progress overlay (for seek bar) */}
      {foregroundUrl && element.useForegroundProgress && (
        <div
          className={styles.foreground}
          style={{
            backgroundImage: `url(${foregroundUrl})`,
            width: isHorizontal ? `${thumbPosition}px` : '100%',
            height: isHorizontal ? '100%' : `${thumbPosition}px`,
          }}
        />
      )}

      {/* Thumb */}
      {thumbUrl && (
        <div
          className={styles.thumb}
          style={{
            position: 'absolute',
            left: isHorizontal ? thumbPosition : 0,
            top: isHorizontal ? 0 : thumbPosition,
            backgroundImage: `url(${thumbUrl})`,
            cursor: 'grab',
          }}
          onMouseEnter={() => !isDragging && setThumbState('hover')}
          onMouseLeave={() => !isDragging && setThumbState('default')}
        />
      )}
    </div>
  );
}
