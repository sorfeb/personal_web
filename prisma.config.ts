import { existsSync } from 'node:fs';
import { defineConfig } from 'prisma/config';

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
    // Unpooled, not DATABASE_URL. In v7 the `Datasource` type is exactly
    // `{ url?, shadowDatabaseUrl? }` — `directUrl` no longer exists, because the
    // application brings its own connection through the driver adapter in
    // `src/utils/db.ts`. That leaves this `url` serving the CLI alone, and the CLI
    // only ever runs migrations, which must bypass the Neon pooler: pooled
    // connections cannot execute DDL.
    //
    // `DATABASE_URL_UNPOOLED` is the name Neon's own Prisma guide uses, and the
    // one the Neon/Vercel integration already provisions. `DIRECT_URL` is a v6
    // leftover from when the schema had `directUrl = env("DIRECT_URL")`; it stays
    // as a fallback so existing local `.env.local` files keep working.
    //
    // `process.env`, not `env()`: the helper throws at config-load time when a
    // variable is unresolved, and the config loads for *every* command including
    // `prisma generate`, which needs no database at all. That is what broke
    // production builds (SOR-162) — Vercel has the unpooled URL but never had
    // `DIRECT_URL`. Prisma's own config reference prescribes `process.env` for
    // variables that are optional depending on the command being run.
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DIRECT_URL ?? '',
    // `migrate dev` only, for drift detection. A separate Neon database, because
    // Prisma resets it on every run. Never point this at DATABASE_URL. Absent in
    // CI, which is fine: `migrate dev` never runs there.
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
});
