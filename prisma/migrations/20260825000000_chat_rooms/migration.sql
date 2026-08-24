-- SOR-158: move Message from a single implicit room to explicit Room rows.
--
-- Hand-edited from `prisma migrate diff` output. The generated version emitted
--   ALTER TABLE "Message" ADD COLUMN "roomId" TEXT NOT NULL;
-- which Postgres rejects on a populated table with no default. This follows the
-- expand-and-contract pattern from the Prisma docs: add the column nullable,
-- backfill it, then tighten to NOT NULL.
--
-- The default room's id and slug are literals on purpose. A migration is frozen
-- history: it must produce the same result on a fresh database today as it did
-- against production the day it ran. Reading DEFAULT_ROOM_SLUG from application
-- code would make this file's behaviour drift with a constant. If the slug ever
-- changes, that is a new migration, not an edit to this one.

-- ---------------------------------------------------------------------------
-- Expand: Room table and its indexes
-- ---------------------------------------------------------------------------

CREATE TABLE "public"."Room" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Room_slug_key" ON "public"."Room"("slug");

CREATE INDEX "Room_isPublic_createdAt_idx" ON "public"."Room"("isPublic", "createdAt");

-- ---------------------------------------------------------------------------
-- Seed the room every existing message will be attributed to
-- ---------------------------------------------------------------------------

INSERT INTO "public"."Room" ("id", "slug", "name", "description", "isPublic", "createdAt", "updatedAt")
VALUES (
    'cmigr0000general0000room0',
    'general',
    'General',
    'Everything that does not belong anywhere else.',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- Expand: new Message columns, nullable for now
-- ---------------------------------------------------------------------------

ALTER TABLE "public"."Message" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "public"."Message" ADD COLUMN "roomId" TEXT;

-- ---------------------------------------------------------------------------
-- Backfill
-- ---------------------------------------------------------------------------

UPDATE "public"."Message"
SET "roomId" = 'cmigr0000general0000room0'
WHERE "roomId" IS NULL;

-- ---------------------------------------------------------------------------
-- Contract: tighten to NOT NULL
--
-- If the backfill above missed any row this statement raises, the transaction
-- rolls back, and `migrate deploy` reports the migration as failed. That is the
-- guard; no explicit orphan count is needed because the constraint is the check.
-- ---------------------------------------------------------------------------

ALTER TABLE "public"."Message" ALTER COLUMN "roomId" SET NOT NULL;

-- ---------------------------------------------------------------------------
-- Foreign keys and remaining indexes
--
-- The author FK is recreated to add ON DELETE CASCADE; deleting a user now
-- removes their messages rather than erroring on the constraint.
-- ---------------------------------------------------------------------------

ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_authorId_fkey";

ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_roomId_fkey"
    FOREIGN KEY ("roomId") REFERENCES "public"."Room"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_authorId_fkey"
    FOREIGN KEY ("authorId") REFERENCES "public"."User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "Message_roomId_createdAt_idx" ON "public"."Message"("roomId", "createdAt");

CREATE INDEX "Message_authorId_createdAt_idx" ON "public"."Message"("authorId", "createdAt");
