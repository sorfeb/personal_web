import { existsSync } from 'node:fs';
import { defineConfig, env } from 'prisma/config';

/**
 * Prisma CLI configuration (v7).
 *
 * v7 stopped loading env files on its own, which is what the old
 * `node --env-file=.env.local ...` script wrappers existed to work around.
 * Loading happens here instead, so `prisma migrate dev` and friends can be
 * invoked plainly.
 *
 * `process.loadEnvFile` is native from Node 20.12, and v7 already requires
 * Node 20.19+, so this needs no `dotenv` dependency. The existsSync guard
 * matters because the function throws on a missing file, and CI (Vercel)
 * injects real environment variables rather than shipping `.env.local`.
 */
if (existsSync('.env.local')) {
  process.loadEnvFile('.env.local');
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // DIRECT_URL, not DATABASE_URL. In v7 the `Datasource` type is exactly
    // `{ url?, shadowDatabaseUrl? }` — `directUrl` no longer exists, because the
    // application now brings its own connection through the driver adapter in
    // `src/utils/db.ts`. That leaves this `url` serving the CLI alone, and the CLI
    // only ever runs migrations, which must bypass the Neon pooler: pooled
    // connections cannot execute DDL.
    url: env('DIRECT_URL'),
    // `migrate dev` only, for drift detection. A separate Neon database, because
    // Prisma resets it on every run. Never point this at DATABASE_URL.
    shadowDatabaseUrl: env('SHADOW_DATABASE_URL'),
  },
});
