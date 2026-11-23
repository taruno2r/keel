// Lists variables added, removed or changed in src/tokens/figma/variables.json
// compared with a git ref (default HEAD). Used to summarize a Figma sync.
//
//   npm run tokens:diff [-- <git-ref>]

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const rel = 'src/tokens/figma/variables.json';
const ref = process.argv[2] ?? 'HEAD';

const flatten = (snap) => {
  const m = new Map();
  for (const c of snap.collections)
    for (const v of c.variables)
      m.set(`${c.name} / ${v.name}`, `${v.type} ` + c.modes.map((mode) => { const e = v.values[mode]; return `${mode}=${e.alias ? '→' + e.alias : e.value}`; }).join(', '));
  return m;
};

let before;
try {
  before = JSON.parse(execFileSync('git', ['show', `${ref}:${rel}`], { cwd: root, encoding: 'utf8' }));
} catch {
  console.log(`No ${rel} at ${ref}; everything is new.`);
  before = { collections: [] };
}
const after = JSON.parse(readFileSync(join(root, rel), 'utf8'));

const modes = (s) => new Map(s.collections.map((c) => [c.name, c.modes.join(', ')]));
const [mb, ma] = [modes(before), modes(after)];
const [b, a] = [flatten(before), flatten(after)];

const out = [];
for (const [c, m] of ma) if (!mb.has(c)) out.push(`+ collection ${c} (modes: ${m})`); else if (mb.get(c) !== m) out.push(`~ collection ${c} modes: ${mb.get(c)} → ${m}`);
for (const [c] of mb) if (!ma.has(c)) out.push(`- collection ${c}`);
for (const [k, v] of a) if (!b.has(k)) out.push(`+ ${k}: ${v}`); else if (b.get(k) !== v) out.push(`~ ${k}: ${b.get(k)}  →  ${v}`);
for (const [k, v] of b) if (!a.has(k)) out.push(`- ${k}: ${v}`);

console.log(out.length ? out.join('\n') : `No variable changes since ${ref}.`);
