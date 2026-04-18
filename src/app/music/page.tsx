'use client';

import React, { useState } from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import { WMPToggleButton } from '@/components/WMPPlayer/WMPToggleButton';
import { useWMPPlayerContext } from '@/context/WMPPlayerContext';
import { trpc } from '@/utils/trpc';
import { useTimeout } from '@/hooks';
import styles from './Music.module.css';

const MusicPage = () => {
  const { setCurrentPlaylist, showPlayer } = useWMPPlayerContext();
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);

  // Fetch playlists from Spotify
  const { data: playlistsData } = trpc.spotify.getPlaylists.useQuery();

  // Get current playlist ID
  const currentPlaylist = playlistsData?.items?.[currentPlaylistIndex];
  const playlistId = currentPlaylist?.id;

  // Fetch tracks from current playlist
  const { data: tracks, isLoading } = trpc.spotify.getPlaylistTracks.useQuery(
    { playlistId: playlistId! },
    { enabled: !!playlistId }
  );

  // Auto-advance to next playlist if the current one has no playable tracks.
  // useTimeout with a conditional delay replaces the prior setTimeout+cleanup
  // choreography — null delay pauses the timer cleanly.
  const shouldAdvance =
    tracks !== undefined &&
    tracks.length === 0 &&
    !!playlistsData?.items &&
    currentPlaylistIndex < (playlistsData?.items.length ?? 0) - 1;

  useTimeout(
    () => setCurrentPlaylistIndex((prev) => prev + 1),
    shouldAdvance ? 500 : null,
  );

  // effect:audited — push fetched tracks into the global player context.
  // React Query v5 removed useQuery's onSuccess callback, so a side-effect
  // on tracks arrival has no first-class declarative form.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (tracks && tracks.length > 0) {
      setCurrentPlaylist(tracks);
      showPlayer();
    }
  }, [tracks, setCurrentPlaylist, showPlayer]);

  return (
    <PageLayout title="Music">
      <PageLayout.Header />
      <PageLayout.Body>
        <div className={styles.playerWrapper}>
          <div className={styles.instructions}>
            <h2>Windows Media Player</h2>
            <p>Click "Show Player" to open the global music player.</p>
            <p>The player is draggable and persists across pages.</p>
            {isLoading && <p className={styles.loading}>Loading playlist...</p>}
            {!isLoading && tracks && tracks.length === 0 && (
              <p className={styles.error}>
                Searching for playlists with preview tracks...
                {currentPlaylist && (
                  <span> (Tried: {currentPlaylist.name})</span>
                )}
              </p>
            )}
            {!isLoading && !playlistsData && (
              <p className={styles.error}>Failed to load playlists.</p>
            )}
            <div className={styles.buttonContainer}>
              <WMPToggleButton variant="full" />
            </div>
          </div>
        </div>
      </PageLayout.Body>
    </PageLayout>
  );
};

export default MusicPage;