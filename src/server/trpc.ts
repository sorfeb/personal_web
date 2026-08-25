import { initTRPC, TRPCError } from '@trpc/server';
import { db } from '../utils/db';
import { auth } from '../lib/auth';
import { UserService } from './services/userService';

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

  const session = await auth.api.getSession({ headers: req.headers });
  const user = session?.user ?? null;

  // Instantiate services
  const services = {
    user: new UserService(db),
  };

  return {
    req,
    db,
    user,
    services,
  };
};

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: undefined,
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
 * This is how you create new routers and sub-routers in your tRPC API.
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 *
 * Verifies the session is valid and guarantees `ctx.user` is not null.
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

/**
 * Owner-only procedure
 *
 * The site has exactly one operator, so moderation is gated on a single user id
 * from the environment rather than a roles table.
 *
 * Fails closed: with `OWNER_USER_ID` unset nobody is the owner, so a missing or
 * mistyped env var locks the tools rather than opening them to everyone.
 */
export const ownerProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const ownerId = process.env.OWNER_USER_ID;

  if (!ownerId || ctx.user.id !== ownerId) {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }

  return next({ ctx });
});
