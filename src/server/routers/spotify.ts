import { z } from 'zod';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import type { SpotifyEmbedTrack } from '@/types/wmp';

let spotifyClient: SpotifyApi | null = null;

function getSpotifyClient(): SpotifyApi {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Missing Spotify credentials in environment variables',
    });
  }

  if (!spotifyClient) {
    spotifyClient = SpotifyApi.withClientCredentials(clientId, clientSecret);
  }
  return spotifyClient;
}

function wrap(message: string, err: unknown): never {
  if (err instanceof TRPCError) throw err;
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: `${message}: ${err instanceof Error ? err.message : 'Unknown error'}`,
  });
}

export const spotifyRouter = createTRPCRouter({
  /**
   * Public playlists for the configured Spotify user. Returns the SDK's
   * `Page<SimplifiedPlaylist>` shape so consumers get full typing.
   */
  getPlaylists: publicProcedure.query(async () => {
    const userId = process.env.SPOTIFY_USER_ID;
    if (!userId) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Missing SPOTIFY_USER_ID env var',
      });
    }

    try {
      return await getSpotifyClient().playlists.getUsersPlaylists(userId);
    } catch (err) {
      wrap('Failed to fetch Spotify playlists', err);
    }
  }),

  /**
   * Tracks for a single playlist, mapped to the WMP `SpotifyEmbedTrack`
   * shape. Playback runs via the Spotify embed iframe — `preview_url` is no
   * longer required (and no longer reliably returned by Client Credentials
   * since late 2024).
   */
  getPlaylistTracks: publicProcedure
    .input(z.object({ playlistId: z.string().min(1) }))
    .query(async ({ input }): Promise<SpotifyEmbedTrack[]> => {
      try {
        const page = await getSpotifyClient().playlists.getPlaylistItems(
          input.playlistId
        );

        return page.items.flatMap((item): SpotifyEmbedTrack[] => {
          const track = item.track;
          // Episodes (podcasts) and removed-from-Spotify tracks are filtered.
          if (!track || track.type !== 'track' || !track.id) return [];

          return [{
            source: 'spotify-embed',
            id: track.id,
            name: track.name,
            artist: track.artists.map((a) => a.name).join(', '),
            album: track.album?.name,
            imageUrl: track.album?.images?.[0]?.url,
            spotifyTrackId: track.id,
            spotifyUrl: track.external_urls?.spotify ?? `https://open.spotify.com/track/${track.id}`,
          }];
        });
      } catch (err) {
        wrap('Failed to fetch playlist tracks', err);
      }
    }),
});
