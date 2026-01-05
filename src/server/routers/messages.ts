import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

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

  // TEMPORARILY PUBLIC for testing authentication issues
  create: publicProcedure
    .input(z.object({
      text: z.string().min(1, "Message cannot be empty").max(500, "Message too long"),
      // Temporarily accept user info from frontend until auth is fixed
      tempUserId: z.string().optional(),
      tempUserName: z.string().optional(),
      tempUserImage: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      console.log('Messages.create - User in context:', ctx.user ? 'Present' : 'Not present');
      console.log('Messages.create - Input:', input);
      
      // Guest mode - Stack Auth disabled
      // Create or find guest user for messaging
      const guestUserId = input.tempUserId || 'guest-user';
      let dbUser = await ctx.db.user.findUnique({
        where: { stackAuthId: guestUserId }
      });

      if (!dbUser) {
        dbUser = await ctx.db.user.create({
          data: {
            stackAuthId: guestUserId,
            name: input.tempUserName || 'Guest',
            image: input.tempUserImage || null,
            email: 'guest@example.com',
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
