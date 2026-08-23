/**
 * Windows Media Player skin-based music player component
 * Main player that loads and renders WMP skins
 */

'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import type { SkinAssets, SkinDefinition, Track } from '@/types/wmp';
import { findElementById, loadSkin } from '@/lib/wmp/skinParser';
import { loadSkinAssets } from '@/lib/wmp/assetLoader';
import { resolveLayout } from '@/lib/wmp/layout';
import { parseAllButtonGroups } from '@/lib/wmp/regionMapper';
import { manifestUrlFor, skinPathFor, type SkinManifest } from '@/lib/wmp/skinRegistry';
import { useWMPPlayer } from '@/hooks/useWMPPlayer';
import { useAudioManager } from '@/hooks/useAudioManager';
import { useAchievements } from '@/hooks/useAchievements';
import { useNavigationSound } from '@/hooks/useNavigationSound';
import { WMPCanvas } from './WMPCanvas';
import { WMPPlaylistDrawer } from './WMPPlaylistDrawer';
import { SpotifyEmbed } from './engines/SpotifyEmbed';
import styles from './WMPPlayer.module.css';

/**
 * Region ids the click-handler map serves. Transport ids are WMS tag types;
 * minimize/close are derived by regionMapper from their `view.<method>();`
 * onClick scripts (the headspace WMS gives those buttons no `id` attribute).
 */
const CLICK_HANDLER_KEYS = [
  'playelement',
  'stopelement',
  'nextelement',
  'prevelement',
  'minimize',
  'close',
] as const;

interface WMPPlayerProps {
  /** Which installed skin to render. See `src/lib/wmp/skinRegistry.ts`. */
  skin: SkinManifest;
  playlist?: Track[]; // Optional playlist
  autoPlay?: boolean;
  onClose?: () => void; // Callback when close button is clicked
  onMinimize?: () => void; // Callback when minimize button is clicked
}

export function WMPPlayer({
  skin,
  playlist = [],
  autoPlay = false,
  onClose,
  onMinimize,
}: WMPPlayerProps) {
  const [skinDef, setSkinDef] = useState<SkinDefinition | null>(null);
  const [assets, setAssets] = useState<SkinAssets | null>(null);
  const [clickRegions, setClickRegions] = useState<Map<string, any>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { playSound } = useAudioManager();
  const { unlock } = useAchievements();
  const { navigateWithSound } = useNavigationSound();
  const player = useWMPPlayer();

  // effect:audited — multi-step async skin load (manifest parse + asset preload
  // + layout resolve + region parse). Converting to useQuery would require
  // decoupling the click-handler map from the skin-load pipeline; deferred.
  //
  // Depending on the whole `skin` object is safe because the registry hands
  // back a stable reference per id (see `getSkin`), so this re-runs when the
  // selected skin actually changes rather than on every render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let cancelled = false;

    async function loadSkinData() {
      try {
        setIsLoading(true);
        setError(null);

        const skinPath = skinPathFor(skin);

        // Parse the manifest named by the registry. Manifest filenames do not
        // follow from the folder name: 9SeriesDefault ships Corona.wms.
        const definition = await loadSkin(manifestUrlFor(skin));

        // Assets first: resolving `jscript:x.width` arithmetic needs the
        // natural dimensions of the bitmaps those elements draw.
        const skinAssets = await loadSkinAssets(skinPath, definition);
        resolveLayout(definition, skinAssets);

        /*
         * Regions live for the skin's lifetime, but this effect runs once per
         * skin — so region handlers read the current handler map through a
         * ref at click time instead of baking in this render's closures.
         */
        const liveHandlers = new Map<string, () => void>(
          CLICK_HANDLER_KEYS.map((key) => [key, () => clickHandlersRef.current.get(key)?.()])
        );

        // Parse buttongroups to create clickable regions
        const regions = parseAllButtonGroups(
          definition.view.elements,
          skinAssets.mappings,
          liveHandlers
        );

        // A skin switch mid-load must not paint the losing skin's tree.
        if (cancelled) return;

        setSkinDef(definition);
        setAssets(skinAssets);
        setClickRegions(regions);
        setIsLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load skin');
        setIsLoading(false);
      }
    }

    loadSkinData();

    return () => {
      cancelled = true;
    };
  }, [skin]);

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
   * so regionMapper falls back to element.type. The minimize/close keys match
   * the `view.minimize();` / `view.close();` onClick scripts regionMapper
   * derives ids from (their <buttonelement> tags carry no id).
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
   * Refreshed every render (same pattern as currentTrackRef in useWMPPlayer)
   * so the skin regions parsed once in the load effect never invoke a stale
   * closure over `player`.
   */
  const clickHandlersRef = useRef<Map<string, () => void>>(new Map());
  clickHandlersRef.current = createClickHandlers();

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
      unlock('deep-cuts');
      player.togglePlaylistDrawer();
    };
    handlers.set('bPl', togglePlaylist);
    handlers.set('bPlHandle', togglePlaylist);
    handlers.set('bPlClose', togglePlaylist);

    handlers.set('returnToMediaCenter', () => {
      navigateWithSound('/music', 'navigation');
    });

    return handlers;
  }, [player, playSound, navigateWithSound, unlock]);

  /*
   * The playlist overlay below is positioned from headspace's own geometry.
   * Detect the drawer it belongs to rather than checking the skin id, so a
   * future skin that reuses the same element ids gets it too.
   */
  const hasHeadspaceDrawer = useMemo(
    () => (skinDef ? findElementById(skinDef, 'sPlEar') !== null : false),
    [skinDef]
  );

  if (isLoading) {
    return (
      <div className={styles.playerShell}>
        <div className={styles.loading}>Loading skin</div>
      </div>
    );
  }

  if (error || !skinDef || !assets) {
    return (
      <div className={styles.playerShell}>
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
       *
       * Gated on the skin actually declaring sPlEar: these are headspace's
       * coordinates, and painting them over a skin without that drawer would
       * drop a playlist in the middle of unrelated art.
       */}
      {hasHeadspaceDrawer && (
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
      )}

      {/* Hidden audio element managed by useWMPPlayer for `source: 'audio'` tracks. */}
    </div>
  );
}
