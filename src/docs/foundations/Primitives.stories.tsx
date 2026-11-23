import type { Meta, StoryObj } from '@storybook/react-vite'
import { Code, MeasureTable, Section, Subsection, TokenTable } from './TokenDisplay'
import { coverage } from './coverage'
import { resolve, td, tokensFor } from './tokenUtils'

const SAMPLE = 'The quick brown fox jumps over the lazy dog'

function Colors() {
  const colors = tokensFor(coverage.primitives.color)
  const families = [...new Set(colors.map((t) => t.figmaName.split('/')[1]))]
  return (
    <Section title="Color" description="Raw palette. Alias these from Theme tokens only; never use them in components directly.">
      {families.map((family) => (
        <Subsection key={family} title={family}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: 'var(--keel-spacing-2x)' }}>
            {colors
              .filter((t) => t.figmaName.split('/')[1] === family)
              .map((t) => (
                <div key={t.cssVar} title={t.cssVar}>
                  <div
                    style={{
                      height: 56,
                      borderRadius: 'var(--keel-border-radius-md)',
                      border: 'var(--keel-border-width-sm) solid var(--keel-border-subtle)',
                      background: `var(${t.cssVar})`,
                    }}
                  />
                  <div style={{ fontSize: 13, marginTop: 'var(--keel-spacing-1x)' }}>{t.figmaName.split('/')[2]}</div>
                  <Code>{resolve(t, 'value')}</Code>
                </div>
              ))}
          </div>
        </Subsection>
      ))}
    </Section>
  )
}

function Scale() {
  return (
    <Section title="Scale" description="Raw numeric scale (px). Spacing, Radius and Border Width alias these.">
      <MeasureTable
        items={tokensFor(coverage.primitives.scale)}
        visual={(v) => <div style={{ width: `var(${v})`, maxWidth: '100%', height: 16, background: 'var(--keel-element-accent)', borderRadius: 2 }} />}
      />
    </Section>
  )
}

function Fonts() {
  return (
    <Section title="Font">
      <Subsection title="Font Family">
        <TokenTable head={['Token', 'Value', 'Sample']}>
          {tokensFor(coverage.primitives.fontFamily).map((t) => (
            <tr key={t.cssVar}>
              <td style={td}><Code>{t.cssVar}</Code></td>
              <td style={td}><Code>{resolve(t, 'value')}</Code></td>
              <td style={{ ...td, fontFamily: `var(${t.cssVar})`, fontSize: 24 }}>{SAMPLE}</td>
            </tr>
          ))}
        </TokenTable>
      </Subsection>
      <Subsection title="Font Weight">
        <TokenTable head={['Token', 'Weight', 'Sample']}>
          {tokensFor(coverage.primitives.fontWeight).map((t) => (
            <tr key={t.cssVar}>
              <td style={td}><Code>{t.cssVar}</Code></td>
              <td style={td}><Code>{resolve(t, 'value')}</Code></td>
              <td style={{ ...td, fontFamily: 'var(--keel-font-family-body)', fontWeight: `var(${t.cssVar})`, fontSize: 20 }}>{SAMPLE}</td>
            </tr>
          ))}
        </TokenTable>
      </Subsection>
    </Section>
  )
}

const meta = {
  title: 'Foundations/Primitives',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** Figma collection “Primitives”. */
export const Primitives: Story = {
  render: () => (
    <>
      <Colors />
      <Scale />
      <Fonts />
    </>
  ),
}
