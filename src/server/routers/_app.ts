import { createTRPCRouter } from '../trpc';
import { messagesRouter } from './messages';
import { roomsRouter } from './rooms';
import { userRouter } from './user';
import { spotifyRouter } from './spotify';
import { blogRouter } from './blog';
import { audioRouter } from './audio';
import { lastfmRouter } from './lastfm';
import { achievementsRouter } from './achievements';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  messages: messagesRouter,
  rooms: roomsRouter,
  user: userRouter,
  spotify: spotifyRouter,
  blog: blogRouter,
  audio: audioRouter,
  lastfm: lastfmRouter,
  achievements: achievementsRouter,
});

export type AppRouter = typeof appRouter;
