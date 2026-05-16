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
import { SpotifyEmbed } from './engines/SpotifyEmbed';
import styles from './WMPPlayer.module.css';

interface WMPPlayerProps {
  skinPath: string; // Path to skin folder (e.g., "/assets/skins/headspace")
  playlist?: Track[]; // Optional playlist
  autoPlay?: boolean;
  onClose?: () => void; // Callback when close button is clicked
  onMinimize?: () => void; // Callback when minimize button is clicked
}

export function WMPPlayer({
  skinPath,
  playlist = [],
  autoPlay = false,
  onClose,
  onMinimize,
}: WMPPlayerProps) {
  const [skinDef, setSkinDef] = useState<SkinDefinition | null>(null);
  const [assets, setAssets] = useState<any>(null);
  const [clickRegions, setClickRegions] = useState<Map<string, any>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { playSound } = useAudioManager();
  const player = useWMPPlayer();

  // effect:audited — multi-step async skin load (XML parse + asset preload + region parse).
  // Converting to useQuery would require decoupling the click-handler map from the
  // skin-load pipeline; deferred. Deps [skinPath] are intentional.
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        console.log('Loaded skin assets:', {
          imageCount: skinAssets.images.size,
          mappingCount: skinAssets.mappings.size,
          images: Array.from(skinAssets.images.keys()).slice(0, 5),
        });
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

  // effect:audited — sync incoming playlist prop into the useWMPPlayer hook's
  // internal state. Using useEffect because the hook exposes imperative setters
  // (setPlaylist, play) rather than accepting the playlist as a controlled prop.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (playlist.length > 0) {
      player.setPlaylist(playlist);
    }
  }, [playlist]);

  // effect:audited — honor autoPlay on first load. Same imperative-setter
  // constraint as above; fires when either `autoPlay` or `playlist` change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      if (onMinimize) {
        onMinimize();
      }
    });

    // Close button
    handlers.set('close', () => {
      playSound('click');
      if (onClose) {
        onClose();
      }
    });

    return handlers;
  }, [player, playSound, onClose, onMinimize]);

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

      {player.state.currentTrack?.source === 'spotify-embed' && (
        <div className={styles.embedOverlay}>
          <SpotifyEmbed track={player.state.currentTrack} />
        </div>
      )}

      {/* Hidden audio element managed by useWMPPlayer for `source: 'audio'` tracks. */}
    </div>
  );
}
