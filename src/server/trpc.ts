import { initTRPC, TRPCError } from '@trpc/server';
import { db } from '../utils/db';
import { stackServerApp } from '../stack';

/**
 * Context options for App Router (using Fetch API)
 */
type CreateContextOptions = {
  req: Request;
};

/**
 * Creates the context for the tRPC API
 * This runs for every tRPC request and provides shared data
 */
export const createTRPCContext = async (opts: CreateContextOptions) => {
  const { req } = opts;
  
  console.log('🔧 Creating tRPC context...');

  // Get the user from StackAuth 
  let user = null;
  try {
    // Extract cookies from the request headers
    const cookieHeader = req.headers.get('cookie');
    console.log('🍪 Cookie header:', cookieHeader ? 'Present' : 'Missing');
    
    // For App Router, we need to pass the request properly
    user = await stackServerApp.getUser();
    
    console.log('✅ Authenticated user:', user?.displayName || user?.primaryEmail || 'Unknown');
    
  } catch (error) {
    console.log('ℹ️  No authenticated user:', error instanceof Error ? error.message : 'Unknown error');
  }

  return {
    req,
    db,
    user,
  };
};

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: undefined, // You can add superjson here if needed
  errorFormatter({ shape }) {
    return {
      ...shape,
      data: {
        ...shape.data,
      },
    };
  },
});

/**
 * Create a server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  
  return next({
    ctx: {
      // infers the `user` as non-nullable
      ...ctx,
      user: ctx.user,
    },
  });
});
