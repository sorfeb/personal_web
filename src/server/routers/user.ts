import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { GUEST_PROFILE, AVAILABLE_AVATARS } from '../config/userConfig';

/**
 * User router for handling profile operations.
 */
export const userRouter = createTRPCRouter({
  /**
   * Fetches the current user's profile or a guest profile.
   */
  getProfile: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) {
      return GUEST_PROFILE;
    }
    try {
      return await ctx.services.user.findUserByStackAuthId(ctx.user.id);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
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
        avatar: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.services.user.updateUserProfile(ctx.user.id, {
          name: input.name,
          avatar: input.avatar,
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: `User with ID '${ctx.user.id}' not found.`,
            });
          }
          if (error.code === 'P2002') {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'The provided data conflicts with an existing user.',
            });
          }
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
