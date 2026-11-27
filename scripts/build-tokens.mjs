// Generates CSS custom properties (and a typed manifest for Storybook) from the
// Figma variables snapshot at src/tokens/figma/variables.json.
//
//   npm run tokens
//
// Rules:
// - Single-mode collections become `:root { ... }` in their own file.
// - The THEME_COLLECTION's modes are themes: one file per mode, scoped to
//   [data-theme='<mode>']. The first mode is also applied to :root as the default.
// - Any OTHER multi-mode collection is an error: its modes need a deliberate
//   mapping (e.g. Desktop/Mobile -> media queries), so add one here first.
// - Aliases become var(--keel-...) references, so the primitive -> semantic chain is kept.
// - FLOATs are px, except those matched by NON_PX below (unitless numbers, durations). Font weight names become numeric CSS weights.

import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const root = join(import.meta.dirname, '..');
const snapshotPath = join(root, 'src/tokens/figma/variables.json');
// `--out <dir>` writes elsewhere (used by scripts/check-tokens.mjs to compare).
const outArg = process.argv.indexOf('--out');
const outDir = outArg > -1 ? process.argv[outArg + 1] : join(root, 'src/tokens/generated');
const PREFIX = 'keel';
const THEME_COLLECTION = 'Accent';

const snapshot = JSON.parse(readFileSync(snapshotPath, 'utf8'));

const unmapped = snapshot.collections.filter((c) => c.modes.length > 1 && c.name !== THEME_COLLECTION);
if (unmapped.length) {
  console.error(
    unmapped
      .map((c) => `✗ Collection "${c.name}" has modes ${c.modes.join(', ')}, but only "${THEME_COLLECTION}" modes map to themes.`)
      .join('\n') + `\n  Decide how these modes should work in CSS and add that mapping to scripts/build-tokens.mjs.`,
  );
  process.exit(1);
}

const slug = (s) =>
  s
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

// Figma names carry the prefix on their top folder ("keel-color/slate/50");
// drop it so the CSS name gets it once: --keel-color-slate-50.
const unprefixed = (figmaName) => figmaName.replace(new RegExp(`^${PREFIX}-`, 'i'), '');

// "keel-font/font-family/body" -> "font/family/body" (drop the repeated "font" word)
export const cssVarName = (figmaName) =>
  `--${PREFIX}-` +
  unprefixed(figmaName)
    .replace(/^font\/font[ -]/i, 'font/')
    .split('/')
    .map(slug)
    .join('-');

const FONT_WEIGHTS = {
  thin: 100,
  extralight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};
const fontWeight = (s) => FONT_WEIGHTS[s.replace(/\s+/g, '').toLowerCase()];

const isFontFamily = (name) => /^font\/font[ -]family\//i.test(unprefixed(name));
const isFontWeight = (name) => /^font\/font[ -]weight\//i.test(unprefixed(name));

