'use client';

import React, { useEffect, useState } from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import styles from './page.module.css';
import { useVolume } from '@/context/VolumeContext';

interface Playlist {
  id: string;
  name: string;
  external_urls: { spotify: string };
  images: { url: string; height: number; width: number }[];
}

const PAGE_SIZE = 12; // Number of playlists per page

const PlaylistsPage = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/playlists`);
        const data = await res.json();
        setPlaylists(data.items);
        setTotalPages(Math.ceil(data.items.length / PAGE_SIZE));
      } catch (error) {
        console.error("Failed to fetch playlists", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

    const { volume } = useVolume();
    const playSound = () => {
      const audio = new Audio('/assets/audio/ps2_divine.wav');
      audio.volume = volume;
      audio.play();
    };  

    const playClickSound = () => {
      const audio = new Audio('/assets/audio/ps2_ting.wav');
      audio.volume = volume;
      audio.play();
    };  

  const paginatedPlaylists = playlists.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <PageLayout title="My Playlists">
      <div className={styles.container}>
        {loading ? (
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
                    onMouseEnter={() => playSound()}>
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
    </PageLayout>
  );
};

export default PlaylistsPage;