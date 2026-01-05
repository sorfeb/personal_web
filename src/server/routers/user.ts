import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { GUEST_PROFILE, AVAILABLE_AVATARS } from '../config/userConfig';

/**
 * User router for handling profile operations.
 */
export const userRouter = createTRPCRouter({
  /**
   * Fetches the current user's profile or a guest profile.
   * The service layer handles the logic of returning a guest profile if the user is not authenticated or not found.
   */
  getProfile: publicProcedure.query(async () => {
    // Stack Auth disabled - always return guest profile
    return GUEST_PROFILE;
  }),

  /**
   * Updates an authenticated user's profile.
   */
  // Stack Auth disabled - profile updates not available for guests
  updateProfile: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        avatar: z.enum(AVAILABLE_AVATARS as [string, ...string[]]).optional(),
      })
    )
    .mutation(async () => {
      // Stack Auth disabled - guests cannot update profiles
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Sign in to update your profile',
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
