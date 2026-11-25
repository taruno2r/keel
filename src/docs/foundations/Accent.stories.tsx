import type { Meta, StoryObj } from '@storybook/react-vite'
import { themes } from '../../tokens/generated/tokens'
import { Code, Section, Swatch, TokenTable } from './TokenDisplay'
import { coverage } from './coverage'
import { aliasOf, groupByFirstSegment, resolve, td, titleCase, tokensFor } from './tokenUtils'

const themeLabel = (t: string) => t[0].toUpperCase() + t.slice(1)

const meta = {
  title: 'Foundations/Accent',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** Figma collection “Accent”. One theme per mode; swatches follow the toolbar theme. */
export const Accent: Story = {
  render: () => (
    <>
      <p style={{ margin: '0 0 var(--keel-spacing-8x)', color: 'var(--keel-text-secondary)' }}>
        Figma collection “Accent”, modes {themes.map(themeLabel).join(' and ')}. Swatches follow the theme selected in the
        toolbar. Components use these tokens for color.
      </p>
      {groupByFirstSegment(tokensFor(coverage.theme.all)).map(([group, items]) => (
        <Section key={group} title={titleCase(group)}>
          <TokenTable head={['Swatch', 'Token', 'Figma', ...themes.map(themeLabel)]}>
            {items.map((t) => (
              <tr key={t.cssVar}>
                <td style={{ ...td, width: 56 }}><Swatch cssVar={t.cssVar} /></td>
                <td style={td}><Code>{t.cssVar}</Code></td>
                <td style={{ ...td, color: 'var(--keel-text-secondary)' }}>{t.figmaName}</td>
                {themes.map((m) => (
                  <td key={m} style={td}>
                    <div>{aliasOf(t, m)}</div>
                    <Code>{resolve(t, m)}</Code>
                  </td>
                ))}
              </tr>
            ))}
          </TokenTable>
        </Section>
      ))}
    </>
  ),
}
