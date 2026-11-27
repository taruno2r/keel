import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { MeasureTable, Section } from './TokenDisplay'
import { coverage } from './coverage'
import { tokensFor } from './tokenUtils'

const sample = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 96,
  height: 40,
  borderRadius: 'var(--keel-border-radius-lg)',
  background: 'var(--keel-color-surface-accent)',
  color: 'var(--keel-color-text-on-accent)',
  fontSize: 'var(--keel-typography-font-size-14)',
  userSelect: 'none',
} as const

/** Press and hold to see the scale; it applies only while pressed, like `:active`. */
function PressSample({ cssVar }: { cssVar: string }) {
  const [pressed, setPressed] = useState(false)
  const release = () => setPressed(false)
  return (
    <div
      role="presentation"
      onPointerDown={() => setPressed(true)}
      onPointerUp={release}
      onPointerLeave={release}
      style={{ ...sample, cursor: 'pointer', transform: pressed ? `scale(var(${cssVar}))` : undefined }}
    >
      Press me
    </div>
  )
}

const ringBox = {
  width: 64,
  height: 32,
  background: 'var(--keel-color-surface-card)',
  borderRadius: 'var(--keel-border-radius-lg)',
  outline: 'var(--keel-interactive-focus-ring-width) solid var(--keel-color-border-focus)',
  outlineOffset: 'var(--keel-interactive-focus-ring-offset)',
} as const

/** A box with the matching border-radius step and the focus ring drawn by the browser around it. */
const RingSample = ({ cssVar }: { cssVar: string }) => {
  const step = cssVar.replace('--keel-interactive-focus-ring-radius-', '')
  return <div style={{ ...ringBox, borderRadius: `var(--keel-border-radius-${step})` }} />
}

const meta = {
  title: 'Foundations/Interactive',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** Figma collection “Interactive”: how controls look when disabled and when pressed. */
export const Interactive: Story = {
  render: () => (
    <>
      <Section
        title="Disabled"
        description="Figma collection “Interactive”. Layer opacity for disabled controls. Figma stores it as a percentage (25 = 25%); the CSS value is 0 to 1."
      >
        <MeasureTable
          items={tokensFor(coverage.interactive.disabled)}
          visual={(v) => <div style={{ ...sample, opacity: `var(${v})` }}>Label</div>}
        />
      </Section>
      <Section
        title="Active scale"
        description="Figma collection “Interactive”. How far a control shrinks while pressed (CSS transform: scale). Code only: Figma can’t apply a scale variable, so active variants in Figma show the colours only. Press and hold a sample to try it."
      >
        <MeasureTable items={tokensFor(coverage.interactive.activeScale)} visual={(v) => <PressSample cssVar={v} />} />
      </Section>
      <Section
        title="Focus"
        description="Figma collection “Interactive”. The keyboard focus ring: its gap from the control (offset) and stroke width. In code these drive outline-offset and the outline width."
      >
        <MeasureTable
          items={[...tokensFor(coverage.interactive.focusOffset), ...tokensFor(coverage.interactive.focusWidth)]}
          visual={() => <div style={ringBox} />}
        />
      </Section>
      <Section
        title="Focus ring radius"
        description="Figma collection “Interactive”. The ring’s corner radius for each border-radius step: radius + focus offset (sharp corners stay sharp). For drawing rings in Figma only: in code the browser derives the ring’s corners from the control’s radius, so these aren’t used. Each preview is a box with that border-radius step and a real focus outline."
      >
        <MeasureTable items={tokensFor(coverage.interactive.focusRadius)} visual={(v) => <RingSample cssVar={v} />} />
      </Section>
    </>
  ),
}
