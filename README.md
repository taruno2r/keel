# ds-theming

A themeable web design system (React + TypeScript), documented in Storybook.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run storybook` | Start Storybook at http://localhost:6006 |
| `npm run build-storybook` | Build static Storybook to `storybook-static/` |
| `npm run test-storybook` | Run every story as a test (render + a11y) in headless Chromium |
| `npm run dev` | Local Vite playground |
| `npm run lint` | Lint with oxlint |

## Structure

```
.storybook/          Storybook config; theme switcher lives in preview.tsx
src/
  tokens/
    primitives.css   Raw palette & scales (placeholders until Figma export)
    themes/          Semantic tokens per theme (light.css, dark.css)
    index.css        Token entry point
  components/        One folder per component, with its stories
  docs/              Storybook docs pages and foundations stories
  index.ts           Public exports
```

See the **Introduction** page in Storybook for how theming works.
