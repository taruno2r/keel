import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { Chip } from './Chip'

const meta = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Use chips to let people filter content or pick options, like categories or tags. ' +
          'People can select one or more chips in a group; selected chips are filled. ' +
          'Keep labels short, and use a button for actions instead.\n\n' +
          'Hover and keyboard focus are real browser states: hover a chip, or press Tab to see the focus ring.',
      },
    },
  },
  args: {
    label: 'Chip',
    selected: false,
    onClick: fn(),
  },
  argTypes: {
    label: { control: 'text' },
    selected: { control: 'boolean' },
  },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Selected: Story = {
  args: { selected: true },
}

const FILTERS = ['All', 'Design', 'Engineering', 'Research']

/** A filter row: click a chip to select or clear it. */
export const Group: Story = {
  render: function Render() {
    const [picked, setPicked] = useState<string[]>(['Design'])
    const toggle = (f: string) => setPicked((p) => (p.includes(f) ? p.filter((x) => x !== f) : [...p, f]))
    return (
      <div role="group" aria-label="Filter by team" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--keel-spacing-2x)' }}>
        {FILTERS.map((f) => (
          <Chip key={f} label={f} selected={picked.includes(f)} onClick={() => toggle(f)} />
        ))}
      </div>
    )
  },
}
