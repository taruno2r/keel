import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from './Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Use a button to trigger an action, like submitting a form, saving changes, or confirming a choice. ' +
          'Use **Primary** for the main action in a page or dialog, and **Secondary** for supporting actions next to it. ' +
          'To take people to another page, use a link instead.\n\n' +
          'Hover and keyboard focus are real browser states: hover the button, or press Tab to see the focus ring.',
      },
    },
  },
  args: {
    children: 'Label',
    variant: 'primary',
    width: 'auto',
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary'] },
    width: { control: 'inline-radio', options: ['auto', 'fill'] },
    // Only shown when width is fill. Pixels (240 or 240px) or a percentage (50%).
    fillWidth: { control: 'text', if: { arg: 'width', eq: 'fill' } },
    children: { control: 'text', name: 'label' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Secondary: Story = {
  args: { variant: 'secondary' },
}
