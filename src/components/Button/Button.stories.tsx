import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { iconNames } from '../../icons/generated/icons'
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
          'Use **Ghost** for low-emphasis actions, and **Danger** for destructive actions like deleting. ' +
          'To take people to another page, use a link instead.\n\n' +
          'Hover and keyboard focus are real browser states: hover the button, or press Tab to see the focus ring.',
      },
    },
  },
  args: {
    children: 'Label',
    variant: 'primary',
    size: 'small',
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
    children: { control: 'text', name: 'label' },
    iconLeft: { control: 'select', options: [undefined, ...iconNames], labels: { undefined: '(none)' } },
    iconRight: { control: 'select', options: [undefined, ...iconNames], labels: { undefined: '(none)' } },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Secondary: Story = {
  args: { variant: 'secondary' },
}

export const Ghost: Story = {
  args: { variant: 'ghost' },
}

export const Danger: Story = {
  args: { variant: 'danger', children: 'Delete' },
}

/** Figma iconLeft and iconRight, with Figma's default icons. Pick other icons in the controls. */
export const WithIcons: Story = {
  args: { iconLeft: 'search', iconRight: 'chevron-down' },
}