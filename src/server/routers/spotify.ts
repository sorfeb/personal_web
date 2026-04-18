import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

// In-memory token cache with expiration
let accessToken: string | null = null;
let expiresAt: number | null = null;

/**
 * Internal helper to get Spotify access token with caching
 * Tokens are cached until they expire to minimize API calls
 */
async function getSpotifyToken(): Promise<string> {
  const now = Date.now();

  if (accessToken && expiresAt && now < expiresAt) {
    return accessToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const tokenUrl = process.env.SPOTIFY_TOKEN_URL;

  if (!clientId || !clientSecret || !tokenUrl) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Missing Spotify credentials in environment variables',
    });
  }

  const credentials = `${clientId}:${clientSecret}`;
  const base64Credentials = Buffer.from(credentials).toString('base64');

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${base64Credentials}`,
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: `Spotify token error: ${data.error || 'Unknown error'}`,
    });
  }

  accessToken = data.access_token;
  expiresAt = now + data.expires_in * 1000;
  
  if (!accessToken) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to obtain access token',
    });
  }
  
  return accessToken;
}

/**
 * Spotify router for managing Spotify API integrations
 */
export const spotifyRouter = createTRPCRouter({
  /**
   * Get user's public Spotify playlists
   * @returns Spotify playlists data including items array
   */
  getPlaylists: publicProcedure.query(async () => {
    try {
      const token = await getSpotifyToken();
      const userId = '21gpzfq6bukry7svlexbexaya';

      const response = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Spotify API error: ${data.error?.message || 'Unknown error'}`,
        });
      }

      return data;
    } catch (error) {

      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch Spotify playlists',
      });
    }
  }),

  /**
   * Get tracks from a Spotify playlist
   * Converts Spotify track data to Track interface format
   * Filters out tracks without preview URLs
   */
  getPlaylistTracks: publicProcedure
    .input(z.object({ playlistId: z.string().min(1) }))
    .query(async ({ input }) => {
      try {
        const token = await getSpotifyToken();

        // Fetch all playlist items (paginate if needed)
        const response = await fetch(
          `https://api.spotify.com/v1/playlists/${input.playlistId}/tracks?limit=50`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Spotify API error: ${data.error?.message || 'Unknown error'}`,
          });
        }

        // Transform Spotify tracks to Track interface format
        const tracks = (data.items || [])
          .map((item: any) => {
            const track = item.track;
            if (!track || !track.preview_url) return null;

            return {
              id: track.id,
              name: track.name,
              artist: track.artists.map((a: any) => a.name).join(', '),
              album: track.album?.name,
              duration: 30, // Spotify previews are ~30 seconds
              url: track.preview_url,
              imageUrl: track.album?.images?.[0]?.url,
              isPreview: true,
            };
          })
          .filter((track: any) => track !== null);

        return tracks;
      } catch (error) {

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch playlist tracks',
        });
      }
    }),
});
