import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

export const messagesRouter = createTRPCRouter({
  // Public procedure to get the recent messages (anyone can view)
  getAll: publicProcedure.query(async ({ ctx }) => {
    // Take the newest 100, then hand them back oldest-first. The transcript
    // renders top-to-bottom into a container that auto-scrolls to the bottom,
    // so ascending order is what puts the newest message where the view lands.
    const messages = await ctx.db.message.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            name: true,
            image: true,
            id: true,
          },
        },
      },
      take: 100,
    });

    return messages.reverse();
  }),

  // Only authenticated users can create messages
  create: protectedProcedure
    .input(z.object({
      text: z.string().min(1, "Message cannot be empty").max(500, "Message too long"),
    }))
    .mutation(async ({ input, ctx }) => {
      const message = await ctx.db.message.create({
        data: {
          text: input.text,
          authorId: ctx.user.id,
        },
        include: {
          author: {
            select: {
              name: true,
              image: true,
              id: true,
            },
          },
        },
      });

      // Server-authoritative achievement: posting proves it. Never let a
      // failed grant fail the post itself.
      try {
        await ctx.services.user.mergeAchievements(ctx.user.id, ['leave-your-mark']);
      } catch {
        // Achievement grant is best-effort; the next merge retries it.
      }

      return message;
    }),
});
