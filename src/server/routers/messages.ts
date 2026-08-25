import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '@/generated/prisma/client';
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  ownerProcedure,
} from '../trpc';
import { CHAT_LIMITS } from '../../constants/chat';
import {
  sanitizeMessageText,
  assertWithinRateLimit,
} from '../services/chatService';

/** Author fields the transcript renders. Nothing wider ever leaves the server. */
const authorSelect = {
  select: {
    id: true,
    name: true,
    image: true,
  },
} as const;

const messageSelect = {
  id: true,
  text: true,
  createdAt: true,
  roomId: true,
  authorId: true,
  author: authorSelect,
} as const;

/**
 * Resolve a room slug to its id, honouring the same visibility rule as
 * `rooms.getBySlug` so a private room cannot be read through this router.
 */
async function resolveRoomId(
  db: PrismaClient,
  userId: string | null,
  slug: string
): Promise<string> {
  const room = await db.room.findUnique({
    where: { slug },
    select: { id: true, isPublic: true },
  });

  const ownerId = process.env.OWNER_USER_ID;
  const isOwner = Boolean(ownerId) && userId === ownerId;

  if (!room || (!room.isPublic && !isOwner)) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Room not found' });
  }

  return room.id;
}

export const messagesRouter = createTRPCRouter({
  /**
   * Transcript for one room, newest page first, oldest-first within the page.
   *
   * Keyset pagination on the `[roomId, createdAt]` index. The cursor is a message
   * id; `skip: 1` steps past it so a page boundary never repeats or drops a row,
   * which offset pagination cannot promise once new messages are arriving.
   */
  listByRoom: publicProcedure
    .input(
      z.object({
        roomSlug: z.string().min(1).max(48),
        cursor: z.string().cuid().optional(),
        limit: z
          .number()
          .int()
          .min(1)
          .max(CHAT_LIMITS.MAX_PAGE_SIZE)
          .default(CHAT_LIMITS.DEFAULT_PAGE_SIZE),
      })
    )
    .query(async ({ ctx, input }) => {
      const roomId = await resolveRoomId(ctx.db, ctx.user?.id ?? null, input.roomSlug);

      // Fetch newest-first so the cursor walks backwards through history, then
      // reverse for display: the transcript renders top-to-bottom into a
      // bottom-anchored container, so ascending is what puts the newest message
      // where the view lands.
      const rows = await ctx.db.message.findMany({
        where: { roomId, deletedAt: null },
        select: messageSelect,
        orderBy: { createdAt: 'desc' },
        take: input.limit + 1,
        ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
      });

      // The extra row is a lookahead probe, not content: its only job is to say
      // whether another page exists.
      const hasMore = rows.length > input.limit;
      const newestFirst = hasMore ? rows.slice(0, input.limit) : rows;

      // Oldest row of this page. Passing it back walks further into history.
      const oldest = newestFirst.at(-1);

      return {
        messages: [...newestFirst].reverse(),
        nextCursor: hasMore ? oldest?.id : undefined,
      };
    }),

  send: protectedProcedure
    .input(
      z.object({
        roomSlug: z.string().min(1).max(48),
        text: z.string().min(1).max(CHAT_LIMITS.MAX_MESSAGE_LENGTH * 4),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const roomId = await resolveRoomId(ctx.db, ctx.user?.id ?? null, input.roomSlug);

      // Length is judged after normalising, so padding cannot smuggle an
      // over-length body past the check and whitespace cannot fake content.
      const text = sanitizeMessageText(input.text);

      if (text.length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Message cannot be empty',
        });
      }

      if (text.length > CHAT_LIMITS.MAX_MESSAGE_LENGTH) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Message exceeds the maximum length of ${CHAT_LIMITS.MAX_MESSAGE_LENGTH}`,
        });
      }

      await assertWithinRateLimit(ctx.db, ctx.user.id);

      const message = await ctx.db.message.create({
        data: { text, roomId, authorId: ctx.user.id },
        select: messageSelect,
      });

      // Server-authoritative achievement: posting proves it. Never let a
      // failed grant fail the post.
      try {
        await ctx.services.user.mergeAchievements(ctx.user.id, [
          'leave-your-mark',
        ]);
      } catch {
        // Achievement grant is best-effort; the next merge retries it.
      }

      return message;
    }),

  /** Retract your own message. Soft delete, so moderation history survives. */
  deleteOwn: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.db.message.findUnique({
        where: { id: input.id },
        select: { id: true, authorId: true, roomId: true, deletedAt: true },
      });

      if (!message || message.deletedAt) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Message not found' });
      }

      if (message.authorId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You can only delete your own messages',
        });
      }

      await ctx.db.message.update({
        where: { id: input.id },
        data: { deletedAt: new Date() },
      });

      return { id: message.id, roomId: message.roomId };
    }),

  /** Owner moderation: hide anyone's message. */
  softDelete: ownerProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.db.message.findUnique({
        where: { id: input.id },
        select: { id: true, roomId: true, deletedAt: true },
      });

      if (!message || message.deletedAt) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Message not found' });
      }

      await ctx.db.message.update({
        where: { id: input.id },
        data: { deletedAt: new Date() },
      });

      return { id: message.id, roomId: message.roomId };
    }),
});
