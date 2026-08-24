import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { normalizeKey } from '../lastfm/client';
import type { Prisma } from '@/generated/prisma/client';

const trackQuerySchema = z.object({
  artist: z.string().min(1),
  track: z.string().min(1),
});

function cacheKey(artist: string, track: string): string {
  return `${normalizeKey(artist)}|${normalizeKey(track)}`;
}

type LastfmTagJson = { name: string; count: number; url?: string };
type LastfmSimilarJson = { name: string; artist: string; match: number; url?: string };

export interface EnrichedTrack {
  artist: string;
  track: string;
  cached: true;
  mbid: string | null;
  listeners: number | null;
  playcount: number | null;
  url: string | null;
  tags: LastfmTagJson[];
  similar: LastfmSimilarJson[];
  source: string;
  fetchedAt: string;
}

export interface MissingTrack {
  artist: string;
  track: string;
  cached: false;
}

export const lastfmRouter = createTRPCRouter({
  /**
   * Cache-only lookup for a single track. Returns null on miss — the
   * enrichment job (scripts/enrich-lastfm.ts) is responsible for populating
   * rows, never the request path.
   */
  getTrack: publicProcedure
    .input(trackQuerySchema)
    .query(async ({ ctx, input }) => {
      const row = await ctx.db.lastfmTrack.findUnique({
        where: {
          artistKey_trackKey: {
            artistKey: normalizeKey(input.artist),
            trackKey: normalizeKey(input.track),
          },
        },
      });
      if (!row) return null;
      return toEnriched(row);
    }),

  /**
   * Batch cache lookup for the vibe-map viz: pass the playlist's tracks,
   * get back a record keyed by `${normalizedArtist}|${normalizedTrack}`
   * with either the cached enrichment or a null marker for misses.
   */
  enrich: publicProcedure
    .input(
      z.object({
        tracks: z.array(trackQuerySchema).min(1).max(500),
      })
    )
    .query(async ({ ctx, input }) => {
      const keys = input.tracks.map((t) => ({
        artistKey: normalizeKey(t.artist),
        trackKey: normalizeKey(t.track),
        original: t,
      }));

      // Single round-trip via OR composition. Postgres handles 500-pair
      // OR queries comfortably; if this ever grows past that we'd switch
      // to a temp-table join or a tuple `WHERE (a,b) IN (...)`.
      const rows = await ctx.db.lastfmTrack.findMany({
        where: {
          OR: keys.map((k) => ({
            artistKey: k.artistKey,
            trackKey: k.trackKey,
          })),
        },
      });

      const byKey = new Map(
        rows.map((r) => [`${r.artistKey}|${r.trackKey}`, r])
      );

      const results: Record<string, EnrichedTrack | MissingTrack> = {};
      for (const k of keys) {
        const id = `${k.artistKey}|${k.trackKey}`;
        const row = byKey.get(id);
        results[id] = row
          ? toEnriched(row)
          : { artist: k.original.artist, track: k.original.track, cached: false };
      }
      return {
        hits: rows.length,
        misses: keys.length - rows.length,
        tracks: results,
      };
    }),

  /**
   * Aggregate tag stats across all cached tracks — useful for the vibe map's
   * color palette / cluster labels.
   */
  getTagStats: publicProcedure
    .input(z.object({ limit: z.number().int().min(1).max(200).default(50) }))
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db.lastfmTrack.findMany({
        select: { tags: true },
      });

      const counts = new Map<string, number>();
      for (const row of rows) {
        const tags = row.tags as unknown;
        if (!Array.isArray(tags)) continue;
        for (const tag of tags) {
          if (typeof tag !== 'object' || tag === null) continue;
          const name = (tag as { name?: unknown }).name;
          if (typeof name !== 'string') continue;
          counts.set(name, (counts.get(name) ?? 0) + 1);
        }
      }

      return Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, input.limit)
        .map(([name, count]) => ({ name, count }));
    }),
});

type LastfmTrackRow = {
  artist: string;
  track: string;
  mbid: string | null;
  listeners: number | null;
  playcount: number | null;
  url: string | null;
  tags: Prisma.JsonValue;
  similar: Prisma.JsonValue | null;
  source: string;
  fetchedAt: Date;
};

function toEnriched(row: LastfmTrackRow): EnrichedTrack {
  return {
    artist: row.artist,
    track: row.track,
    cached: true,
    mbid: row.mbid,
    listeners: row.listeners,
    playcount: row.playcount,
    url: row.url,
    tags: coerceJsonArray<LastfmTagJson>(row.tags),
    similar: coerceJsonArray<LastfmSimilarJson>(row.similar),
    source: row.source,
    fetchedAt: row.fetchedAt.toISOString(),
  };
}

function coerceJsonArray<T>(value: Prisma.JsonValue | null): T[] {
  if (!Array.isArray(value)) return [];
  return value as unknown as T[];
}

