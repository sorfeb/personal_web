/**
 * WMP Subview - Renders a subview container with children
 */

'use client';

import { motion } from 'framer-motion';
import type {
  SkinElement,
  SkinAssets,
  ClickableRegion,
  WMPPlayerState,
} from '@/types/wmp';
import { WMPButton } from './WMPButton';
import { WMPSlider } from './WMPSlider';
import styles from './WMPSubview.module.css';

interface WMPSubviewProps {
  element: SkinElement;
  assets: SkinAssets;
  clickRegions: Map<string, ClickableRegion[]>;
  playerState: WMPPlayerState;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onBalanceChange: (balance: number) => void;
  onEqGainChange: (band: number, gain: number) => void;
}

export function WMPSubview({
  element,
  assets,
  clickRegions,
  playerState,
  onSeek,
  onVolumeChange,
  onBalanceChange,
  onEqGainChange,
}: WMPSubviewProps) {
  // Parse position (handle jscript expressions - for now, just use 0)
  const left = typeof element.position.left === 'number' ? element.position.left : 0;
  const top = typeof element.position.top === 'number' ? element.position.top : 0;

  // Get background image if any
  const backgroundImage = element.images?.background
    ? assets.images.get(element.images.background)
    : undefined;

  // Determine if this should be animated (drawers)
  const isEqDrawer = element.id === 'sEqEar';
  const isPlaylistDrawer = element.id === 'sPlEar';

  const shouldAnimate = isEqDrawer || isPlaylistDrawer;

  // Calculate animated position for drawers
  let animatedLeft = left;
  if (isEqDrawer && playerState.eqDrawerOpen) {
    animatedLeft = 0; // Opened position from headspace.js
  } else if (isEqDrawer && !playerState.eqDrawerOpen) {
    animatedLeft = 207; // Closed position
  } else if (isPlaylistDrawer && playerState.playlistDrawerOpen) {
    animatedLeft = 488; // Opened position
  } else if (isPlaylistDrawer && !playerState.playlistDrawerOpen) {
    animatedLeft = 277; // Closed position
  }

  // Render based on element type
  if (element.type === 'button' || element.type === 'buttongroup') {
    return (
      <WMPButton
        element={element}
        assets={assets}
        clickRegions={clickRegions.get(element.id || '')}
        left={left}
        top={top}
      />
    );
  }

  if (element.type === 'slider') {
    return (
      <WMPSlider
        element={element}
        assets={assets}
        left={left}
        top={top}
        playerState={playerState}
        onSeek={onSeek}
        onVolumeChange={onVolumeChange}
        onBalanceChange={onBalanceChange}
        onEqGainChange={onEqGainChange}
      />
    );
  }

  if (element.type === 'text') {
    const textValue = element.textValue || '';
    const color = element.colors?.foregroundColor || '#FFFFFF';
    const fontSize = element.fontSize || 12;

    return (
      <div
        className={styles.text}
        style={{
          position: 'absolute',
          left,
          top,
          color,
          fontSize,
          zIndex: element.position.zIndex,
          width: element.dimensions?.width,
        }}
      >
        {textValue}
      </div>
    );
  }

  // For other element types (subview, effects, video, playlist, etc.)
  // Render as container with children
  const SubviewComponent = shouldAnimate ? motion.div : 'div';

  return (
    <SubviewComponent
      className={styles.subview}
      style={{
        position: 'absolute',
        left: shouldAnimate ? undefined : left,
        top,
        width: element.dimensions?.width,
        height: element.dimensions?.height,
        zIndex: element.position.zIndex,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundRepeat: 'no-repeat',
        backgroundColor: element.colors?.backgroundColor,
      }}
      {...(shouldAnimate && {
        animate: { left: animatedLeft },
        transition: { duration: 0.12, ease: 'easeInOut' },
      })}
    >
      {element.children?.map((child, index) => (
        <WMPSubview
          key={child.id || `child_${index}`}
          element={child}
          assets={assets}
          clickRegions={clickRegions}
          playerState={playerState}
          onSeek={onSeek}
          onVolumeChange={onVolumeChange}
          onBalanceChange={onBalanceChange}
          onEqGainChange={onEqGainChange}
        />
      ))}
    </SubviewComponent>
  );
}
