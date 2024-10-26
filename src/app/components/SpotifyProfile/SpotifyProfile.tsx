'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './SpotifyProfile.module.css';
import Image from 'next/image';

interface SpotifyProfileData {
  name: string;
  images?: { url: string }[];
}

const SpotifyProfile: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [profileData, setProfileData] = useState<SpotifyProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const profileUrl = process.env.POTIFY_PROFILE_URL;
  const accessToken = process.env.SPOTIFY_CLIENT_SECRE;

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!profileUrl || !accessToken) {
        setError('Profile URL or access token is missing.');
        return;
      }

      try {
        const response = await fetch(profileUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`, // Add access token to headers
          },
        });

        console.log(fetchProfileData);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching Spotify profile:', error);
        setError('Failed to load Spotify profile.');
      }
    };

    fetchProfileData();
  }, [profileUrl, accessToken]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setMousePosition({ x, y });
        cardRef.current.style.setProperty('--mouse-x', `${x}px`);
        cardRef.current.style.setProperty('--mouse-y', `${y}px`);
      }
    };

    if (cardRef.current) {
      cardRef.current.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (cardRef.current) {
        cardRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  if (!profileData) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const imageUrl = profileData.images?.[0]?.url || '/default-profile.png';

  return (
    <div className={styles.card} ref={cardRef}>
      <div className={styles.glow}></div>
      <div className={styles.iconWrapper}>
        <Image 
          src={imageUrl} 
          alt={profileData.name} 
          width={40} 
          height={40} 
          className={styles.icon}
        />
      </div>
      <h2 className={styles.title}>{profileData.name}</h2>
    </div>
  );
};

export default SpotifyProfile;
