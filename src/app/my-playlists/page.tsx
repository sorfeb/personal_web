'use client';

import React, { useState } from 'react';
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

const PAGE_SIZE = 12; // Number of playlists per page

const PlaylistsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { playSound } = useAudioManager();
  const { data, isLoading } = trpc.spotify.getPlaylists.useQuery();

  const playlists = (data?.items || []) as Playlist[];
  const totalPages = Math.ceil(playlists.length / PAGE_SIZE);

  const playHoverSound = () => playSound('divine');
  const playClickSound = () => playSound('ting');

  const paginatedPlaylists = playlists.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <PageLayout title="My Playlists" size="wide" variant="windowed">
      <PageLayout.Header />
      <PageLayout.CloseButton />
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
            <>
              <div className={styles.gridContainer}>
                {paginatedPlaylists.map((playlist) => (
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

              {/* Pagination Controls */}
              <div className={styles.pagination}>
                <button
                  className={styles.pageButton}
                  onClick={() => {
                    if (currentPage > 1) {
                      playClickSound();
                      setCurrentPage((prev) => Math.max(prev - 1, 1));
                    }
                  }}
                  disabled={currentPage === 1}
                >
                  ←
                </button>
                <span className={styles.pageInfo}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className={styles.pageButton}
                  onClick={() => {
                    if (currentPage < totalPages) {
                      playClickSound();
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                    }
                  }}
                  disabled={currentPage === totalPages}
                >
                  →
                </button>
              </div>
            </>
          )}
        </div>
      </PageLayout.Body>
    </PageLayout>
  );
};

export default PlaylistsPage;