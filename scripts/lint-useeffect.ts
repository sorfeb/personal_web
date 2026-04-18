/**
 * Enforces the no-useEffect policy defined in
 * .claude/skills/no-useeffect/SKILL.md.
 *
 * Scans src/components/**, src/app/**, and src/context/** for any
 * `useEffect(` call that is NOT preceded by a `// effect:audited`
 * comment on the immediately prior non-blank line. Files in
 * src/hooks/** are exempt.
 *
 * Usage: npm run lint:useeffect
 * Exits 1 if any unapproved useEffect is found.
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const SCAN_DIRS = ['src/components', 'src/app', 'src/context'];
const FILE_EXTS = ['.ts', '.tsx'];
const USE_EFFECT = /\buseEffect\s*\(/;
const AUDITED_TAG = /\/\/\s*effect:audited\b/;

type Offender = { file: string; line: number; snippet: string };

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (FILE_EXTS.some((ext) => entry.name.endsWith(ext))) {
      out.push(full);
    }
  }
  return out;
}

function findOffenders(file: string, source: string): Offender[] {
  const lines = source.split(/\r?\n/);
  const offenders: Offender[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!USE_EFFECT.test(line)) continue;

    let tagged = false;
    for (let j = i - 1; j >= 0 && j >= i - 5; j -= 1) {
      const prev = lines[j].trim();
      if (prev === '') continue;
      if (AUDITED_TAG.test(prev)) tagged = true;
      break;
    }

    if (!tagged) {
      offenders.push({ file, line: i + 1, snippet: line.trim() });
    }
  }

  return offenders;
}

async function main(): Promise<void> {
  const files: string[] = [];
  for (const dir of SCAN_DIRS) {
    files.push(...(await walk(join(ROOT, dir))));
  }

  const offenders: Offender[] = [];
  for (const file of files) {
    const source = await readFile(file, 'utf8');
    offenders.push(...findOffenders(file, source));
  }

  if (offenders.length === 0) {
    console.log('lint:useeffect — OK (0 unapproved useEffect calls)');
    return;
  }

  console.error(`lint:useeffect — ${offenders.length} unapproved useEffect call(s) found:\n`);
  for (const o of offenders) {
    const rel = relative(ROOT, o.file).split(sep).join('/');
    console.error(`  ${rel}:${o.line}  ${o.snippet}`);
  }
  console.error(
    '\nFix by: refactoring with an approved hook (useMountEffect, useIsMounted, useInterval, useTimeout, useEventListener),',
  );
  console.error(
    'moving the effect into a custom hook in src/hooks/, or tagging with `// effect:audited — <reason>`.',
  );
  console.error('See .claude/skills/no-useeffect/SKILL.md for details.');
  process.exit(1);
}

main().catch((err) => {
  console.error('lint:useeffect failed:', err);
  process.exit(2);
});
