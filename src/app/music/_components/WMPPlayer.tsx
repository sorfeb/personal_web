/**
 * Windows Media Player skin-based music player component
 * Main player that loads and renders WMP skins
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SkinDefinition, Track } from '@/types/wmp';
import { loadSkin } from '@/lib/wmp/skinParser';
import { loadSkinAssets } from '@/lib/wmp/assetLoader';
import { parseAllButtonGroups } from '@/lib/wmp/regionMapper';
import { useWMPPlayer } from '@/hooks/useWMPPlayer';
import { useAudioManager } from '@/hooks/useAudioManager';
import { WMPCanvas } from './WMPCanvas';
import styles from './WMPPlayer.module.css';

interface WMPPlayerProps {
  skinPath: string; // Path to skin folder (e.g., "/assets/skins/headspace")
  playlist?: Track[]; // Optional playlist
  autoPlay?: boolean;
}

export function WMPPlayer({
  skinPath,
  playlist = [],
  autoPlay = false,
}: WMPPlayerProps) {
  const [skinDef, setSkinDef] = useState<SkinDefinition | null>(null);
  const [assets, setAssets] = useState<any>(null);
  const [clickRegions, setClickRegions] = useState<Map<string, any>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { playSound } = useAudioManager();
  const player = useWMPPlayer();

  // Load skin on mount
  useEffect(() => {
    async function loadSkinData() {
      try {
        setIsLoading(true);
        setError(null);

        // Load and parse skin XML
        const skinUrl = `${skinPath}/headspace.wms`;
        const definition = await loadSkin(skinUrl);
        setSkinDef(definition);

        // Load skin assets
        const skinAssets = await loadSkinAssets(skinPath, definition);
        setAssets(skinAssets);

        // Create click handlers map
        const handlers = createClickHandlers();

        // Parse buttongroups to create clickable regions
        const regions = parseAllButtonGroups(
          definition.view.elements,
          skinAssets.mappings,
          handlers
        );
        setClickRegions(regions);

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load skin:', err);
        setError(err instanceof Error ? err.message : 'Failed to load skin');
        setIsLoading(false);
      }
    }

    loadSkinData();
  }, [skinPath]);

  // Set playlist when provided
  useEffect(() => {
    if (playlist.length > 0) {
      player.setPlaylist(playlist);
    }
  }, [playlist]);

  // Auto-play if enabled
  useEffect(() => {
    if (autoPlay && playlist.length > 0 && !player.state.isPlaying) {
      player.play();
    }
  }, [autoPlay, playlist]);

  // Create click handlers for WMP controls
  const createClickHandlers = useCallback(() => {
    const handlers = new Map<string, () => void>();

    // Play button
    handlers.set('play', () => {
      playSound('click');
      if (player.state.isPaused) {
        player.play();
      } else if (!player.state.isPlaying) {
        player.play();
      }
    });

    // Pause button
    handlers.set('pause', () => {
      playSound('click');
      player.pause();
    });

    // Stop button
    handlers.set('stop', () => {
      playSound('click');
      player.stop();
    });

    // Next button
    handlers.set('next', () => {
      playSound('click');
      player.next();
    });

    // Prev button
    handlers.set('prev', () => {
      playSound('click');
      player.prev();
    });

    // EQ button
    handlers.set('bEq', () => {
      playSound('click');
      player.toggleEqDrawer();
    });

    // Playlist button
    handlers.set('bPl', () => {
      playSound('click');
      player.togglePlaylistDrawer();
    });

    // Visualizer button
    handlers.set('vis', () => {
      playSound('click');
      player.toggleVisualizer();
    });

    // Minimize button
    handlers.set('minimize', () => {
      playSound('click');
      // TODO: Implement minimize
      console.log('Minimize clicked');
    });

    // Close button
    handlers.set('close', () => {
      playSound('click');
      // TODO: Implement close
      console.log('Close clicked');
    });

    return handlers;
  }, [player, playSound]);

  if (isLoading) {
    return (
      <div className={styles.playerContainer}>
        <div className={styles.loading}>Loading skin...</div>
      </div>
    );
  }

  if (error || !skinDef || !assets) {
    return (
      <div className={styles.playerContainer}>
        <div className={styles.error}>
          {error || 'Failed to load skin'}
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.playerContainer}
      style={{
        width: skinDef.view.width,
        height: skinDef.view.height,
      }}
    >
      <WMPCanvas
        skinDef={skinDef}
        assets={assets}
        clickRegions={clickRegions}
        playerState={player.state}
        onSeek={player.seek}
        onVolumeChange={player.setVolume}
        onBalanceChange={player.setBalance}
        onEqGainChange={player.setEqGain}
      />

      {/* Hidden audio element managed by useWMPPlayer */}
      {/* Audio ref is handled internally by the hook */}
    </div>
  );
}
