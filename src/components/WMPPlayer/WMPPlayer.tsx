/**
 * Windows Media Player skin-based music player component
 * Main player that loads and renders WMP skins
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { SkinDefinition, Track } from '@/types/wmp';
import { loadSkin } from '@/lib/wmp/skinParser';
import { loadSkinAssets } from '@/lib/wmp/assetLoader';
import { parseAllButtonGroups } from '@/lib/wmp/regionMapper';
import { useWMPPlayer } from '@/hooks/useWMPPlayer';
import { useAudioManager } from '@/hooks/useAudioManager';
import { useNavigationSound } from '@/hooks/useNavigationSound';
import { WMPCanvas } from './WMPCanvas';
import { WMPPlaylistDrawer } from './WMPPlaylistDrawer';
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
  const { navigateWithSound } = useNavigationSound();
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

  /*
   * Buttongroup handlers — keyed by the region id that regionMapper assigns.
   * Transport elements (<playelement> etc.) have no explicit id in the WMS,
   * so regionMapper falls back to element.type. The minimize/close keys come
   * from explicit `id` attributes on their <buttonelement> tags.
   */
  const createClickHandlers = useCallback(() => {
    const handlers = new Map<string, () => void>();

    handlers.set('playelement', () => {
      playSound('click');
      if (player.state.isPaused || !player.state.isPlaying) {
        player.play();
      }
    });

    handlers.set('stopelement', () => {
      playSound('click');
      player.stop();
    });

    handlers.set('nextelement', () => {
      playSound('click');
      player.next();
    });

    handlers.set('prevelement', () => {
      playSound('click');
      player.prev();
    });

    handlers.set('minimize', () => {
      playSound('click');
      onMinimize?.();
    });

    handlers.set('close', () => {
      playSound('click');
      onClose?.();
    });

    return handlers;
  }, [player, playSound, onClose, onMinimize]);

  /*
   * Top-level (non-buttongroup) handlers, passed live to WMPCanvas each
   * render. WMPButton resolves these by element.id, then element.type, then
   * the `returnToMediaCenter` themebutton heuristic — see `topLevelHandler`
   * in WMPButton.tsx.
   */
  const topLevelHandlers = useMemo(() => {
    const handlers = new Map<string, () => void>();

    handlers.set('pausebutton', () => {
      playSound('click');
      player.pause();
    });

    const togglePlaylist = () => {
      playSound('click');
      player.togglePlaylistDrawer();
    };
    handlers.set('bPl', togglePlaylist);
    handlers.set('bPlHandle', togglePlaylist);
    handlers.set('bPlClose', togglePlaylist);

    handlers.set('returnToMediaCenter', () => {
      navigateWithSound('/music', 'navigation');
    });

    return handlers;
  }, [player, playSound, navigateWithSound]);

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
        topLevelHandlers={topLevelHandlers}
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

      {/*
       * Playlist drawer content layered over the sliding sPlEar subview.
       * Coordinates derived from headspace.wms: inner sPlView at
       * (sPlEar.left + 13, sPlEar.top + 10). Closed sPlEar.left=277 → 290.
       * Open sPlEar.left=488 → 501. Animation duration matches the
       * sPlEar slide in WMPSubview.tsx (0.12s ease-in-out).
       */}
      <motion.div
        className={styles.playlistDrawerOverlay}
        initial={false}
        animate={{
          left: player.state.playlistDrawerOpen ? 501 : 290,
          opacity: player.state.playlistDrawerOpen ? 1 : 0,
        }}
        transition={{ duration: 0.12, ease: 'easeInOut' }}
        style={{
          pointerEvents: player.state.playlistDrawerOpen ? 'auto' : 'none',
        }}
      >
        <WMPPlaylistDrawer
          playlist={player.state.playlist}
          currentIndex={player.state.playlistIndex}
          onSelect={player.setPlaylistIndex}
        />
      </motion.div>

      {/* Hidden audio element managed by useWMPPlayer for `source: 'audio'` tracks. */}
    </div>
  );
}
