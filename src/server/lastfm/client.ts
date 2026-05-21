import { z } from 'zod';
import { TRPCError } from '@trpc/server';

const LASTFM_BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

function getApiKey(): string {
  const key = process.env.LASTFM_API_KEY;
  if (!key) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Missing LASTFM_API_KEY environment variable',
    });
  }
  return key;
}

// Last.fm sometimes returns `{}` where an array is expected (no results).
// Coerce empty objects to empty arrays before validating.
const emptyObjectToEmptyArray = <T>(schema: z.ZodType<T[]>) =>
  z.preprocess((val) => {
    if (val && typeof val === 'object' && !Array.isArray(val) && Object.keys(val as object).length === 0) {
      return [];
    }
    return val;
  }, schema);

const lastfmErrorSchema = z.object({
  error: z.number(),
  message: z.string(),
});

const trackInfoSchema = z.object({
  track: z.object({
    name: z.string(),
    mbid: z.string().optional(),
    url: z.string().optional(),
    listeners: z.coerce.number().optional(),
    playcount: z.coerce.number().optional(),
    artist: z.object({ name: z.string(), mbid: z.string().optional() }),
    toptags: z
      .object({
        tag: emptyObjectToEmptyArray(
          z.array(z.object({ name: z.string(), url: z.string().optional() }))
        ),
      })
      .optional(),
  }),
});

const trackTopTagsSchema = z.object({
  toptags: z.object({
    tag: emptyObjectToEmptyArray(
      z.array(
        z.object({
          name: z.string(),
          count: z.coerce.number().default(0),
          url: z.string().optional(),
        })
      )
    ),
  }),
});

const trackSimilarSchema = z.object({
  similartracks: z.object({
    track: emptyObjectToEmptyArray(
      z.array(
        z.object({
          name: z.string(),
          match: z.coerce.number().default(0),
          mbid: z.string().optional(),
          url: z.string().optional(),
          artist: z.object({ name: z.string(), mbid: z.string().optional() }),
        })
      )
    ),
  }),
});

export type LastfmTopTag = z.infer<typeof trackTopTagsSchema>['toptags']['tag'][number];
export type LastfmSimilarTrack = z.infer<typeof trackSimilarSchema>['similartracks']['track'][number];
export type LastfmTrackInfo = z.infer<typeof trackInfoSchema>['track'];

type FetchParams = Record<string, string>;

async function callLastfm<T>(
  method: string,
  params: FetchParams,
  schema: z.ZodType<T>
): Promise<T> {
  const url = new URL(LASTFM_BASE_URL);
  url.searchParams.set('method', method);
  url.searchParams.set('api_key', getApiKey());
  url.searchParams.set('format', 'json');
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url, {
    headers: { 'User-Agent': 'personal_web-vibe-map/0.1 (+https://github.com/sorfeb)' },
  });

  if (!res.ok) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: `Last.fm ${method} returned HTTP ${res.status}`,
    });
  }

  const json = (await res.json()) as unknown;

  const errorParse = lastfmErrorSchema.safeParse(json);
  if (errorParse.success) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: `Last.fm ${method} error ${errorParse.data.error}: ${errorParse.data.message}`,
    });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: `Last.fm ${method} response failed validation: ${parsed.error.message}`,
    });
  }
  return parsed.data;
}

export interface TrackQuery {
  artist: string;
  track: string;
  autocorrect?: boolean;
}

export async function getTrackInfo(query: TrackQuery): Promise<LastfmTrackInfo> {
  const data = await callLastfm(
    'track.getInfo',
    {
      artist: query.artist,
      track: query.track,
      autocorrect: query.autocorrect === false ? '0' : '1',
    },
    trackInfoSchema
  );
  return data.track;
}

export async function getTrackTopTags(query: TrackQuery): Promise<LastfmTopTag[]> {
  const data = await callLastfm(
    'track.getTopTags',
    {
      artist: query.artist,
      track: query.track,
      autocorrect: query.autocorrect === false ? '0' : '1',
    },
    trackTopTagsSchema
  );
  return data.toptags.tag;
}

export async function getTrackSimilar(
  query: TrackQuery & { limit?: number }
): Promise<LastfmSimilarTrack[]> {
  const params: FetchParams = {
    artist: query.artist,
    track: query.track,
    autocorrect: query.autocorrect === false ? '0' : '1',
  };
  if (query.limit) params.limit = String(query.limit);
  const data = await callLastfm('track.getSimilar', params, trackSimilarSchema);
  return data.similartracks.track;
}

/**
 * Normalize an artist/track string for cache key lookups. Last.fm is
 * case-insensitive and tolerant of diacritics — we mirror that loosely so
 * "Beyoncé" and "Beyonce" hit the same cache row.
 */
export function normalizeKey(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}
