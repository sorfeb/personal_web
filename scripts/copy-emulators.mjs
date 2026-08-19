/**
 * Copies the js-dos runtime out of node_modules into public/emulators so the
 * DOS game player can self-host it (no CDN). Runs on postinstall, so the
 * output directory is gitignored, not committed.
 *
 * Only the default `dosbox` backend ships — the dosbox-x variants add ~16 MB
 * of wasm the site never loads. Source maps and symbol files are dev-only
 * noise and are skipped too. js-dos is GPL-2.0; its license text is copied
 * alongside the runtime.
 */
import { cpSync, mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'node_modules', 'js-dos', 'dist');
const dest = join(root, 'public', 'emulators');

if (!existsSync(src)) {
  console.error('copy-emulators: js-dos is not installed — run npm install first.');
  process.exit(1);
}

const SKIP = [
  /^wdosbox-x/, // dosbox-x backend, unused
  /\.map$/,
  /\.symbols$/,
  /^types$/, // TypeScript declarations, dev-only
];

mkdirSync(dest, { recursive: true });
cpSync(src, dest, {
  recursive: true,
  filter: (source) => {
    const name = source.split(/[\\/]/).pop() ?? '';
    return !SKIP.some((pattern) => pattern.test(name));
  },
});

const pkg = JSON.parse(readFileSync(join(root, 'node_modules', 'js-dos', 'package.json'), 'utf8'));
writeFileSync(
  join(dest, 'LICENSE.txt'),
  [
    `js-dos ${pkg.version} — ${pkg.license}`,
    'Source: https://github.com/caiiiycuk/js-dos',
    'These files are the unmodified js-dos runtime, self-hosted here under GPL-2.0.',
    '',
  ].join('\n'),
);

console.log(`copy-emulators: js-dos ${pkg.version} runtime copied to public/emulators`);
