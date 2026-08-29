import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '@/env';

/**
 * Type definition for our global Prisma instance
 * This prevents TypeScript errors when accessing globalThis
 */
interface GlobalForPrisma {
  prisma?: PrismaClient;
}

/**
 * Extend the globalThis type to include our Prisma instance
 * This is better than using 'unknown' type assertion
 */
declare global {
  var __prisma: GlobalForPrisma | undefined;
}

// Initialize global object if it doesn't exist
global.__prisma ??= {};

/**
 * Creates a new Prisma client instance with the node-postgres adapter
 *
 * Plain TCP to the Neon pooler rather than Neon's WebSocket driver. The
 * WebSocket driver exists for runtimes that cannot open a raw socket, which is
 * Edge and Cloudflare Workers; these functions are standard Node, so the socket
 * is available and the WebSocket layer was pure overhead. Removing it also
 * removes `ws`, whose bundled optional-accelerator probe took every database
 * read down (SOR-163). Next ships `pg` in its default serverExternalPackages
 * list, so that class of failure cannot recur here.
 *
 * @returns {PrismaClient} Configured Prisma client
 */
function createPrismaClient(): PrismaClient {
  const poolConfig = {
    connectionString: env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    // Must stay below the function's own ceiling. Vercel's Hobby default is
    // 10s, so a 10s connect timeout can never fire first: the function is
    // killed and the caller gets an opaque FUNCTION_INVOCATION_TIMEOUT rather
    // than a connection error naming the cause.
    connectionTimeoutMillis: 5000,
  };

  const adapter = new PrismaPg(poolConfig);

  const prismaClient = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development'
      ? ['error', 'warn']
      : ['error'],
    errorFormat: 'pretty',
  });

  if (process.env.NODE_ENV === 'development') {
    prismaClient.$on('error', (e) => {
      console.error('🔴 Prisma Error:', e);
    });

    prismaClient.$on('warn', (e) => {
      console.warn('🟡 Prisma Warning:', e);
    });
  }

  return prismaClient;
}

/**
 * Global Prisma client instance
 * Uses singleton pattern to prevent multiple connections
 */
export const db: PrismaClient = global.__prisma.prisma ?? createPrismaClient();

/**
 * In development, attach the client to global object to prevent
 * re-initialization during hot reloads
 */
if (process.env.NODE_ENV !== 'production') {
  global.__prisma.prisma = db;
}

/**
 * Type export for the database client
 * Useful for type inference in other parts of the application
 */
export type DatabaseClient = typeof db;
