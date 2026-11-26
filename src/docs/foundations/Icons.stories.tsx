import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Icon } from '../../components/Icon'
import { iconNames } from '../../icons/generated/icons'
import { Code, Section } from './TokenDisplay'

const meta = {
  title: 'Foundations/Icons',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** Every icon from the Figma “Icons (core)” page, with its `name` for `<Icon name="…" />`. */
export const Icons: Story = {
  render: function Render() {
    const [query, setQuery] = useState('')
    const [size, setSize] = useState(24)
    const shown = iconNames.filter((n) => n.includes(query.trim().toLowerCase()))
    return (
      <Section
        title="Icons"
        description={`${iconNames.length} icons from the Figma “Icons (core)” page (Icon/<name>). Use them with <Icon name="…" />.`}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--keel-spacing-4x)', alignItems: 'center', marginBottom: 'var(--keel-spacing-6x)' }}>
          <label style={{ display: 'flex', gap: 'var(--keel-spacing-2x)', alignItems: 'center' }}>
            Search
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. arrow"
              style={{ font: 'inherit', padding: 'var(--keel-spacing-1x) var(--keel-spacing-2x)' }}
            />
          </label>
          <label style={{ display: 'flex', gap: 'var(--keel-spacing-2x)', alignItems: 'center' }}>
            Size
            <input
              type="number"
              min={12}
              value={size}
              onChange={(e) => setSize(Number(e.target.value) || 12)}
              style={{ font: 'inherit', width: 64, padding: 'var(--keel-spacing-1x) var(--keel-spacing-2x)' }}
            />
            px
          </label>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 'var(--keel-spacing-4x)' }}>
          {shown.map((n) => (
            <div
              key={n}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--keel-spacing-2x)',
                padding: 'var(--keel-spacing-4x) var(--keel-spacing-2x)',
                border: 'var(--keel-border-width-sm) solid var(--keel-surface-card)',
                borderRadius: 'var(--keel-border-radius-md)',
              }}
            >
              <Icon name={n} size={size} />
              <Code>{n}</Code>
            </div>
          ))}
          {!shown.length && <p style={{ color: 'var(--keel-text-secondary)' }}>No icon matches “{query}”.</p>}
        </div>
      </Section>
    )
  },
}
