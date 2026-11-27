import type { CSSProperties } from 'react'
import { tokens, type Token } from '../../tokens/generated/tokens'
import type { CoverageEntry } from './coverage'

const byVar = new Map(tokens.map((t) => [t.cssVar, t]))

export const tokensFor = ([collection, prefix]: CoverageEntry) =>
  tokens.filter((t) => t.collection === collection && t.figmaName.startsWith(prefix))

/** Follows aliases down to the raw value for a given mode. */
export function resolve(token: Token, mode: string): string {
  const entry = token.values[mode] ?? Object.values(token.values)[0]
  if ('value' in entry) return entry.value
  const target = byVar.get(entry.alias)
  return target ? resolve(target, mode) : entry.alias
}

export function aliasOf(token: Token, mode: string): string | undefined {
  const entry = token.values[mode] ?? Object.values(token.values)[0]
  return 'alias' in entry ? entry.figmaAlias : undefined
}

export const td: CSSProperties = {
  padding: 'var(--keel-spacing-2x) var(--keel-spacing-3x)',
  borderBottom: 'var(--keel-border-width-sm) solid var(--keel-color-surface-card)',
  verticalAlign: 'middle',
}

/**
 * Groups tokens by the first segment of their Figma name, without the "keel-" prefix and, for
 * semantic colours, the shared "color/" folder ("keel-color/surface/page" -> "surface";
 * a name without "/" like "focus-ring" -> "focus").
 */
export function groupByFirstSegment(items: Token[]): [string, Token[]][] {
  const groups = new Map<string, Token[]>()
  for (const t of items) {
    const name = t.figmaName.replace(/^keel-(color\/)?/, '')
    const key = name.includes('/') ? name.split('/')[0] : name.replace(/-[^-]+$/, '')
    groups.set(key, [...(groups.get(key) ?? []), t])
  }
  return [...groups]
}

export const titleCase = (s: string) => s.replace(/(^|[\s-])\w/g, (m) => m.toUpperCase())
