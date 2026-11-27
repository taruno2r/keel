import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Use a badge to label an item with a short status or category, like “New”, “Beta” or “Draft”. ' +
          'Badges are for reading only: people can’t click them. Keep the label to one or two words.',
      },
    },
  },
  args: {
    label: 'Badge',
    variant: 'default',
  },
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'select', options: ['default', 'accent', 'success', 'warning', 'danger'] },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Accent: Story = {
  args: { variant: 'accent', label: 'New' },
}

export const Success: Story = {
  args: { variant: 'success', label: 'Active' },
}

export const Warning: Story = {
  args: { variant: 'warning', label: 'Pending' },
}

export const Danger: Story = {
  args: { variant: 'danger', label: 'Failed' },
}

/** Every Figma variant side by side. */
export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--keel-spacing-2x)' }}>
      <Badge {...args} variant="default" />
      <Badge {...args} variant="accent" />
      <Badge {...args} variant="success" />
      <Badge {...args} variant="warning" />
      <Badge {...args} variant="danger" />
    </div>
  ),
}
