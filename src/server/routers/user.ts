import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { GUEST_PROFILE, AVAILABLE_AVATARS, DEFAULT_AVATAR } from '../config/userConfig';

/**
 * User router for handling profile operations.
 */
export const userRouter = createTRPCRouter({
  /**
   * Fetches the current user's profile or a guest profile.
   */
  getProfile: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      return GUEST_PROFILE;
    }

    return {
      id: ctx.user.id,
      name: ctx.user.name ?? 'Player',
      gamerscore: (ctx.user as Record<string, unknown>).gamerscore as number ?? 0,
      avatar: ((ctx.user as Record<string, unknown>).avatar as string) ?? DEFAULT_AVATAR,
      isGuest: false,
    };
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
