/**
 * WMP Canvas - Renders the skin UI based on parsed definition
 */

'use client';

import type {
  SkinDefinition,
  SkinAssets,
  ClickableRegion,
  WMPPlayerState,
} from '@/types/wmp';
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
            onSeek={onSeek}
            onVolumeChange={onVolumeChange}
            onBalanceChange={onBalanceChange}
            onEqGainChange={onEqGainChange}
          />
        ))}
    </div>
  );
}
