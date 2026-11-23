import type { Meta, StoryObj } from '@storybook/react-vite'

// Semantic color tokens. Keep in sync with src/tokens/themes/*.css.
const groups: Record<string, string[]> = {
  Background: ['bg-default', 'bg-subtle', 'bg-muted'],
  Text: ['text-default', 'text-subtle', 'text-on-accent'],
  Border: ['border-default', 'border-strong'],
  Accent: ['accent-default', 'accent-hover', 'focus-ring'],
}

function Swatch({ name }: { name: string }) {
  const variable = `--ds-color-${name}`
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-3)' }}>
      <div
        style={{
          width: 48,
          height: 48,
          flexShrink: 0,
          borderRadius: 'var(--ds-radius-md)',
          border: '1px solid var(--ds-color-border-default)',
          background: `var(${variable})`,
        }}
      />
      <code style={{ fontFamily: 'var(--ds-font-family-mono)', fontSize: 'var(--ds-font-size-200)' }}>
        {variable}
      </code>
    </div>
  )
}

function ColorTokens() {
  return (
    <div style={{ display: 'grid', gap: 'var(--ds-space-8)' }}>
      {Object.entries(groups).map(([group, names]) => (
        <section key={group}>
          <h2 style={{ fontSize: 'var(--ds-font-size-400)', margin: '0 0 var(--ds-space-4)' }}>{group}</h2>
          <div style={{ display: 'grid', gap: 'var(--ds-space-3)' }}>
            {names.map((n) => (
              <Swatch key={n} name={n} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

const meta = {
  title: 'Foundations/Colors',
  component: ColorTokens,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ColorTokens>

export default meta
type Story = StoryObj<typeof meta>

export const Semantic: Story = {}
