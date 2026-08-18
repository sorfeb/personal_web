import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { AVAILABLE_AVATARS } from '../config/userConfig';

/**
 * User router for handling profile operations.
 */
export const userRouter = createTRPCRouter({
  /**
   * Fetches the current user's profile or a guest profile.
   * Reads from the database rather than the cached better-auth session so
   * gamerscore/avatar are never stale after a write.
   */
  getProfile: publicProcedure.query(async ({ ctx }) => {
    return ctx.services.user.findUserById(ctx.user?.id);
  }),

  /**
   * Updates an authenticated user's profile.
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        avatar: z.enum(AVAILABLE_AVATARS as [string, ...string[]]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.update({
        where: { id: ctx.user.id },
        data: input,
      });
    }),

  /**
   * Returns a list of available avatars.
   */
  getAvailableAvatars: publicProcedure.query(() => {
    return AVAILABLE_AVATARS.map(avatar => ({
      id: avatar,
      name: avatar.split('.')[0],
      path: `/assets/avatars/${avatar}`,
    }));
  }),
});
