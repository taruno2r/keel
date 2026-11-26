import type { Meta, StoryObj } from '@storybook/react-vite'
import { iconNames } from '../../icons/generated/icons'
import { Icon } from './Icon'
import { ICON_MIN_SIZE } from './sizes'

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
          'Choose the symbol with iconName, from the Icons page. ' +
          'The size is small (16px) by default; use xsmall (12px), medium (20px) or large (24px), or custom for any size from 12px up. ' +
          'When an icon is the only content of a control, give the control an accessible name.\n\n' +
          'In code: `name` is the icon (see **Foundations / Icons** for all of them), and `size="custom"` takes a `customSize` in pixels ' +
          `(${ICON_MIN_SIZE} or more). Icons are always square and use \`--keel-icon-default\` unless you pass a \`color\`. ` +
          'For an icon that stands alone, pass a `label` so screen readers announce it.',
      },
    },
  },
  args: {
    name: 'check',
    size: 'small',
  },
  argTypes: {
    name: { control: 'select', options: iconNames },
    size: { control: 'inline-radio', options: ['xsmall', 'small', 'medium', 'large', 'custom'] },
    // Only shown when size is custom. Pixels, 12 or more.
    customSize: { control: { type: 'number', min: ICON_MIN_SIZE, step: 1 }, if: { arg: 'size', eq: 'custom' } },
    color: { control: 'text' },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Xsmall (12px), small (16px), medium (20px) and large (24px). */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--keel-spacing-4x)' }}>
      <Icon {...args} size="xsmall" />
      <Icon {...args} size="small" />
      <Icon {...args} size="medium" />
      <Icon {...args} size="large" />
    </div>
  ),
}

/** Any pixel size from 12px up. Change `customSize` in the controls; smaller values draw at 12px. */
export const CustomSize: Story = {
  args: { size: 'custom', customSize: 40 },
}

/** Override the default colour with any token or CSS colour. */
export const CustomColor: Story = {
  args: { name: 'triangle-alert', color: 'var(--keel-surface-danger)' },
}
