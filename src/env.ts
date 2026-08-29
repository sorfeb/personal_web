import { z } from 'zod';

/**
 * The environment contract.
 *
 * One declaration of every variable this application needs, validated once at
 * startup rather than discovered one at a time at first use. Before this file,
 * a missing variable surfaced as a `TRPCError` inside a serverless function in
 * front of a visitor, and only for whichever feature happened to be opened
 * first. Now the process refuses to start and names everything that is wrong.
 *
 * **Server only.** Importing this from a client component would send the
 * variable names into the browser bundle, so the guard below fails loudly if
 * that ever happens. `src/components/Providers/TRPCProvider.tsx` reads
 * `VERCEL_URL` and `PORT` directly and deliberately keeps doing so: it carries
 * `'use client'`, so it must not import this file.
 */

if (typeof window !== 'undefined') {
  throw new Error(
    'src/env.ts is server-only and was imported from client code. ' +
      'Read the variable through a server component, a tRPC procedure, or ' +
      'process.env directly if it is a NEXT_PUBLIC_ value.'
  );
}

/**
 * Required versus optional is a deliberate split, not an oversight.
 *
 * Required means the site cannot function at all: no database, no sign-in.
 * Failing to boot is the correct response, because every page is degraded
 * anyway.
 *
 * Optional means one feature stops working. Promoting these to required would
 * turn a missing Last.fm key into a total outage, which trades a small failure
 * for a large one. They keep the existing behaviour of throwing at the point of
 * use, but now read through a typed accessor rather than a bare `process.env`
 * lookup, so the call sites still narrow correctly.
 */
const schema = z.object({
  // --- Required ---------------------------------------------------------
  DATABASE_URL: z
    .string()
    .min(1)
    .refine(
      (v) => v.startsWith('postgres://') || v.startsWith('postgresql://'),
      { message: 'must be a postgres:// or postgresql:// connection string' }
    ),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),

  /**
   * Read by Better Auth itself, never by our code. Declared so a missing value
   * fails at boot instead of producing an opaque auth error later. The same
   * reasoning applies to `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` below: a variable
   * consumed inside a dependency is invisible to a grep of `src/`, which is
   * exactly the kind that goes missing unnoticed.
   */
  BETTER_AUTH_SECRET: z.string().min(1),

  // --- Optional ---------------------------------------------------------
  /**
   * Falls back to localhost in `src/lib/auth.ts`. Left optional to preserve
   * that behaviour exactly; worth revisiting, because a missing value in
   * production points OAuth callbacks at localhost and fails confusingly.
   */
  BETTER_AUTH_URL: z.string().url().optional(),

  /** Grants moderation and room creation. Absent means nobody is the owner. */
  OWNER_USER_ID: z.string().min(1).optional(),

  SPOTIFY_CLIENT_ID: z.string().min(1).optional(),
  SPOTIFY_CLIENT_SECRET: z.string().min(1).optional(),
  SPOTIFY_USER_ID: z.string().min(1).optional(),
  LASTFM_API_KEY: z.string().min(1).optional(),

  /**
   * Consumed by `next-cloudinary` internally, which is why no `process.env`
   * reference to it exists anywhere in `src/`. `/media` and `/photos` render
   * broken images without it. Declared here for the boot check and as
   * documentation; the library still reads it from `process.env` itself, since
   * Next inlines `NEXT_PUBLIC_` values at build time and they cannot be routed
   * through an object.
   */
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
});

/**
 * Blank has to become absent before validation, not be rejected during it.
 *
 * Vercel's UI accepts an empty value, and `z.string()` considers `''` a valid
 * string, so a blank secret would otherwise pass straight through to whatever
 * consumes it. Adding `.min(1)` catches that, but then a blank *optional*
 * variable fails too: `''` is present-but-invalid rather than missing, so
 * leaving `OWNER_USER_ID` empty would stop the whole application from starting
 * over a variable that is allowed to be unset. Deleting the key first makes
 * blank and unset mean the same thing, which is what a reader expects.
 */
function withoutBlanks(
  source: NodeJS.ProcessEnv
): Record<string, string | undefined> {
  // Deliberately not typed as `NodeJS.ProcessEnv`: Next declares `NODE_ENV` as
  // a required key on it, so an object built up from `{}` can never satisfy it.
  // This value only ever feeds the parser, so a plain record is the honest type.
  const out: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(source)) {
    if (value !== '') out[key] = value;
  }
  return out;
}

type Env = z.infer<typeof schema>;

function load(): Env {
  /**
   * Builds that legitimately have no secrets: CI, a fresh worktree, Docker.
   * Next collects page data during `next build`, which imports this module, so
   * without an escape hatch those builds fail on variables they were never
   * going to use.
   */
  if (process.env.SKIP_ENV_VALIDATION) {
    return process.env as unknown as Env;
  }

  const parsed = schema.safeParse(withoutBlanks(process.env));

  if (!parsed.success) {
    // Report every problem at once. Fixing one variable, rebooting, and
    // discovering the next is the slow way to find out the shape of a
    // misconfiguration.
    const problems = parsed.error.issues
      .map((issue) => `  ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n');

    throw new Error(`Invalid environment variables:\n${problems}`);
  }

  return parsed.data;
}

export const env = load();
