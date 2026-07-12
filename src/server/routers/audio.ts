import { createTRPCRouter, publicProcedure } from '../trpc';
import { audioCatalog } from '../data/audioCatalog';
import { youtubePlaylist } from '../data/youtubePlaylist';

/**
 * Serves playlists that the WMP player streams. `getCatalog` returns
 * self-hosted tracks (HTMLAudioElement engine); `getYouTubePlaylist` returns a
 * curated album streamed full-length through the YouTube engine. Edit the data
 * files under `src/server/data/` to change either playlist.
 */
export const audioRouter = createTRPCRouter({
  getCatalog: publicProcedure.query(() => audioCatalog),
  getYouTubePlaylist: publicProcedure.query(() => youtubePlaylist),
});
