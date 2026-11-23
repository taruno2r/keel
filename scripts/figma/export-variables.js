// Runs INSIDE Figma via the Figma MCP `use_figma` tool (Plugin API), read-only.
// Returns { snapshot, fingerprint }: `snapshot` is written verbatim to
// src/tokens/figma/variables.json; `fingerprint` must equal
// `node scripts/fingerprint.mjs` afterwards (same algorithm as scripts/fingerprint.mjs).
// Used by the /sync-tokens skill (.claude/skills/sync-tokens/SKILL.md).

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const nameById = {};
for (const v of await figma.variables.getLocalVariablesAsync()) nameById[v.id] = v.name;
const hex = (c) => {
  const h = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
  return '#' + h(c.r) + h(c.g) + h(c.b) + (c.a !== undefined && c.a < 1 ? h(c.a) : '');
};
const problems = [];
const conv = async (val, where) => {
  if (val && val.type === 'VARIABLE_ALIAS') {
    if (nameById[val.id]) return { alias: nameById[val.id] };
    const ext = await figma.variables.getVariableByIdAsync(val.id);
    problems.push(`${where} aliases a variable that is not in the file's collections: ${ext ? ext.name : val.id}`);
    const raw = ext ? Object.values(ext.valuesByMode)[0] : null;
    return { value: raw && typeof raw === 'object' && 'r' in raw ? hex(raw) : raw };
  }
  return { value: val && typeof val === 'object' && 'r' in val ? hex(val) : val };
};

const snapshot = { source: { fileKey: figma.fileKey, exportedAt: new Date().toISOString() }, collections: [] };
for (const c of collections) {
  const modes = c.modes.map((m) => m.name);
  const variables = [];
  for (const id of c.variableIds) {
    const v = await figma.variables.getVariableByIdAsync(id);
    const values = {};
    for (const m of c.modes) values[m.name] = await conv(v.valuesByMode[m.modeId], `${c.name}/${v.name} (${m.name})`);
    const entry = { name: v.name, type: v.resolvedType, values };
    if (v.description) entry.description = v.description;
    variables.push(entry);
  }
  snapshot.collections.push({ name: c.name, modes, variables });
}

// Fingerprint: keep identical to scripts/fingerprint.mjs
const lines = [];
for (const c of snapshot.collections)
  for (const v of c.variables)
    lines.push(`${c.name}|${v.name}|${v.type}|` + c.modes.map((m) => { const e = v.values[m]; return m + '=' + (e.alias ? '@' + e.alias : e.value); }).join(';'));
lines.sort();
const s = lines.join('\n');
let h = 2166136261;
for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }

return { fingerprint: { count: lines.length, hash: h.toString(16) }, problems, snapshot };
