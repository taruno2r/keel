// Fails (exit 1) when src/icons/generated/ is out of date with src/icons/figma/icons.json
// (someone edited the snapshot or generated file without running `npm run icons`).
// Every icon is shown in Storybook automatically (Foundations/Icons renders iconNames).
//
//   npm run icons:check

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fingerprint } from './icons-fingerprint.mjs';

const root = join(import.meta.dirname, '..');
const tmp = mkdtempSync(join(tmpdir(), 'icons-check-'));
try {
  execFileSync(process.execPath, [join(root, 'scripts/build-icons.mjs'), '--out', tmp], { stdio: 'pipe' });
  const want = readFileSync(join(tmp, 'icons.ts'), 'utf8');
  const have = readFileSync(join(root, 'src/icons/generated/icons.ts'), 'utf8');
  if (want !== have) {
    console.error('✗ src/icons/generated/icons.ts is out of date. Run `npm run icons`.');
    process.exit(1);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
const fp = fingerprint(JSON.parse(readFileSync(join(root, 'src/icons/figma/icons.json'), 'utf8')));
console.log(`✓ Generated icons match the Figma snapshot (${fp.count} icons, fingerprint ${fp.hash})`);
