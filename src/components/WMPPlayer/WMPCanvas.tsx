/**
 * WMP Canvas - Renders the skin UI based on parsed definition
 */

'use client';

import { useMemo } from 'react';
import type {
  SkinDefinition,
  SkinAssets,
  ClickableRegion,
  WMPPlayerState,
} from '@/types/wmp';
import { buildPlayerModel } from '@/lib/wmp/playerModel';
import { WMPSubview } from './WMPSubview';
import styles from './WMPCanvas.module.css';

interface WMPCanvasProps {
  skinDef: SkinDefinition;
  assets: SkinAssets;
  clickRegions: Map<string, ClickableRegion[]>;
  topLevelHandlers: Map<string, () => void>;
  playerState: WMPPlayerState;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onBalanceChange: (balance: number) => void;
  onEqGainChange: (band: number, gain: number) => void;
}

export function WMPCanvas({
  skinDef,
  assets,
  clickRegions,
  topLevelHandlers,
  playerState,
  onSeek,
  onVolumeChange,
  onBalanceChange,
  onEqGainChange,
}: WMPCanvasProps) {
  /*
   * The object graph every `wmpprop:` binding in the tree reads from. Built
   * here so a skin with dozens of bound text elements projects the state once
   * per change rather than once per element.
   */
  const playerModel = useMemo(() => buildPlayerModel(playerState), [playerState]);

  return (
    <div
      className={styles.canvas}
      style={{
        width: skinDef.view.width,
        height: skinDef.view.height,
        backgroundColor: skinDef.view.backgroundColor || 'transparent',
      }}
    >
      {skinDef.view.elements
        .filter((element) => {
          // Skip elements marked as not visible
          if (element.visible === false || element.visible === 'false') {
            return false;
          }
          return true;
        })
        .map((element, index) => (
          <WMPSubview
            key={element.id || `element_${index}`}
            element={element}
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
    </div>
  );
}
