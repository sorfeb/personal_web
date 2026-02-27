'use client';

import React, { useEffect } from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import { WMPToggleButton } from '@/components/WMPPlayer/WMPToggleButton';
import { useWMPPlayerContext } from '@/context/WMPPlayerContext';
import { trpc } from '@/utils/trpc';
import type { Track } from '@/types/wmp';
import styles from './Music.module.css';

const MusicPage = () => {
  const { setCurrentPlaylist } = useWMPPlayerContext();

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

  // Load sample tracks into global player on mount
  useEffect(() => {
    setCurrentPlaylist(sampleTracks);
  }, []);

  return (
    <PageLayout title="Music">
      <PageLayout.Header />
      <PageLayout.Body>
        <div className={styles.playerWrapper}>
          <div className={styles.instructions}>
            <h2>Windows Media Player</h2>
            <p>Click "Show Player" to open the global music player.</p>
            <p>The player is draggable and persists across pages.</p>
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