/**
 * WMP Button - Renders buttons and buttongroups with state-based images
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { SkinElement, SkinAssets, ClickableRegion } from '@/types/wmp';
import { getRegionAtPoint } from '@/lib/wmp/regionMapper';
import { useAudioManager } from '@/hooks/useAudioManager';
import styles from './WMPButton.module.css';

interface WMPButtonProps {
  element: SkinElement;
  assets: SkinAssets;
  clickRegions?: ClickableRegion[];
  left: number;
  top: number;
}

export function WMPButton({
  element,
  assets,
  clickRegions,
  left,
  top,
}: WMPButtonProps) {
  const [buttonState, setButtonState] = useState<
    'default' | 'hover' | 'down' | 'disabled'
  >('default');
  const [hoveredRegion, setHoveredRegion] = useState<ClickableRegion | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const { playSound } = useAudioManager();

  // Get the appropriate image based on state
  const getCurrentImage = useCallback(() => {
    if (element.enabled === false) {
      return element.images?.disabled || element.images?.default;
    }

    switch (buttonState) {
      case 'hover':
        return element.images?.hover || element.images?.default;
      case 'down':
        return element.images?.down || element.images?.default;
      case 'disabled':
        return element.images?.disabled || element.images?.default;
      default:
        return element.images?.default;
    }
  }, [buttonState, element.enabled, element.images]);

  const currentImageFile = getCurrentImage();
  const currentImageUrl = currentImageFile
    ? assets.images.get(currentImageFile)
    : undefined;

  // Handle mouse events for buttongroups with mapping
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!clickRegions || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const mappingImage = element.images?.mapping
        ? assets.mappings.get(element.images.mapping)
        : undefined;

      if (mappingImage) {
        const region = getRegionAtPoint(clickRegions, x, y, mappingImage);
        if (region !== hoveredRegion) {
          setHoveredRegion(region);
          if (region) {
            playSound('hover');
          }
        }
      }
    },
    [clickRegions, element.images?.mapping, assets.mappings, hoveredRegion, playSound]
  );

  const handleMouseEnter = useCallback(() => {
    if (!clickRegions) {
      setButtonState('hover');
      playSound('hover');
    }
  }, [clickRegions, playSound]);

  const handleMouseLeave = useCallback(() => {
    setButtonState('default');
    setHoveredRegion(null);
  }, []);

  const handleMouseDown = useCallback(() => {
    setButtonState('down');
  }, []);

  const handleMouseUp = useCallback(() => {
    setButtonState('hover');
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!clickRegions || !containerRef.current) {
        playSound('click');
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const mappingImage = element.images?.mapping
        ? assets.mappings.get(element.images.mapping)
        : undefined;

      if (mappingImage) {
        const region = getRegionAtPoint(clickRegions, x, y, mappingImage);
        if (region?.onClick) {
          region.onClick();
        }
      }
    },
    [clickRegions, element.images?.mapping, assets.mappings, playSound]
  );

  // Update button state based on hover region
  useEffect(() => {
    if (hoveredRegion) {
      setButtonState('hover');
    } else if (clickRegions) {
      setButtonState('default');
    }
  }, [hoveredRegion, clickRegions]);

  return (
    <div
      ref={containerRef}
      className={styles.button}
      style={{
        position: 'absolute',
        left,
        top,
        width: element.dimensions?.width,
        height: element.dimensions?.height,
        zIndex: element.position.zIndex,
        backgroundImage: currentImageUrl ? `url(${currentImageUrl})` : undefined,
        backgroundRepeat: 'no-repeat',
        cursor: element.enabled !== false ? 'pointer' : 'default',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      title={hoveredRegion?.toolTip || element.toolTip}
    />
  );
}
