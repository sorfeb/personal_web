'use client';

import React from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import { WMPPlayer } from './_components/WMPPlayer';
import { trpc } from '@/utils/trpc';
import type { Track } from '@/types/wmp';
import styles from './Music.module.css';

const MusicPage = () => {
  // Fetch playlists from Spotify
  const { data: playlistsData, isLoading } = trpc.spotify.getPlaylists.useQuery();

  // Convert Spotify tracks to our Track format
  // For now, we'll use placeholder tracks until full Spotify integration
  const sampleTracks: Track[] = [
    {
      id: '1',
      name: 'Sample Track 1',
      artist: 'Sample Artist',
      duration: 180,
      url: '/assets/audio/ps2_ding.wav', // Placeholder - will use Spotify preview URLs
      isPreview: true,
    },
    {
      id: '2',
      name: 'Sample Track 2',
      artist: 'Sample Artist',
      duration: 240,
      url: '/assets/audio/snd_buttonselect.wav',
      isPreview: true,
    },
  ];

  return (
    <PageLayout title="Music">
      <PageLayout.Header />
      <PageLayout.Body>
        <div className={styles.playerWrapper}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <span className={styles.text}>Loading Music Player</span>
              <div className={styles.dots}>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
              </div>
            </div>
          ) : (
            <WMPPlayer
              skinPath="/assets/skins/headspace"
              playlist={sampleTracks}
              autoPlay={false}
            />
          )}
        </div>
      </PageLayout.Body>
    </PageLayout>
  );
};

export default MusicPage;