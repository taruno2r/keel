import type { Meta, StoryObj } from '@storybook/react-vite'
import { iconNames } from '../../icons/generated/icons'
import { Icon, ICON_MIN_SIZE } from './Icon'

const meta = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Use an icon to support a label or action with a familiar symbol, like a chevron on a dropdown or a check in a confirmation. ' +
          'Icons come from the Figma “Icons (core)” page; see **Foundations / Icons** for all of them.\n\n' +
          `Icons are always square and can be any size from ${ICON_MIN_SIZE}px up. ` +
          'They use `--keel-icon-default` unless you pass a `color`. ' +
          'When an icon is the only content of a control, give it a `label` for screen readers.',
      },
    },
  },
  args: {
    name: 'check',
    size: 24,
  },
  argTypes: {
    name: { control: 'select', options: iconNames },
    size: { control: { type: 'number', min: ICON_MIN_SIZE, step: 1 } },
    color: { control: 'text' },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** The same icon at 12 (the minimum), 16, 20, 24, 32 and 48px. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--keel-spacing-4x)' }}>
      {[12, 16, 20, 24, 32, 48].map((s) => (
        <Icon key={s} {...args} size={s} />
      ))}
    </div>
  ),
}

/** Override the default colour with any token or CSS colour. */
export const CustomColor: Story = {
  args: { name: 'triangle-alert', color: 'var(--keel-surface-danger)' },
}
