import fs from 'node:fs';
import path from 'node:path';
import { parseChangelog } from '@/utils/changelog';
import pkg from '../../../package.json';
import AboutView from './AboutView';
import type { StackEntry, SystemSummary } from './AboutView';

/**
 * Server component: reads the version and release history at build time and
 * hands them to the client view. Same split as src/app/changelog/page.tsx, and
 * it keeps /about statically prerendered. Metadata lives in layout.tsx.
 */

const stripRange = (version: string): string => version.replace(/^[\^~]/, '');

/**
 * Curated, ordered stack list. Versions are read from package.json so the page
 * cannot claim a version the project is not on. jQuery earns its place on the
 * list by being genuinely surprising, so it says what it is still doing here.
 */
const STACK: readonly StackEntry[] = [
  { label: 'Next.js', version: stripRange(pkg.dependencies.next), note: 'App Router' },
  { label: 'React', version: stripRange(pkg.dependencies.react) },
  {
    label: 'Framer Motion',
    version: stripRange(pkg.dependencies['framer-motion']),
    note: 'page and card transitions',
  },
  { label: 'tRPC', version: stripRange(pkg.dependencies['@trpc/server']), note: 'typed API' },
  {
    label: 'Prisma',
    version: stripRange(pkg.dependencies['@prisma/client']),
    note: 'Neon PostgreSQL',
  },
  { label: 'CSS Modules', note: 'design tokens, no runtime CSS-in-JS' },
  { label: 'jQuery', version: stripRange(pkg.dependencies.jquery), note: 'the ripple background' },
];

export default function AboutPage() {
  const raw = fs.readFileSync(path.join(process.cwd(), 'CHANGELOG.md'), 'utf8');
  const releases = parseChangelog(raw);

  const system: SystemSummary = {
    version: pkg.version,
    latestDate: releases[0]?.date,
    releaseCount: releases.length,
    stack: STACK,
  };

  return <AboutView system={system} />;
}
