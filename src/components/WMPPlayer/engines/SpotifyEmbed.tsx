'use client';

import { memo } from 'react';
import type { SpotifyEmbedTrack } from '@/types/wmp';

interface SpotifyEmbedProps {
  track: SpotifyEmbedTrack;
}

/**
 * Renders the Spotify embed iframe for a single track. The Spotify embed
 * iframe handles playback, transport UI, and (for logged-in Premium users)
 * full track playback. Free-tier users get a 30-second preview through the
 * embed even though the Web API no longer returns `preview_url`.
 *
 * The WMP transport controls do not drive this iframe — they remain visible
 * but are no-ops for embed tracks. A future iteration can wire the Spotify
 * IFrame API (https://developer.spotify.com/documentation/embeds) to forward
 * play/pause/seek.
 */
export const SpotifyEmbed = memo<SpotifyEmbedProps>(function SpotifyEmbed({ track }) {
  const src = `https://open.spotify.com/embed/track/${encodeURIComponent(
    track.spotifyTrackId
  )}?utm_source=generator&theme=0`;

  return (
    <iframe
      title={`Spotify embed: ${track.name}`}
      src={src}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
});
