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
import { parseAttributeExpression, readModelPath } from '@/lib/wmp/expression';
import { WMPButton } from './WMPButton';
import { WMPSlider } from './WMPSlider';
import styles from './WMPSubview.module.css';

interface WMPSubviewProps {
  element: SkinElement;
  assets: SkinAssets;
  clickRegions: Map<string, ClickableRegion[]>;
  topLevelHandlers: Map<string, () => void>;
  playerState: WMPPlayerState;
  /** WMP object graph that `wmpprop:` bindings resolve against. Built once per
   *  state change in WMPCanvas and threaded down rather than rebuilt per node. */
  playerModel: Record<string, unknown>;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onBalanceChange: (balance: number) => void;
  onEqGainChange: (band: number, gain: number) => void;
}

export function WMPSubview({
  element,
  assets,
  clickRegions,
  topLevelHandlers,
  playerState,
  playerModel,
  onSeek,
  onVolumeChange,
  onBalanceChange,
  onEqGainChange,
}: WMPSubviewProps) {
  /*
   * `resolved` is filled by `resolveLayout` after assets load, and carries
   * jscript arithmetic (`left="jscript:balance.left+3"`) already evaluated to
   * pixels. The literal-position fallback covers an element whose expression
   * was cyclic or outside the arithmetic grammar.
   */
  const left =
    element.resolved?.left ??
    (typeof element.position.left === 'number' ? element.position.left : 0);
  const top =
    element.resolved?.top ??
    (typeof element.position.top === 'number' ? element.position.top : 0);

  // Get background image if any
  const backgroundImageInfo = element.images?.background
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
  if (
    element.type === 'button' ||
    element.type === 'buttongroup' ||
    element.type === 'pausebutton'
  ) {
    /*
     * Buttongroups receive their per-region map (regionMapper output).
     * Top-level buttons (including <pausebutton>, which is not nested in any
     * group) receive the id-keyed handler map so their clicks can fire.
     */
    return (
      <WMPButton
        element={element}
        assets={assets}
        clickRegions={
          element.type === 'buttongroup'
            ? clickRegions.get(element.id || '')
            : undefined
        }
        topLevelHandlers={topLevelHandlers}
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
    /*
     * Resolve `wmpprop:` bindings against the projected object model rather
     * than string-matching a handful of known paths, so a skin binding to
     * something headspace never used still renders.
     */
    const expression = parseAttributeExpression(element.textValue || '');

    let textValue: string;
    if (expression.kind === 'wmpprop') {
      const bound = readModelPath(playerModel, expression.source);
      textValue = bound === undefined || bound === null ? '' : String(bound);
    } else {
      textValue = expression.kind === 'literal' ? expression.source : '';
    }
    const color = element.colors?.foregroundColor || '#FFFFFF';
    const fontSize = element.fontSize || 12;

    // Don't render if text is empty
    if (!textValue) {
      return null;
    }

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
        width: element.dimensions?.width ?? backgroundImageInfo?.width,
        height: element.dimensions?.height ?? backgroundImageInfo?.height,
        zIndex: element.position.zIndex,
        backgroundImage: backgroundImageInfo ? `url(${backgroundImageInfo.url})` : undefined,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
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
          topLevelHandlers={topLevelHandlers}
          playerState={playerState}
          playerModel={playerModel}
          onSeek={onSeek}
          onVolumeChange={onVolumeChange}
          onBalanceChange={onBalanceChange}
          onEqGainChange={onEqGainChange}
        />
      ))}
    </SubviewComponent>
  );
}
