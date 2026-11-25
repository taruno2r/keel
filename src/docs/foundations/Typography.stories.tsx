import type { Meta, StoryObj } from '@storybook/react-vite'
import { Code, MeasureTable, Section, TokenTable } from './TokenDisplay'
import { coverage } from './coverage'
import { td, tokensFor } from './tokenUtils'

const SAMPLE = 'The quick brown fox'

// Figma text styles in the Keel file and the variables each one binds, as of the
// 2026-11-25 sync. The variable snapshot doesn't include text styles, so update this
// list by hand when a style changes in Figma.
type TextStyle = { name: string; family: 'title' | 'body'; weight: 'regular' | 'bold'; size: number; lineHeight: number }
const textStyles: TextStyle[] = [
  { name: 'Title/H1', family: 'title', weight: 'bold', size: 60, lineHeight: 72 },
  { name: 'Title/H2', family: 'title', weight: 'bold', size: 48, lineHeight: 56 },
  { name: 'Title/H3', family: 'title', weight: 'bold', size: 40, lineHeight: 48 },
  { name: 'Title/H4', family: 'title', weight: 'bold', size: 32, lineHeight: 36 },
  { name: 'Title/H5', family: 'title', weight: 'bold', size: 24, lineHeight: 28 },
  { name: 'Title/H6', family: 'title', weight: 'bold', size: 20, lineHeight: 24 },
  { name: 'Body/Large Bold', family: 'body', weight: 'bold', size: 20, lineHeight: 24 },
  { name: 'Body/Large', family: 'body', weight: 'regular', size: 20, lineHeight: 24 },
  { name: 'Body/Medium Bold', family: 'body', weight: 'bold', size: 16, lineHeight: 20 },
  { name: 'Body/Medium', family: 'body', weight: 'regular', size: 16, lineHeight: 20 },
  { name: 'Body/Small Bold', family: 'body', weight: 'bold', size: 14, lineHeight: 18 },
  { name: 'Body/Small', family: 'body', weight: 'regular', size: 14, lineHeight: 18 },
  { name: 'Body/XSmall Bold', family: 'body', weight: 'bold', size: 12, lineHeight: 16 },
  { name: 'Body/XSmall', family: 'body', weight: 'regular', size: 12, lineHeight: 16 },
  { name: 'Link/Large', family: 'body', weight: 'regular', size: 20, lineHeight: 24 },
  { name: 'Link/Medium', family: 'body', weight: 'regular', size: 16, lineHeight: 20 },
  { name: 'Link/Small', family: 'body', weight: 'regular', size: 14, lineHeight: 18 },
  { name: 'Link/XSmall', family: 'body', weight: 'regular', size: 12, lineHeight: 16 },
]

const vars = (s: TextStyle) => ({
  fontFamily: `--keel-font-family-${s.family}`,
  fontWeight: `--keel-font-weight-inter-${s.weight}`,
  fontSize: `--keel-typography-font-size-${s.size}`,
  lineHeight: `--keel-typography-line-height-${s.lineHeight}`,
})

const meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** Figma collection “Typography”, and the Figma text styles built from it. */
export const Typography: Story = {
  render: () => (
    <>
      <Section
        title="Text styles"
        description="Figma text styles. Each one combines a font family and weight (Primitives) with a font size and line height (Typography)."
      >
        <TokenTable head={['Style', 'Tokens', 'Sample']}>
          {textStyles.map((s) => {
            const v = vars(s)
            return (
              <tr key={s.name}>
                <td style={{ ...td, whiteSpace: 'nowrap' }}>
                  <div>{s.name}</div>
                  <Code>{`${s.size}/${s.lineHeight}`}</Code>
                </td>
                <td style={td}>
                  {Object.values(v).map((cssVar) => (
                    <div key={cssVar}><Code>{cssVar}</Code></div>
                  ))}
                </td>
                <td
                  style={{
                    ...td,
                    fontFamily: `var(${v.fontFamily})`,
                    fontWeight: `var(${v.fontWeight})`,
                    fontSize: `var(${v.fontSize})`,
                    lineHeight: `var(${v.lineHeight})`,
                    textDecoration: s.name.startsWith('Link/') ? 'underline' : undefined,
                  }}
                >
                  {SAMPLE}
                </td>
              </tr>
            )
          })}
        </TokenTable>
      </Section>
      <Section title="Font size" description="Figma collection “Typography”.">
        <MeasureTable
          items={tokensFor(coverage.typography.fontSize)}
          visual={(v) => <span style={{ fontFamily: 'var(--keel-font-family-body)', fontSize: `var(${v})`, lineHeight: 1.2, whiteSpace: 'nowrap' }}>Aa</span>}
        />
      </Section>
      <Section title="Line height" description="Figma collection “Typography”.">
        <MeasureTable
          items={tokensFor(coverage.typography.lineHeight)}
          visual={(v) => <div style={{ width: 16, height: `var(${v})`, background: 'var(--keel-element-accent)', borderRadius: 2 }} />}
        />
      </Section>
    </>
  ),
}
