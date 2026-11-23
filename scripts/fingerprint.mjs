// Order-independent fingerprint of a variables snapshot. The same algorithm runs
// inside Figma (scripts/figma/export-variables.js), so equal fingerprints mean the
// snapshot in the repo exactly matches the variables in the Figma file.
export function fingerprint(snapshot) {
  const lines = [];
  for (const c of snapshot.collections)
    for (const v of c.variables)
      lines.push(
        `${c.name}|${v.name}|${v.type}|` +
          c.modes.map((m) => { const e = v.values[m]; return m + '=' + (e.alias ? '@' + e.alias : e.value); }).join(';'),
      );
  lines.sort();
  const s = lines.join('\n');
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return { count: lines.length, hash: h.toString(16) };
}

// CLI: node scripts/fingerprint.mjs [path/to/variables.json]
if (import.meta.url === `file://${process.argv[1]}`) {
  const { readFileSync } = await import('node:fs');
  const path = process.argv[2] ?? new URL('../src/tokens/figma/variables.json', import.meta.url);
  console.log(JSON.stringify(fingerprint(JSON.parse(readFileSync(path, 'utf8')))));
}
