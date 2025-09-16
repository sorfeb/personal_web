import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { GUEST_PROFILE, AVAILABLE_AVATARS } from '../config/userConfig';
import { UserNotFoundError, DuplicateUserError } from '../errors/serviceErrors';

/**
 * User router for handling profile operations.
 */
export const userRouter = createTRPCRouter({
  /**
   * Fetches the current user's profile or a guest profile.
   * The service layer handles the logic of returning a guest profile if the user is not authenticated or not found.
   */
  getProfile: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.services.user.findUserByStackAuthId(ctx.user?.id);
    } catch (error) {
      console.warn('Failed to fetch user profile:', error);
      return GUEST_PROFILE;
    }
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
      try {
        return await ctx.services.user.updateUserProfile(ctx.user.id, {
          name: input.name,
          avatar: input.avatar,
        });
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: error.message,
          });
        }
        if (error instanceof DuplicateUserError) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: error.message,
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update user profile.',
          cause: error,
        });
      }
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
