'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import PageLayout from '../../components/PageLayout/PageLayout';
import { WMPToggleButton } from '@/components/WMPPlayer/WMPToggleButton';
import styles from './Playlists.module.css';
import { useAudioManager } from '../../hooks/useAudioManager';
import { useWMPPlayerContext } from '@/context/WMPPlayerContext';
import { trpc } from '../../utils/trpc';

const PlaylistsPage = () => {
  const { playSound } = useAudioManager();
  const { openWithPlaylist } = useWMPPlayerContext();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [emptyPlaylistName, setEmptyPlaylistName] = useState<string | null>(null);

  const { data, isLoading } = trpc.spotify.getPlaylists.useQuery();
  const { data: tracks, isLoading: isLoadingTracks } = trpc.spotify.getPlaylistTracks.useQuery(
    { playlistId: selectedPlaylistId! },
    { enabled: !!selectedPlaylistId }
  );

  const playlists = data?.items ?? [];

  const playHoverSound = () => playSound('divine');

  const handlePlaylistClick = (playlistId: string) => {
    playSound('click');
    setSelectedPlaylistId(playlistId);
  };

  // effect:audited — orchestrate side-effects when the user-selected
  // playlist's tracks arrive (push into global player, or surface empty-
  // playlist error). React Query v5 removed useQuery's onSuccess callback,
  // and the side-effect depends on multiple fetched values, so no clean
  // declarative replacement exists.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (tracks !== undefined) {
      if (tracks.length > 0) {
        openWithPlaylist(tracks);
        setEmptyPlaylistName(null);
      } else if (selectedPlaylistId) {
        const playlist = playlists.find((p) => p.id === selectedPlaylistId);
        setEmptyPlaylistName(playlist?.name || 'Unknown playlist');
      }
    }
  }, [tracks, openWithPlaylist, selectedPlaylistId, playlists]);

  return (
    <PageLayout title="My Playlists" size="wide">
      <PageLayout.Header>
        <div className={styles.headerContent}>
          <WMPToggleButton variant="full" />
        </div>
      </PageLayout.Header>
      <PageLayout.Body>
        <div className={styles.container}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <span className={styles.text}>Loading</span>
              <div className={styles.dots}>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
              </div>
            </div>
          ) : (
            <div className={styles.gridContainer}>
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className={`${styles.playlistCard} ${
                    selectedPlaylistId === playlist.id && isLoadingTracks ? styles.loading : ''
                  }`}
                  onMouseEnter={playHoverSound}
                >
                  <button
                    onClick={() => handlePlaylistClick(playlist.id)}
                    className={styles.imageButton}
                    aria-label={`Load ${playlist.name}`}
                  >
                    <Image
                      src={playlist.images[0]?.url || '/placeholder.jpg'}
                      alt={playlist.name}
                      className={styles.playlistImage}
                      width={300}
                      height={300}
                      sizes="(max-width: 768px) 150px, 200px"
                    />
                    {selectedPlaylistId === playlist.id && isLoadingTracks && (
                      <div className={styles.loadingOverlay}>
                        <span className={styles.loadingText}>Loading...</span>
                      </div>
                    )}
                  </button>
                  <div className={styles.titleSection}>
                    <h3 className={styles.playlistTitle}>{playlist.name}</h3>
                    <a
                      href={playlist.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.spotifyLink}
                      aria-label={`Open ${playlist.name} on Spotify`}
                    >
                      ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
          {emptyPlaylistName && (
            <div className={styles.errorMessage}>
              <p>&ldquo;{emptyPlaylistName}&rdquo; has no playable tracks.</p>
            </div>
          )}
        </div>
      </PageLayout.Body>
    </PageLayout>
  );
};

export default PlaylistsPage;