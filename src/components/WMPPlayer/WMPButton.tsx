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
  /**
   * Handlers for non-buttongroup ("top-level") buttons, keyed by `element.id`
   * first then by `element.type`. The WMS authors typed-only elements (like
   * <pausebutton>) and id'd elements (like <button id="bPl">) — both paths
   * land here. Without this map, top-level button clicks silently no-op.
   */
  topLevelHandlers?: Map<string, () => void>;
  left: number;
  top: number;
}

export function WMPButton({
  element,
  assets,
  clickRegions,
  topLevelHandlers,
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

  /*
   * Resolve a top-level button's handler. Tries the explicit id first, then
   * the WMS tag type (catches <pausebutton> which has no id), then the
   * "Return to Full Mode" themebutton heuristic — it has neither id nor a
   * unique type, only its WMS onClick string identifies it.
   */
  const topLevelHandler = (() => {
    if (!topLevelHandlers) return undefined;
    if (element.id && topLevelHandlers.has(element.id)) {
      return topLevelHandlers.get(element.id);
    }
    if (element.type && topLevelHandlers.has(element.type)) {
      return topLevelHandlers.get(element.type);
    }
    if (
      element.onClick?.includes('returnToMediaCenter') &&
      topLevelHandlers.has('returnToMediaCenter')
    ) {
      return topLevelHandlers.get('returnToMediaCenter');
    }
    return undefined;
  })();

  // A button is "live" if it has a click target. Buttongroups manage liveness
  // per-region internally; top-level buttons are live only when a handler
  // resolves. Inert buttons render only their default image and use the
  // default cursor — no misleading hover/down promises.
  const isLive = clickRegions !== undefined || topLevelHandler !== undefined;

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
  const currentImageInfo = currentImageFile
    ? assets.images.get(currentImageFile)
    : undefined;

  // Use image dimensions if element dimensions not specified
  const width = element.dimensions?.width ?? currentImageInfo?.width ?? 0;
  const height = element.dimensions?.height ?? currentImageInfo?.height ?? 0;

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
    if (!clickRegions && isLive) {
      setButtonState('hover');
      playSound('hover');
    }
  }, [clickRegions, isLive, playSound]);

  const handleMouseLeave = useCallback(() => {
    setButtonState('default');
    setHoveredRegion(null);
  }, []);

  const handleMouseDown = useCallback(() => {
    if (isLive) setButtonState('down');
  }, [isLive]);

  const handleMouseUp = useCallback(() => {
    if (isLive) setButtonState('hover');
  }, [isLive]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!clickRegions || !containerRef.current) {
        if (topLevelHandler) {
          playSound('click');
          topLevelHandler();
        }
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
    [clickRegions, element.images?.mapping, assets.mappings, playSound, topLevelHandler]
  );

  // effect:audited — buttonState is partially derived from hoveredRegion
  // (the clickRegions/mapping path) and partially from imperative mouse
  // handlers (the non-region path, plus the `down` transition in both).
  // Unifying would require promoting hoveredRegion/isMouseDown to a single
  // state machine; deferred.
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
        width,
        height,
        zIndex: element.position.zIndex,
        backgroundImage: currentImageInfo ? `url(${currentImageInfo.url})` : undefined,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        cursor: element.enabled !== false && isLive ? 'pointer' : 'default',
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
