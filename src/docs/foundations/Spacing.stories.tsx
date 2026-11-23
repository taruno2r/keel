import type { Meta, StoryObj } from '@storybook/react-vite'
import { MeasureTable, Section } from './TokenDisplay'
import { tokensIn } from './tokenUtils'

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
        items={tokensIn('Spacing and Radius', 'Spacing/')}
        visual={(v) => <div style={{ width: `var(${v})`, height: 16, background: 'var(--ds-element-accent)', borderRadius: 2 }} />}
      />
    </Section>
  ),
}
