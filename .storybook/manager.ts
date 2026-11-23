import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'

// Shows "Keel" at the top-left of the Storybook sidebar.
addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Keel',
  }),
})
