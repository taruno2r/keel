// Runs INSIDE Figma via the Figma MCP `use_figma` tool (Plugin API), read-only.
// Lists every icon component on the "Icons (core)" page (names start with "Icon/")
// and returns { fingerprint, nodes }:
//   - nodes: icon name -> node id. Download each node as SVG with the Figma MCP
//     `download_assets` tool (defaultFormat "svg") into one folder as <name>.svg,
//     then run `npm run icons:import -- <folder>`.
//   - fingerprint: must equal `node scripts/icons-fingerprint.mjs` after the import
//     (same algorithm), proving the repo snapshot matches Figma exactly.
// Used by the /sync-icons skill (.claude/skills/sync-icons/SKILL.md).

const PAGE = 'Icons (core)';
const PREFIX = 'Icon/';

const page = figma.root.children.find((p) => p.name === PAGE);
if (!page) throw new Error(`No page named "${PAGE}"`);
await figma.setCurrentPageAsync(page);
const comps = page.findAllWithCriteria({ types: ['COMPONENT'] }).filter((c) => c.name.startsWith(PREFIX));

const lines = [];
const nodes = {};
for (const c of comps) {
  const name = c.name.slice(PREFIX.length);
  const svg = await c.exportAsync({ format: 'SVG_STRING', svgIdAttribute: false });
  const viewBox = svg.match(/viewBox="([^"]+)"/)[1];
  const paths = [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]);
  nodes[name] = c.id;
  lines.push(`${name}|${viewBox}|${paths.join('|')}`);
}

// Fingerprint: keep identical to scripts/icons-fingerprint.mjs
lines.sort();
const s = lines.join('\n');
let h = 2166136261;
for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }

return { fingerprint: { count: lines.length, hash: h.toString(16) }, nodes };
