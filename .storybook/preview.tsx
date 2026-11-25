import type { Preview } from '@storybook/react-vite'
import { withThemeByDataAttribute } from '@storybook/addon-themes'
import { themes } from '../src/tokens/generated/tokens'
import '../src/tokens/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Canvas background comes from the theme tokens, not the backgrounds addon.
    backgrounds: { disable: true },
    options: {
      // Introduction and Foundations keep this order; anything not listed (e.g. each component) is alphabetical.
      storySort: {
        method: 'alphabetical',
        order: ['Introduction', 'Foundations', ['Primitives', 'Accent', 'Spacing', 'Border'], 'Components'],
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  decorators: [
    // Toolbar theme switcher. Sets <html data-theme="..."> to one of the
    // modes of the Figma "Accent" collection (generated into tokens.ts).
    withThemeByDataAttribute({
      themes: Object.fromEntries(themes.map((t) => [t[0].toUpperCase() + t.slice(1), t])),
      defaultTheme: 'Default',
      attributeName: 'data-theme',
    }),
  ],
}

export default preview
