// Order-independent fingerprint of the icon snapshot. The same algorithm runs inside
// Figma (scripts/figma/export-icons.js), so equal fingerprints mean every icon's
// name, viewBox and path data in the repo exactly match the Figma "Icons (core)" page.
export function fingerprint(snapshot) {
  const lines = snapshot.icons.map((i) => `${i.name}|${i.viewBox}|${i.paths.map((p) => p.d).join('|')}`).sort();
  const s = lines.join('\n');
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return { count: lines.length, hash: h.toString(16) };
}

// CLI: node scripts/icons-fingerprint.mjs [path/to/icons.json]
if (import.meta.url === `file://${process.argv[1]}`) {
  const { readFileSync } = await import('node:fs');
  const path = process.argv[2] ?? new URL('../src/icons/figma/icons.json', import.meta.url);
  console.log(JSON.stringify(fingerprint(JSON.parse(readFileSync(path, 'utf8')))));
}
