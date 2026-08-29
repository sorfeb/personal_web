import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, publicProcedure, ownerProcedure } from '../trpc';
import { env } from '../../env';

/**
 * Slugs address rooms in URLs and realtime channel names, so the shape is
 * constrained rather than merely trimmed.
 */
const roomSlugSchema = z
  .string()
  .min(1)
  .max(48)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug must be lowercase alphanumeric words separated by single hyphens'
  );

export const roomsRouter = createTRPCRouter({
  /**
   * Public room directory.
   *
   * Private rooms are omitted for everyone but the owner, so a non-owner cannot
   * learn that a room exists by reading the list.
   */
  list: publicProcedure.query(async ({ ctx }) => {
    const isOwner =
      Boolean(env.OWNER_USER_ID) && ctx.user?.id === env.OWNER_USER_ID;

    return await ctx.db.room.findMany({
      where: isOwner ? undefined : { isPublic: true },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        isPublic: true,
        _count: { select: { messages: { where: { deletedAt: null } } } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: roomSlugSchema }))
    .query(async ({ ctx, input }) => {
      const room = await ctx.db.room.findUnique({
        where: { slug: input.slug },
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
          isPublic: true,
        },
      });

      if (!room) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Room not found' });
      }

      // A private room is invisible rather than forbidden: replying FORBIDDEN
      // would confirm the slug exists to anyone probing for it.
      const isOwner =
        Boolean(env.OWNER_USER_ID) && ctx.user?.id === env.OWNER_USER_ID;

      if (!room.isPublic && !isOwner) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Room not found' });
      }

      return room;
    }),

  /**
   * Owner-only.
   *
   * Room names and slugs are user-visible content on a recruiter-facing site, so
   * letting any signed-in visitor mint them is a spam surface with no upside for
   * a portfolio. Revisit if the chat ever earns a community.
   */
  create: ownerProcedure
    .input(
      z.object({
        slug: roomSlugSchema,
        name: z.string().trim().min(1).max(64),
        description: z.string().trim().max(200).optional(),
        isPublic: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.room.findUnique({
        where: { slug: input.slug },
        select: { id: true },
      });

      if (existing) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: `A room with the slug "${input.slug}" already exists`,
        });
      }

      return await ctx.db.room.create({
        data: input,
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
          isPublic: true,
        },
      });
    }),
});
