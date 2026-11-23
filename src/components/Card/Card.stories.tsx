import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from '../Button'
import { Card } from './Card'
import exampleImage from './card-example.jpg'

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Use a card to show a short summary of one item, like a product, an article, or a place, with actions for it. Cards work well in a grid or list where people browse and pick items.',
      },
    },
  },
  args: {
    // Figma's Card is 320px wide; in code the card fills its container unless width is set.
    width: 320,
    title: 'Card Component',
    description: 'Card Component Description',
    image: { src: exampleImage, alt: 'Mountain peak lit by the setting sun' },
    actions: (
      <>
        <Button variant="secondary" width="fill" onClick={fn()}>Details</Button>
        <Button variant="primary" width="fill" onClick={fn()}>Add</Button>
      </>
    ),
  },
  argTypes: {
    // Pixels (320 or 320px) or a percentage (50%). Clear it to fill the container.
    width: { control: 'text' },
    image: { control: false },
    actions: { control: false },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
