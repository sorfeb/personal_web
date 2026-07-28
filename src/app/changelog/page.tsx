import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import { parseChangelog } from '@/utils/changelog';
import pkg from '../../../package.json';
import ChangelogView from './ChangelogView';

export const metadata: Metadata = {
  title: 'System Update',
  description: 'Release history for this dashboard.',
};

export default function ChangelogPage() {
  const raw = fs.readFileSync(path.join(process.cwd(), 'CHANGELOG.md'), 'utf8');
  const releases = parseChangelog(raw);

  return <ChangelogView releases={releases} currentVersion={pkg.version} />;
}
