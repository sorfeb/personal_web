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
      take: 100, // Limit to last 100 messages
    });

    return messages;
  }),

  // Protected procedure to create a message (only authenticated users)
  create: protectedProcedure
    .input(z.object({
      text: z.string().min(1, "Message cannot be empty").max(500, "Message too long"),
    }))
    .mutation(async ({ input, ctx }) => {
      // First, ensure the user exists in our database
      let dbUser = await ctx.db.user.findUnique({
        where: { stackAuthId: ctx.user.id }
      });

      if (!dbUser) {
        // Create user if doesn't exist
        dbUser = await ctx.db.user.create({
          data: {
            stackAuthId: ctx.user.id,
            name: ctx.user.displayName || ctx.user.primaryEmail?.split('@')[0] || 'Anonymous',
            image: ctx.user.profileImageUrl,
            email: ctx.user.primaryEmail,
          },
        });
      }

      // Create the message
      const message = await ctx.db.message.create({
        data: {
          text: input.text,
          authorId: dbUser.id,
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
