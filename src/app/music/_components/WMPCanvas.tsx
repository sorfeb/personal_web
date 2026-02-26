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
      {skinDef.view.elements.map((element, index) => (
        <WMPSubview
          key={element.id || `element_${index}`}
          element={element}
          assets={assets}
          clickRegions={clickRegions}
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
