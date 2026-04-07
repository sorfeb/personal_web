'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import PageLayout from '../../components/PageLayout/PageLayout';
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
      <PageLayout.Header />
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
                    <Image
                      src={playlist.images[0]?.url || "/placeholder.jpg"}
                      alt={playlist.name}
                      className={styles.playlistImage}
                      width={300}
                      height={300}
                      sizes="(max-width: 768px) 150px, 200px"
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