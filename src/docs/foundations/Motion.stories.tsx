import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { MeasureTable, Section } from './TokenDisplay'
import { coverage } from './coverage'
import { tokensFor } from './tokenUtils'

/** Click to move the dot across the track over the token's duration. */
function DurationSample({ cssVar }: { cssVar: string }) {
  const [end, setEnd] = useState(false)
  return (
    <button
      type="button"
      onClick={() => setEnd((e) => !e)}
      aria-label={`Play ${cssVar}`}
      style={{
        position: 'relative',
        width: 160,
        height: 24,
        padding: 0,
        border: 'none',
        borderRadius: 'var(--keel-border-radius-max)',
        background: 'var(--keel-surface-card)',
        cursor: 'pointer',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 4,
          left: 4,
          width: 16,
          height: 16,
          borderRadius: 'var(--keel-border-radius-max)',
          background: 'var(--keel-surface-accent)',
          transform: end ? 'translateX(136px)' : 'none',
          transition: `transform var(${cssVar})`,
        }}
      />
    </button>
  )
}

const meta = {
  title: 'Foundations/Motion',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** Figma collection “Motion”: how long transitions take. */
export const Motion: Story = {
  render: () => (
    <Section
      title="Duration"
      description="Figma collection “Motion”. Transition durations in milliseconds, from fastest to slowest. Code only: Figma prototypes can’t use variables for timing. Click a track to play it."
    >
      <MeasureTable items={tokensFor(coverage.motion.duration)} visual={(v) => <DurationSample cssVar={v} />} />
    </Section>
  ),
}
