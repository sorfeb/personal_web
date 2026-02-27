'use client';

import React, { useState } from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import { WMPToggleButton } from '@/components/WMPPlayer/WMPToggleButton';
import styles from './Playlists.module.css';
import { useAudioManager } from '../../hooks/useAudioManager';
import { trpc } from '../../utils/trpc';

interface Playlist {
  id: string;
  name: string;
  external_urls: { spotify: string };
  images: { url: string; height: number; width: number }[];
}

const PlaylistsPage = () => {
  const { playSound } = useAudioManager();
  const { data, isLoading } = trpc.spotify.getPlaylists.useQuery();

  const playlists = (data?.items || []) as Playlist[];

  const playHoverSound = () => playSound('divine');

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
                    className={styles.playlistCard} 
                    onMouseEnter={playHoverSound}>
                  <a
                    href={playlist.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={playlist.images[0]?.url || "/placeholder.jpg"}
                      alt={playlist.name}
                      className={styles.playlistImage}
                    />
                  </a>
                  <a
                    href={playlist.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.playlistTitle}
                  >
                    {playlist.name}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </PageLayout.Body>
    </PageLayout>
  );
};

export default PlaylistsPage;