// FLOATs that aren't lengths. Figma stores numbers as 32-bit floats (0.93 -> 0.9300000071525574),
// so values are rounded to 6 significant digits.
// - interactive/disabled is a Figma layer opacity in percent (25 = 25%) -> CSS opacity 0..1.
// - interactive/active/scale-* are transform scale factors.
// - motion/duration-* are milliseconds.
// - interactive/focus/* are lengths (px). They're aliases today, which skip this table, but a raw
//   value still needs a rule because of the group guard.
// Any other token in a NON_PX_GROUPS folder is an error, so a new one gets a deliberate unit here.
const tidy = (n) => Number(n.toPrecision(6));
const NON_PX = [
  [/^interactive\/disabled$/, (v) => String(tidy(v / 100))],
  [/^interactive\/active\/scale-/, (v) => String(tidy(v))],
  [/^motion\/duration-/, (v) => `${tidy(v)}ms`],
  [/^interactive\/focus\//, (v) => (v === 0 ? '0' : `${tidy(v)}px`)],
];
const NON_PX_GROUPS = /^(interactive|motion)\//;

function cssValue(variable, entry) {
  if (entry.alias) return `var(${cssVarName(entry.alias)})`;
  const v = entry.value;
  if (variable.type === 'FLOAT') {
    const rule = NON_PX.find(([re]) => re.test(unprefixed(variable.name)));
    if (rule) return rule[1](v);
    if (NON_PX_GROUPS.test(unprefixed(variable.name)))
      throw new Error(`No unit rule for ${variable.name}: add one to NON_PX in scripts/build-tokens.mjs`);
    return v === 0 ? '0' : `${v}px`;
  }
  if (variable.type === 'COLOR') return v;
  if (isFontFamily(variable.name)) return `'${v}', system-ui, sans-serif`;
  if (isFontWeight(variable.name)) {
    const w = fontWeight(v);
    if (!w) throw new Error(`Unknown font weight "${v}" in ${variable.name}`);
    return String(w);
  }
  return JSON.stringify(v);
}

// Natural sort by path segments; font weights sort by numeric weight.
const sortKey = (v) =>
  v.name
    .split('/')
    .map((seg) => {
      if (isFontWeight(v.name) && fontWeight(seg)) return String(fontWeight(seg)).padStart(6, '0');
      return /^\d+$/.test(seg) ? seg.padStart(6, '0') : seg.toLowerCase();
    })
    .join('/');
const sorted = (vars) => [...vars].sort((a, b) => sortKey(a).localeCompare(sortKey(b)));

const header = (collection, mode) =>
  `/*\n * GENERATED by scripts/build-tokens.mjs. Do not edit by hand.\n` +
  ` * Source: Figma file ${snapshot.source.fileKey}, collection "${collection}"` +
  (mode ? `, mode "${mode}"` : '') +
  `\n * Exported: ${snapshot.source.exportedAt}\n */\n`;

const block = (selector, collection, mode) =>
  `${selector} {\n` +
  sorted(collection.variables)
    .map((v) => `  ${cssVarName(v.name)}: ${cssValue(v, v.values[mode])};`)
    .join('\n') +
  `\n}\n`;

rmSync(outDir, { recursive: true, force: true });
const write = (rel, content) => {
  const p = join(outDir, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
  return rel;
};

const files = [];
const themes = [];
const manifest = [];

for (const collection of snapshot.collections) {
  const multiMode = collection.modes.length > 1;
  if (!multiMode) {
    const mode = collection.modes[0];
    files.push(write(`${slug(collection.name)}.css`, header(collection.name) + block(':root', collection, mode)));
  } else {
    collection.modes.forEach((mode, i) => {
      const theme = slug(mode);
      themes.push(theme);
      const selector = i === 0 ? `:root,\n[data-theme='${theme}']` : `[data-theme='${theme}']`;
      files.push(write(`themes/${theme}.css`, header(collection.name, mode) + block(selector, collection, mode)));
    });
  }
  for (const v of sorted(collection.variables)) {
    const values = {};
    for (const mode of collection.modes) {
      const e = v.values[mode];
      values[multiMode ? slug(mode) : 'value'] = e.alias ? { alias: cssVarName(e.alias), figmaAlias: e.alias } : { value: cssValue(v, e) };
    }
    manifest.push({ collection: collection.name, figmaName: v.name, cssVar: cssVarName(v.name), type: v.type, values });
  }
}

write(
  'index.css',
  `/* GENERATED by scripts/build-tokens.mjs. Do not edit by hand. */\n` +
    files.map((f) => `@import './${f}';`).join('\n') +
    '\n',
);

write(
  'tokens.ts',
  `// GENERATED by scripts/build-tokens.mjs. Do not edit by hand.\n\n` +
    `export type TokenValue = { value: string } | { alias: string; figmaAlias: string }\n\n` +
    `export interface Token {\n  collection: string\n  figmaName: string\n  cssVar: string\n  type: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN'\n  values: Record<string, TokenValue>\n}\n\n` +
    `export const themes = ${JSON.stringify(themes)} as const\nexport type Theme = (typeof themes)[number]\n\n` +
    `export const tokens: Token[] = ${JSON.stringify(manifest, null, 2)}\n`,
);

console.log(`Generated ${manifest.length} tokens, themes: ${themes.join(', ')}`);
console.log(files.map((f) => `  src/tokens/generated/${f}`).join('\n'));
