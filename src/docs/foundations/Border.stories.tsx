import type { Meta, StoryObj } from '@storybook/react-vite'
import { MeasureTable, Section } from './TokenDisplay'
import { tokensIn } from './tokenUtils'

const C = 'Spacing and Radius'
const box = {
  width: 64,
  height: 40,
  background: 'var(--ds-surface-card)',
}

const meta = {
  title: 'Foundations/Border',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** Figma collection “Spacing and Radius”, Border Radius and Border Width groups. */
export const Border: Story = {
  render: () => (
    <>
      <Section title="Border Radius" description="Figma collection “Spacing and Radius”.">
        <MeasureTable
          items={tokensIn(C, 'Border Radius/')}
          visual={(v) => <div style={{ ...box, border: 'var(--ds-border-width-sm) solid var(--ds-border-default)', borderRadius: `var(${v})` }} />}
        />
      </Section>
      <Section title="Border Width" description="Figma collection “Spacing and Radius”.">
        <MeasureTable
          items={tokensIn(C, 'Border Width/')}
          visual={(v) => <div style={{ ...box, border: `var(${v}) solid var(--ds-border-default)`, borderRadius: 'var(--ds-border-radius-md)' }} />}
        />
      </Section>
    </>
  ),
}
