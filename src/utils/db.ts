import { PrismaClient } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

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
 * Configuration for Neon WebSocket connection
 * Only configure this once to avoid multiple assignments
 */
neonConfig.webSocketConstructor ??= ws;

/**
 * Validates environment variables required for database connection
 * @returns {string} The validated database URL
 * @throws {Error} If DATABASE_URL is not set or invalid
 */
function validateEnvironmentVariables(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL environment variable is not set. ' +
      'Please check your .env.local file and ensure it contains a valid PostgreSQL connection string.'
    );
  }

  if (typeof databaseUrl !== 'string') {
    throw new Error(
      `DATABASE_URL must be a string, but received ${typeof databaseUrl}. ` +
      'This usually indicates an issue with environment variable parsing.'
    );
  }

  const validPrefixes = ['postgres://', 'postgresql://'];
  const hasValidPrefix = validPrefixes.some(prefix => 
    databaseUrl.startsWith(prefix)
  );

  if (!hasValidPrefix) {
    throw new Error(
      `DATABASE_URL must start with one of: ${validPrefixes.join(', ')}. ` +
      `Received: ${databaseUrl.substring(0, 20)}...`
    );
  }

  return databaseUrl;
}

/**
 * Creates a new Prisma client instance with Neon serverless adapter
 * @returns {PrismaClient} Configured Prisma client
 */
function createPrismaClient(): PrismaClient {
  try {
    const databaseUrl = validateEnvironmentVariables();

    const poolConfig = {
      connectionString: databaseUrl,
      max: 10, 
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    };

    const adapter = new PrismaNeon(poolConfig);

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
  } catch (error) {
    console.error('❌ Failed to create Prisma client:', error);
    throw new Error(
      `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
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

/**
 * Utility function to test database connection
 * @returns {Promise<boolean>} True if connection is successful
 */
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    await db.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

/**
 * Gracefully disconnect from the database
 * Should be called when the application is shutting down
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await db.$disconnect();
    console.log('✅ Database connection closed successfully');
  } catch (error) {
    console.error('❌ Error while disconnecting from database:', error);
  }
}
