// Turns SVGs downloaded from Figma (one <name>.svg per icon, via the Figma MCP
// `download_assets` tool) into the repo snapshot src/icons/figma/icons.json.
// Keeps only the geometry (viewBox + path data); colour comes from CSS (currentColor).
//
//   npm run icons:import -- <folder-with-svgs>
//
// Fails if a file's Figma layer id doesn't match its file name, or if an icon uses
// something other than plain filled paths in a single colour.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];
if (!dir) {
  console.error('Usage: npm run icons:import -- <folder-with-svgs>');
  process.exit(1);
}
const root = join(import.meta.dirname, '..');
const errors = [];
const icons = [];
for (const file of readdirSync(dir).filter((f) => f.endsWith('.svg')).sort()) {
  const name = file.slice(0, -4);
  const svg = readFileSync(join(dir, file), 'utf8');
  if (!svg.includes(`id="Icon/${name}"`)) errors.push(`${file}: Figma layer is not "Icon/${name}"`);
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1];
  const pathTags = [...svg.matchAll(/<path\b[^>]*>/g)].map((m) => m[0]);
  const paths = pathTags.map((tag) => {
    const d = tag.match(/\sd="([^"]+)"/)?.[1];
    const fillRule = tag.match(/fill-rule="([^"]+)"/)?.[1];
    return fillRule ? { d, fillRule } : { d };
  });
  const fills = new Set(pathTags.map((tag) => tag.match(/fill="([^"]+)"/)?.[1]));
  const other = svg.match(/<(circle|ellipse|line|polyline|polygon|image|mask|clipPath|linearGradient|radialGradient)\b/);
  if (!viewBox || !paths.length || paths.some((p) => !p.d)) errors.push(`${file}: no viewBox or path data`);
  if (fills.size !== 1) errors.push(`${file}: expected one fill colour, found ${[...fills].join(', ')}`);
  if (other) errors.push(`${file}: unsupported <${other[1]}>; flatten it to a path in Figma`);
  icons.push({ name, viewBox, paths });
}
if (errors.length) {
  console.error(`✗ Import failed:\n${errors.map((e) => `    ${e}`).join('\n')}`);
  process.exit(1);
}
const snapshot = { source: { fileKey: '8IEdts3bNiwKEwISZ9Md9D', page: 'Icons', importedAt: new Date().toISOString() }, icons };
writeFileSync(join(root, 'src/icons/figma/icons.json'), JSON.stringify(snapshot, null, 2) + '\n');
console.log(`Imported ${icons.length} icons into src/icons/figma/icons.json`);
