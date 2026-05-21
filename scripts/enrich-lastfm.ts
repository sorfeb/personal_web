/**
 * Enriches a Spotify playlist's tracks with Last.fm metadata (tags + similar
 * tracks + listener counts) and caches the result in the LastfmTrack table.
 *
 * The tRPC `lastfm.*` procedures only read from this cache — never fetch on
 * the request path — so this script is the sole writer.
 *
 * Usage:
 *   npm run enrich:lastfm -- <spotifyPlaylistId> [--force] [--limit N]
 *
 * Required env vars (loaded via --env-file=.env.local in the npm script):
 *   - LASTFM_API_KEY
 *   - SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET
 *   - DATABASE_URL
 */

import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { db } from '../src/utils/db';
import {
  getTrackInfo,
  getTrackTopTags,
  getTrackSimilar,
  normalizeKey,
  type LastfmTopTag,
  type LastfmSimilarTrack,
} from '../src/server/lastfm/client';

// Last.fm's published-but-soft rate limit floats around ~5 req/sec per IP.
// We do 3 calls per track, so ~250ms between any call keeps us under that
// envelope with headroom for retries.
const CALL_DELAY_MS = 250;

interface CliArgs {
  playlistId: string;
  force: boolean;
  limit: number | null;
}

function parseArgs(argv: string[]): CliArgs {
  const positional: string[] = [];
  let force = false;
  let limit: number | null = null;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--force') {
      force = true;
    } else if (arg === '--limit') {
      const next = argv[++i];
      const n = Number(next);
      if (!Number.isInteger(n) || n <= 0) {
        throw new Error(`--limit expects a positive integer, got: ${next}`);
      }
      limit = n;
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown flag: ${arg}`);
    } else {
      positional.push(arg);
    }
  }

  if (positional.length !== 1) {
    throw new Error(
      'Usage: tsx scripts/enrich-lastfm.ts <spotifyPlaylistId> [--force] [--limit N]'
    );
  }

  return { playlistId: positional[0], force, limit };
}

function getSpotifyClient(): SpotifyApi {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET');
  }
  return SpotifyApi.withClientCredentials(clientId, clientSecret);
}

interface PlaylistTrack {
  artist: string;
  track: string;
}

async function fetchAllPlaylistTracks(
  client: SpotifyApi,
  playlistId: string
): Promise<PlaylistTrack[]> {
  const tracks: PlaylistTrack[] = [];
  let offset = 0;
  const limit = 50;

  while (true) {
    const page = await client.playlists.getPlaylistItems(
      playlistId,
      undefined,
      undefined,
      limit,
      offset
    );

    for (const item of page.items) {
      const track = item.track;
      if (!track || track.type !== 'track' || !track.id) continue;
      tracks.push({
        track: track.name,
        artist: track.artists.map((a) => a.name).join(', '),
      });
    }

    if (page.items.length < limit) break;
    offset += limit;
  }

  return tracks;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface EnrichmentResult {
  artist: string;
  track: string;
  mbid: string | null;
  listeners: number | null;
  playcount: number | null;
  url: string | null;
  tags: Array<{ name: string; count: number; url?: string }>;
  similar: Array<{ name: string; artist: string; match: number; url?: string }>;
}

async function enrichOne(track: PlaylistTrack): Promise<EnrichmentResult> {
  // The primary-artist heuristic: Spotify joins multiple artists with ", ".
  // Last.fm matches better against the lead artist alone.
  const primaryArtist = track.artist.split(',')[0].trim();

  const info = await getTrackInfo({ artist: primaryArtist, track: track.track });
  await sleep(CALL_DELAY_MS);

  let tags: LastfmTopTag[] = [];
  try {
    tags = await getTrackTopTags({ artist: primaryArtist, track: track.track });
  } catch (err) {
    console.warn(`  ⚠ tags failed for "${track.track}": ${(err as Error).message}`);
  }
  await sleep(CALL_DELAY_MS);

  let similar: LastfmSimilarTrack[] = [];
  try {
    similar = await getTrackSimilar({
      artist: primaryArtist,
      track: track.track,
      limit: 20,
    });
  } catch (err) {
    console.warn(`  ⚠ similar failed for "${track.track}": ${(err as Error).message}`);
  }

  return {
    artist: track.artist,
    track: track.track,
    mbid: info.mbid?.trim() || null,
    listeners: info.listeners ?? null,
    playcount: info.playcount ?? null,
    url: info.url ?? null,
    tags: tags.map((t) => ({ name: t.name, count: t.count, url: t.url })),
    similar: similar.map((s) => ({
      name: s.name,
      artist: s.artist.name,
      match: s.match,
      url: s.url,
    })),
  };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  console.log(`→ fetching Spotify playlist ${args.playlistId}`);
  const spotify = getSpotifyClient();
  const allTracks = await fetchAllPlaylistTracks(spotify, args.playlistId);
  const tracks = args.limit ? allTracks.slice(0, args.limit) : allTracks;
  console.log(`  found ${allTracks.length} tracks${args.limit ? ` (processing first ${tracks.length})` : ''}`);

  let processed = 0;
  let skipped = 0;
  let failed = 0;

  for (const track of tracks) {
    const artistKey = normalizeKey(track.artist);
    const trackKey = normalizeKey(track.track);

    if (!args.force) {
      const existing = await db.lastfmTrack.findUnique({
        where: { artistKey_trackKey: { artistKey, trackKey } },
        select: { id: true },
      });
      if (existing) {
        skipped++;
        continue;
      }
    }

    try {
      const result = await enrichOne(track);
      await db.lastfmTrack.upsert({
        where: { artistKey_trackKey: { artistKey, trackKey } },
        create: {
          artistKey,
          trackKey,
          artist: track.artist,
          track: track.track,
          mbid: result.mbid,
          listeners: result.listeners,
          playcount: result.playcount,
          url: result.url,
          tags: result.tags,
          similar: result.similar,
          source: 'lastfm',
        },
        update: {
          artist: track.artist,
          track: track.track,
          mbid: result.mbid,
          listeners: result.listeners,
          playcount: result.playcount,
          url: result.url,
          tags: result.tags,
          similar: result.similar,
          source: 'lastfm',
        },
      });
      processed++;
      console.log(
        `  ✓ ${track.artist} — ${track.track} (${result.tags.length} tags)`
      );
    } catch (err) {
      failed++;
      console.error(
        `  ✗ ${track.artist} — ${track.track}: ${(err as Error).message}`
      );
    }

    await sleep(CALL_DELAY_MS);
  }

  console.log(`\n done. processed=${processed} skipped=${skipped} failed=${failed}`);
  await db.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
