import type { Meta, StoryObj } from '@storybook/react-vite'
import { MeasureTable, Section } from './TokenDisplay'
import { coverage } from './coverage'
import { tokensFor } from './tokenUtils'

const meta = {
  title: 'Foundations/Spacing',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** Figma collection “Spacing and Radius”, Spacing group. */
export const Spacing: Story = {
  render: () => (
    <Section title="Spacing" description="Figma collection “Spacing and Radius”. Use for padding, margin and gap.">
      <MeasureTable
        items={tokensFor(coverage.spacing.spacing)}
        visual={(v) => <div style={{ width: `var(${v})`, height: 16, background: 'var(--keel-element-accent)', borderRadius: 2 }} />}
      />
    </Section>
  ),
}
