/**
 * Parser for release-please generated CHANGELOG.md files.
 *
 * Understands the conventional-changelog shape release-please emits:
 *
 * ```
 * ## [1.2.0](https://github.com/owner/repo/compare/v1.1.0...v1.2.0) (2026-07-28)
 * ### Features
 * * **card:** add gear section ([abc1234](https://github.com/owner/repo/commit/abc1234...))
 * ```
 *
 * Plain `## 1.0.0 (2026-07-28)` headings (first release, no compare link)
 * are handled too.
 */

export interface ChangelogItem {
  /** Conventional-commit scope, e.g. "card" from `**card:** ...` */
  scope?: string;
  /** Human-readable change description with markdown links stripped */
  text: string;
  /** Short commit hash, when the bullet ends in a commit link */
  commitHash?: string;
  /** Full URL of the commit link */
  commitUrl?: string;
}

export interface ChangelogSection {
  /** e.g. "Features", "Bug Fixes" */
  title: string;
  items: ChangelogItem[];
}

export interface ChangelogRelease {
  version: string;
  /** ISO date string as written by release-please, e.g. "2026-07-28" */
  date?: string;
  /** GitHub compare URL when the heading links the version */
  compareUrl?: string;
  sections: ChangelogSection[];
}

// Groups: 1 = linked version, 2 = compare URL, 3 = plain version, 4 = date
const RELEASE_HEADING = /^##\s+(?:\[(\d+\.\d+\.\d+[^\]]*)\]\(([^)]+)\)|(\d+\.\d+\.\d+\S*))(?:\s+\((\d{4}-\d{2}-\d{2})\))?/;
const SECTION_HEADING = /^###\s+(.+)$/;
const BULLET = /^\*\s+(.*)$/;
const SCOPE_PREFIX = /^\*\*([^*]+):\*\*\s*/;
// Groups: 1 = commit hash, 2 = commit URL
const COMMIT_LINK = /\s*\(\[([0-9a-f]{7,40})\]\(([^)]+)\)\)\s*$/;
const INLINE_LINK = /\[([^\]]+)\]\([^)]+\)/g;

export function parseChangelog(markdown: string): ChangelogRelease[] {
  const releases: ChangelogRelease[] = [];
  let release: ChangelogRelease | null = null;
  let section: ChangelogSection | null = null;

  for (const line of markdown.split(/\r?\n/)) {
    const heading = RELEASE_HEADING.exec(line);
    if (heading) {
      release = {
        version: heading[1] ?? heading[3],
        date: heading[4],
        compareUrl: heading[2],
        sections: [],
      };
      releases.push(release);
      section = null;
      continue;
    }

    if (!release) continue;

    const sectionMatch = SECTION_HEADING.exec(line);
    if (sectionMatch) {
      section = { title: sectionMatch[1].trim(), items: [] };
      release.sections.push(section);
      continue;
    }

    const bulletMatch = BULLET.exec(line.trim());
    if (bulletMatch && section) {
      section.items.push(parseBullet(bulletMatch[1]));
    }
  }

  return releases;
}

function parseBullet(raw: string): ChangelogItem {
  let text = raw.trim();
  let scope: string | undefined;
  let commitHash: string | undefined;
  let commitUrl: string | undefined;

  const scopeMatch = SCOPE_PREFIX.exec(text);
  if (scopeMatch) {
    scope = scopeMatch[1];
    text = text.slice(scopeMatch[0].length);
  }

  const commitMatch = COMMIT_LINK.exec(text);
  if (commitMatch) {
    commitHash = commitMatch[1].slice(0, 7);
    commitUrl = commitMatch[2];
    text = text.slice(0, commitMatch.index);
  }

  // Collapse any remaining markdown links (issue refs etc.) to their label
  text = text.replace(INLINE_LINK, '$1').trim();

  return { scope, text, commitHash, commitUrl };
}
