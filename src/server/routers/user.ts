import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';

/**
 * User router for handling profile operations.
 */
export const userRouter = createTRPCRouter({
  /**
   * Fetches the current user's profile or a guest profile.
   */
  getProfile: publicProcedure.query(async ({ ctx }) => {
    const guestProfile = {
      id: 'guest',
      name: 'Guest',
      gamerscore: 0,
      avatar: 'guest_gamerpic.svg',
      isGuest: true,
    };

    if (!ctx.user?.id) {
      return guestProfile;
    }

    try {
      const dbUser = await ctx.db.user.findUnique({
        where: { stackAuthId: ctx.user.id },
        select: {
          id: true,
          name: true,
          gamerscore: true,
          avatar: true,
        },
      });

      if (!dbUser) {
        console.warn(`Authenticated user with stackAuthId '${ctx.user.id}' not found in DB. Returning guest.`);
        return guestProfile;
      }

      return {
        id: dbUser.id,
        name: dbUser.name ?? 'Player',
        gamerscore: dbUser.gamerscore,
        avatar: dbUser.avatar ?? 'guest_gamerpic.svg',
        isGuest: false,
      };
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return guestProfile;
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
        const updatedUser = await ctx.db.user.update({
          where: { stackAuthId: ctx.user.id },
          data: {
            name: input.name,
            avatar: input.avatar,
          },
        });
        return updatedUser;
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
    const avatars = [
      '20001.png', '20002.png', '20003.png', '20004.png', '20006.png',
      '20008.png', '2000a.png', '2000b.png', '2000c.png', '2803d.png',
      'guest_gamerpic.svg',
    ];

    return avatars.map(avatar => ({
      id: avatar,
      name: avatar.split('.')[0],
      path: `/assets/avatars/${avatar}`,
    }));
  }),
});
