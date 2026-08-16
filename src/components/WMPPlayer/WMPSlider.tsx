/**
 * WMP Slider - Renders interactive sliders with drag support
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import type { SkinElement, SkinAssets, WMPPlayerState } from '@/types/wmp';
import { useEventListener } from '@/hooks';
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

  // Parse min/max, handling WMP bindings
  const getMinValue = () => {
    if (typeof element.min === 'number' && Number.isFinite(element.min)) {
      return element.min;
    }
    return 0;
  };

  const getMaxValue = () => {
    if (typeof element.max === 'number' && Number.isFinite(element.max)) {
      return element.max;
    }
    // Handle WMP bindings like "wmpprop:player.currentmedia.duration"
    if (typeof element.max === 'string' && element.max.includes('duration')) {
      return playerState.duration || 100;
    }
    return 100;
  };

  const min = getMinValue();
  const max = getMaxValue();

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
    // Guard against invalid values - use Number.isFinite for strict checking
    if (
      !Number.isFinite(currentValue) ||
      !Number.isFinite(min) ||
      !Number.isFinite(max)
    ) {
      return 0;
    }

    const range = max - min;
    if (range === 0) return 0;

    const valueRatio = Math.max(0, Math.min(1, (currentValue - min) / range));

    if (isHorizontal) {
      const sliderWidth = element.dimensions?.width || 100;
      const borderSize = element.borderSize || 0;
      const usableWidth = sliderWidth - borderSize * 2;

      if (usableWidth <= 0) return borderSize || 0;

      const position = borderSize + valueRatio * usableWidth;
      return Number.isFinite(position) ? position : 0;
    } else {
      const sliderHeight = element.dimensions?.height || 100;
      const borderSize = element.borderSize || 0;
      const usableHeight = sliderHeight - borderSize * 2;

      if (usableHeight <= 0) return borderSize || 0;

      // Vertical sliders are inverted (top = max, bottom = min)
      const position = borderSize + (1 - valueRatio) * usableHeight;
      return Number.isFinite(position) ? position : 0;
    }
  }, [currentValue, min, max, isHorizontal, element.dimensions, element.borderSize]);

  const thumbPosition = calculateThumbPosition();

  // Additional safety check
  const safeThumbPosition = isNaN(thumbPosition) ? 0 : thumbPosition;

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

  // Drag tracking — only bound while actively dragging the thumb.
  useEventListener(isDragging ? document : null, 'mousemove', (e: MouseEvent) => {
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
  });

  useEventListener(isDragging ? document : null, 'mouseup', () => {
    setIsDragging(false);
    setThumbState('default');
  });

  // Get images
  const backgroundInfo = element.images?.background
    ? assets.images.get(element.images.background)
    : undefined;

  const foregroundInfo = element.images?.foreground
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
  const thumbInfo = thumbImageFile ? assets.images.get(thumbImageFile) : undefined;

  return (
    // DEFERRED — tracked as SOR-137. Correct
    // exposure is role="slider" with aria-valuenow/min/max and arrow-key
    // stepping, wired to the same seek/volume model the pointer drag uses —
    // real work inside the skin engine rather than an element swap.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      ref={sliderRef}
      className={styles.slider}
      style={{
        position: 'absolute',
        left,
        top,
        width: element.dimensions?.width ?? backgroundInfo?.width ?? 100,
        height: element.dimensions?.height ?? backgroundInfo?.height ?? 20,
        zIndex: element.position.zIndex,
        backgroundImage: backgroundInfo ? `url(${backgroundInfo.url})` : undefined,
        backgroundRepeat: element.tiled ? 'repeat' : 'no-repeat',
        backgroundSize: element.tiled ? 'auto' : 'contain',
        cursor: 'pointer',
      }}
      onMouseDown={handleMouseDown}
      title={element.toolTip}
    >
      {/* Foreground/progress overlay (for seek bar) */}
      {foregroundInfo && element.useForegroundProgress && (
        <div
          className={styles.foreground}
          style={{
            backgroundImage: `url(${foregroundInfo.url})`,
            width: isHorizontal ? `${thumbPosition}px` : '100%',
            height: isHorizontal ? '100%' : `${thumbPosition}px`,
            backgroundSize: 'contain',
          }}
        />
      )}

      {/* Thumb */}
      {thumbInfo && (
        <div
          className={styles.thumb}
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: isHorizontal ? thumbPosition : 0,
            top: isHorizontal ? 0 : thumbPosition,
            width: thumbInfo.width,
            height: thumbInfo.height,
            backgroundImage: `url(${thumbInfo.url})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            cursor: 'grab',
          }}
          onMouseEnter={() => !isDragging && setThumbState('hover')}
          onMouseLeave={() => !isDragging && setThumbState('default')}
        />
      )}
    </div>
  );
}
