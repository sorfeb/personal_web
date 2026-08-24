/**
 * SOR-158 — move Message from a single implicit room to explicit Room rows.
 *
 * Why a script rather than `prisma db push` alone: `Message.roomId` is required,
 * and Postgres will not add a NOT NULL column to a populated table. The column
 * has to arrive nullable, get backfilled, and only then be tightened. `db push`
 * cannot express that sequence, and this project has no `prisma/migrations/`
 * directory to hold a hand-written migration.
 *
 * Run order:
 *   1. npx tsx --env-file=.env.local scripts/migrate-chat-rooms.ts --dry-run
 *   2. npx tsx --env-file=.env.local scripts/migrate-chat-rooms.ts
 *   3. npx prisma db push        (adds foreign keys and indexes)
 *
 * Idempotent: every statement is guarded, so a re-run after a partial failure
 * resumes rather than duplicating. Safe to run twice.
 */
import { PrismaClient } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import { DEFAULT_ROOM_SLUG } from '../src/constants/chat';

neonConfig.webSocketConstructor ??= ws;

const DRY_RUN = process.argv.includes('--dry-run');

/** cuid-shaped id, matching what Prisma's @default(cuid()) would produce. */
function makeId(): string {
  const time = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 10);
  return `c${time}${random}`.slice(0, 25).padEnd(25, '0');
}

function log(step: string, detail: string) {
  process.stdout.write(`${DRY_RUN ? '[dry-run] ' : ''}${step}: ${detail}\n`);
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. Run with: npx tsx --env-file=.env.local scripts/migrate-chat-rooms.ts'
    );
  }

  const db = new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });

  try {
    // ---- Survey ------------------------------------------------------------
    const [{ count: messageCount }] = await db.$queryRaw<{ count: string }[]>`
      SELECT COUNT(*)::text AS count FROM "Message"
    `;
    log('survey', `${messageCount} existing message(s)`);

    const roomTableExists = await db.$queryRaw<{ exists: boolean }[]>`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'Room'
      ) AS exists
    `;
    log('survey', `Room table exists: ${roomTableExists[0].exists}`);

    const roomIdColumn = await db.$queryRaw<{ exists: boolean }[]>`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'Message' AND column_name = 'roomId'
      ) AS exists
    `;
    log('survey', `Message.roomId exists: ${roomIdColumn[0].exists}`);

    if (DRY_RUN) {
      log('plan', 'would create Room, seed the default room, add Message.roomId');
      log('plan', `would backfill ${messageCount} message(s) to "${DEFAULT_ROOM_SLUG}"`);
      log('plan', 'would set Message.roomId NOT NULL');
      log('plan', 'no changes written');
      return;
    }

    // ---- 1. Room table -----------------------------------------------------
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Room" (
        "id"          TEXT NOT NULL,
        "slug"        TEXT NOT NULL,
        "name"        TEXT NOT NULL,
        "description" TEXT,
        "isPublic"    BOOLEAN NOT NULL DEFAULT true,
        "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
      )
    `);
    await db.$executeRawUnsafe(
      `CREATE UNIQUE INDEX IF NOT EXISTS "Room_slug_key" ON "Room"("slug")`
    );
    log('step 1', 'Room table ready');

    // ---- 2. Seed the default room -----------------------------------------
    await db.$executeRaw`
      INSERT INTO "Room" ("id", "slug", "name", "description", "isPublic", "updatedAt")
      VALUES (
        ${makeId()},
        ${DEFAULT_ROOM_SLUG},
        'General',
        'Everything that does not belong anywhere else.',
        true,
        CURRENT_TIMESTAMP
      )
      ON CONFLICT ("slug") DO NOTHING
    `;

    const [defaultRoom] = await db.$queryRaw<{ id: string }[]>`
      SELECT "id" FROM "Room" WHERE "slug" = ${DEFAULT_ROOM_SLUG}
    `;
    if (!defaultRoom) {
      throw new Error(`Failed to seed or find the "${DEFAULT_ROOM_SLUG}" room`);
    }
    log('step 2', `default room id ${defaultRoom.id}`);

    // ---- 3. Columns, nullable first ---------------------------------------
    await db.$executeRawUnsafe(
      `ALTER TABLE "Message" ADD COLUMN IF NOT EXISTS "roomId" TEXT`
    );
    await db.$executeRawUnsafe(
      `ALTER TABLE "Message" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3)`
    );
    log('step 3', 'Message.roomId and Message.deletedAt added (nullable)');

    // ---- 4. Backfill -------------------------------------------------------
    const backfilled = await db.$executeRaw`
      UPDATE "Message" SET "roomId" = ${defaultRoom.id} WHERE "roomId" IS NULL
    `;
    log('step 4', `backfilled ${backfilled} message(s)`);

    // Counted as text, not bigint: the tsconfig target predates BigInt literals,
    // and a string comparison against '0' needs no numeric coercion.
    const [{ count: orphans }] = await db.$queryRaw<{ count: string }[]>`
      SELECT COUNT(*)::text AS count FROM "Message" WHERE "roomId" IS NULL
    `;
    if (orphans !== '0') {
      throw new Error(`${orphans} message(s) still have a null roomId; aborting`);
    }

    // ---- 5. Tighten --------------------------------------------------------
    await db.$executeRawUnsafe(
      `ALTER TABLE "Message" ALTER COLUMN "roomId" SET NOT NULL`
    );
    log('step 5', 'Message.roomId is now NOT NULL');

    log('done', 'now run: npx prisma db push  (adds foreign keys and indexes)');
  } finally {
    await db.$disconnect();
  }
}

main().catch((error) => {
  process.stderr.write(`migrate-chat-rooms failed: ${String(error)}\n`);
  process.exit(1);
});
