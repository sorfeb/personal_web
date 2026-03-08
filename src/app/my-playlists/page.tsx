'use client';

import React, { useEffect, useState } from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import { WMPToggleButton } from '@/components/WMPPlayer/WMPToggleButton';
import styles from './Playlists.module.css';
import { useAudioManager } from '../../hooks/useAudioManager';
import { useWMPPlayerContext } from '@/context/WMPPlayerContext';
import { trpc } from '../../utils/trpc';

interface Playlist {
  id: string;
  name: string;
  external_urls: { spotify: string };
  images: { url: string; height: number; width: number }[];
}

const PlaylistsPage = () => {
  const { playSound } = useAudioManager();
  const { setCurrentPlaylist, showPlayer } = useWMPPlayerContext();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [emptyPlaylistName, setEmptyPlaylistName] = useState<string | null>(null);

  const { data, isLoading } = trpc.spotify.getPlaylists.useQuery();
  const { data: tracks, isLoading: isLoadingTracks } = trpc.spotify.getPlaylistTracks.useQuery(
    { playlistId: selectedPlaylistId! },
    { enabled: !!selectedPlaylistId }
  );

  const playlists = (data?.items || []) as Playlist[];

  const playHoverSound = () => playSound('divine');

  const handlePlaylistClick = (playlistId: string) => {
    playSound('click');
    setSelectedPlaylistId(playlistId);
  };

  // Load tracks into player when available
  useEffect(() => {
    if (tracks !== undefined) {
      if (tracks.length > 0) {
        setCurrentPlaylist(tracks);
        showPlayer();
        setEmptyPlaylistName(null);
      } else if (selectedPlaylistId) {
        // Find playlist name for better error message
        const playlist = playlists.find(p => p.id === selectedPlaylistId);
        setEmptyPlaylistName(playlist?.name || 'Unknown playlist');
      }
    }
  }, [tracks, setCurrentPlaylist, showPlayer, selectedPlaylistId, playlists]);

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
                    <img
                      src={playlist.images[0]?.url || '/placeholder.jpg'}
                      alt={playlist.name}
                      className={styles.playlistImage}
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
              <p>"{emptyPlaylistName}" has no preview tracks available.</p>
              <p>Spotify preview URLs are deprecated and may not be available for all tracks.</p>
            </div>
          )}
        </div>
      </PageLayout.Body>
    </PageLayout>
  );
};

export default PlaylistsPage;