// Fails (exit 1) when:
//   1. src/tokens/generated/ is out of date with src/tokens/figma/variables.json
//      (someone edited the snapshot or generated files without running `npm run tokens`), or
//   2. a token in the snapshot isn't shown on any Storybook page
//      (no entry in src/docs/foundations/coverage.ts matches it).
//
//   npm run tokens:check

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { coverage } from '../src/docs/foundations/coverage.ts';

const root = join(import.meta.dirname, '..');
const generated = join(root, 'src/tokens/generated');
let failed = false;

// 1. Generated files are up to date
const listFiles = (dir) =>
  readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? listFiles(join(dir, f)) : [join(dir, f)]));
const tmp = mkdtempSync(join(tmpdir(), 'tokens-check-'));
try {
  try {
    execFileSync(process.execPath, [join(root, 'scripts/build-tokens.mjs'), '--out', tmp], { stdio: 'pipe' });
  } catch (e) {
    console.error(`✗ Token generation failed:\n${String(e.stderr || e.message).trim()}`);
    process.exit(1);
  }
  const want = new Map(listFiles(tmp).map((f) => [relative(tmp, f), readFileSync(f, 'utf8')]));
  const have = new Map(listFiles(generated).map((f) => [relative(generated, f), readFileSync(f, 'utf8')]));
  const stale = [...new Set([...want.keys(), ...have.keys()])].filter((f) => want.get(f) !== have.get(f));
  if (stale.length) {
    failed = true;
    console.error(`✗ Generated tokens are out of date. Run \`npm run tokens\`. Differing files:\n${stale.map((f) => `    src/tokens/generated/${f}`).join('\n')}`);
  } else {
    console.log('✓ Generated tokens match the Figma snapshot');
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

// 2. Every token is shown in Storybook
const snapshot = JSON.parse(readFileSync(join(root, 'src/tokens/figma/variables.json'), 'utf8'));
const entries = Object.values(coverage).flatMap((page) => Object.values(page));
const uncovered = snapshot.collections.flatMap((c) =>
  c.variables
    .filter((v) => !entries.some(([col, prefix]) => col === c.name && v.name.startsWith(prefix)))
    .map((v) => `${c.name} / ${v.name}`),
);
if (uncovered.length) {
  failed = true;
  console.error(
    `✗ ${uncovered.length} token(s) are not shown on any Storybook page. ` +
      `Add an entry to src/docs/foundations/coverage.ts and render it on a Foundations page:\n` +
      uncovered.map((u) => `    ${u}`).join('\n'),
  );
} else {
  const total = snapshot.collections.reduce((n, c) => n + c.variables.length, 0);
  console.log(`✓ All ${total} tokens are shown in Storybook`);
}

process.exit(failed ? 1 : 0);
