-- Chat rooms (SOR-158).
--
-- Hand-edited from `prisma migrate diff`. The generated version emitted
--   ALTER TABLE "Message" ADD COLUMN "roomId" TEXT NOT NULL;
-- which fails outright on a populated table: Postgres has no value to put in
-- existing rows. The column therefore arrives nullable, gets backfilled to a
-- seeded default room, and is only then tightened. Steps 4-6 are the edit;
-- everything else is as generated.

-- 1. The author FK is recreated at the end with ON DELETE CASCADE. It was
--    RESTRICT, so deleting a user who had ever posted failed on the constraint.
ALTER TABLE "Message" DROP CONSTRAINT "Message_authorId_fkey";

-- 2. New columns. roomId is nullable for now; step 6 tightens it.
ALTER TABLE "Message" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "roomId" TEXT;

-- 3. Room table and its indexes.
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Room_slug_key" ON "Room"("slug");

CREATE INDEX "Room_isPublic_createdAt_idx" ON "Room"("isPublic", "createdAt");

-- 4. Seed the default room. The id is a fixed literal rather than a generated
--    cuid so the row is identical in every environment and this migration stays
--    deterministic. ON CONFLICT covers a database where the slug already exists.
INSERT INTO "Room" ("id", "slug", "name", "description", "isPublic", "createdAt", "updatedAt")
VALUES (
    'seed-room-general',
    'general',
    'General',
    'Everything that does not belong anywhere else.',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO NOTHING;

-- 5. Backfill. Every pre-existing message belonged to the single implicit room
--    that the schema used to assume, which is what "general" now represents.
UPDATE "Message"
SET "roomId" = (SELECT "id" FROM "Room" WHERE "slug" = 'general')
WHERE "roomId" IS NULL;

-- 6. Tighten. Fails loudly if step 5 missed anything, which is the desired
--    outcome: the migration aborts rather than half-applying.
ALTER TABLE "Message" ALTER COLUMN "roomId" SET NOT NULL;

-- 7. Remaining indexes and foreign keys.
CREATE INDEX "Message_roomId_createdAt_idx" ON "Message"("roomId", "createdAt");

CREATE INDEX "Message_authorId_createdAt_idx" ON "Message"("authorId", "createdAt");

ALTER TABLE "Message" ADD CONSTRAINT "Message_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Message" ADD CONSTRAINT "Message_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
