import type { CSSProperties, ReactNode } from 'react'
import type { Token } from '../../tokens/generated/tokens'
import { aliasOf, resolve, td } from './tokenUtils'

const mono: CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 13,
}

export const Code = ({ children }: { children: ReactNode }) => <code style={mono}>{children}</code>

export function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 'var(--ds-spacing-12x)' }}>
      <h2 style={{ margin: '0 0 var(--ds-spacing-1x)', fontSize: 20, fontWeight: 'var(--ds-font-weight-inter-semi-bold)' }}>{title}</h2>
      {description && <p style={{ margin: '0 0 var(--ds-spacing-4x)', color: 'var(--ds-text-secondary)' }}>{description}</p>}
      {children}
    </section>
  )
}

export function TokenTable({ head, children }: { head: string[]; children: ReactNode }) {
  const cell: CSSProperties = {
    textAlign: 'left',
    padding: 'var(--ds-spacing-2x) var(--ds-spacing-3x)',
    borderBottom: 'var(--ds-border-width-sm) solid var(--ds-border-subtle)',
    fontWeight: 'var(--ds-font-weight-inter-semi-bold)',
    fontSize: 13,
    color: 'var(--ds-text-secondary)',
  }
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>{head.map((h) => <th key={h} style={cell}>{h}</th>)}</tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  )
}

export function Subsection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 'var(--ds-spacing-6x)' }}>
      <h3 style={{ margin: '0 0 var(--ds-spacing-2x)', fontSize: 16, fontWeight: 'var(--ds-font-weight-inter-semi-bold)' }}>{title}</h3>
      {children}
    </div>
  )
}

export const Swatch = ({ cssVar, size = 40 }: { cssVar: string; size?: number }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 'var(--ds-border-radius-md)',
      border: 'var(--ds-border-width-sm) solid var(--ds-border-subtle)',
      background: `var(${cssVar})`,
    }}
  />
)

/** Table for numeric (FLOAT) tokens: name, Figma path, alias, resolved value and a visual. */
export function MeasureTable({ items, visual }: { items: Token[]; visual: (cssVar: string) => ReactNode }) {
  return (
    <TokenTable head={['Token', 'Figma', 'Alias', 'Value', 'Preview']}>
      {[...items].sort((a, b) => parseFloat(resolve(a, 'value')) - parseFloat(resolve(b, 'value'))).map((t) => (
        <tr key={t.cssVar}>
          <td style={td}><Code>{t.cssVar}</Code></td>
          <td style={{ ...td, color: 'var(--ds-text-secondary)' }}>{t.figmaName}</td>
          <td style={td}>{aliasOf(t, 'value') ?? '—'}</td>
          <td style={td}><Code>{resolve(t, 'value')}</Code></td>
          <td style={{ ...td, width: '35%' }}>{visual(t.cssVar)}</td>
        </tr>
      ))}
    </TokenTable>
  )
}
