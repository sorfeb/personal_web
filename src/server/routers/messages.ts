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
      
      // TEMPORARY: Use fake user data if no auth user is present
      let dbUser;
      
      if (ctx.user) {
        // Real authenticated user
        dbUser = await ctx.db.user.findUnique({
          where: { stackAuthId: ctx.user.id }
        });

        if (!dbUser) {
          dbUser ??= await ctx.db.user.create({
            data: {
              stackAuthId: ctx.user.id,
              name: ctx.user.displayName || ctx.user.primaryEmail?.split('@')[0] || 'Anonymous',
              image: ctx.user.profileImageUrl,
              email: ctx.user.primaryEmail,
            },
          });
        }
      } else {
        // TEMPORARY: Create a test user for debugging
        const testUserId = input.tempUserId || 'temp-user-123';
        dbUser = await ctx.db.user.findUnique({
          where: { stackAuthId: testUserId }
        });

        if (!dbUser) {
          dbUser ??= await ctx.db.user.create({
            data: {
              stackAuthId: testUserId,
              name: input.tempUserName || 'Test User',
              image: input.tempUserImage || null,
              email: 'test@example.com',
            },
          });
          console.log('Created temp user for testing:', dbUser.id);
        }
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
