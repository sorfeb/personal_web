import { createTRPCRouter } from '../trpc';
import { messagesRouter } from './messages';
import { userRouter } from './user';
import { spotifyRouter } from './spotify';
import { blogRouter } from './blog';
import { audioRouter } from './audio';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  messages: messagesRouter,
  user: userRouter,
  spotify: spotifyRouter,
  blog: blogRouter,
  audio: audioRouter,
});

export type AppRouter = typeof appRouter;
