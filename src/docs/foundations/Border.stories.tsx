import type { Meta, StoryObj } from '@storybook/react-vite'
import { MeasureTable, Section } from './TokenDisplay'
import { coverage } from './coverage'
import { tokensFor } from './tokenUtils'

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
          items={tokensFor(coverage.border.radius)}
          visual={(v) => <div style={{ ...box, border: 'var(--ds-border-width-sm) solid var(--ds-border-default)', borderRadius: `var(${v})` }} />}
        />
      </Section>
      <Section title="Border Width" description="Figma collection “Spacing and Radius”.">
        <MeasureTable
          items={tokensFor(coverage.border.width)}
          visual={(v) => <div style={{ ...box, border: `var(${v}) solid var(--ds-border-default)`, borderRadius: 'var(--ds-border-radius-md)' }} />}
        />
      </Section>
    </>
  ),
}
