import { createTRPCRouter } from '../trpc';
import { messagesRouter } from './messages';
import { userRouter } from './user';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  messages: messagesRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
