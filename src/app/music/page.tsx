'use client';

import React from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import { WMPToggleButton } from '@/components/WMPPlayer/WMPToggleButton';
import { useWMPPlayerContext } from '@/context/WMPPlayerContext';
import { trpc } from '@/utils/trpc';
import styles from './Music.module.css';

const MusicPage = () => {
  const { openWithPlaylist, currentPlaylist } = useWMPPlayerContext();

  const { data: catalog, isLoading } = trpc.audio.getCatalog.useQuery();
  const { data: youtubeAlbum } = trpc.audio.getYouTubePlaylist.useQuery();

  // effect:audited — auto-load a playlist into the player on first visit so the
  // page demonstrates a working player rather than an empty UI. Prefers the
  // curated YouTube album (full-length streaming, no login); falls back to the
  // self-hosted audio catalog. Guarded so we don't trample a playlist the user
  // already loaded elsewhere.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (currentPlaylist.length > 0) return;
    if (youtubeAlbum && youtubeAlbum.length > 0) {
      openWithPlaylist(youtubeAlbum);
    } else if (catalog && catalog.length > 0) {
      openWithPlaylist(catalog);
    }
  }, [catalog, youtubeAlbum]);

  return (
    <PageLayout title="Music">
      <PageLayout.Header />
      <PageLayout.Body>
        <div className={styles.playerWrapper}>
          <div className={styles.instructions}>
            <h2>Windows Media Player</h2>
            <p>Click &ldquo;Show Player&rdquo; to open the global music player.</p>
            <p>The player is draggable and persists across pages.</p>
            {isLoading && <p className={styles.loading}>Loading playlist...</p>}
            {!isLoading && catalog && catalog.length === 0 && (
              <p className={styles.error}>
                No tracks in the audio catalog. Add entries to
                <code> src/server/data/audioCatalog.ts</code>.
              </p>
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