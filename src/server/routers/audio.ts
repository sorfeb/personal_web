import { createTRPCRouter, publicProcedure } from '../trpc';
import { audioCatalog } from '../data/audioCatalog';

/**
 * Serves self-hosted audio tracks that the WMP player streams through its
 * HTMLAudioElement engine. Edit `src/server/data/audioCatalog.ts` to change
 * the default playlist.
 */
export const audioRouter = createTRPCRouter({
  getCatalog: publicProcedure.query(() => audioCatalog),
});
