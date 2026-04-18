import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

export const messagesRouter = createTRPCRouter({
  // Public procedure to get all messages (anyone can view)
  getAll: publicProcedure.query(async ({ ctx }) => {
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

    return messages;
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

      return message;
    }),
});
