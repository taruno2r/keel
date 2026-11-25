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
  },
  argTypes: {
    label: { control: 'text' },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
