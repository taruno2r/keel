# ds-theming

A themeable web design system (React + TypeScript), documented in Storybook.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run tokens` | Regenerate CSS tokens from `src/tokens/figma/variables.json` |
| `npm run tokens:check` | Fail if generated tokens are stale or a token isn't shown in Storybook |
| `npm run tokens:diff` | List variables added/removed/changed since the last commit |
| `npm run storybook` | Start Storybook at http://localhost:6006 |
| `npm run build-storybook` | Build static Storybook to `storybook-static/` |
| `npm run test-storybook` | Run every story as a test (render + a11y) in headless Chromium |
| `npm run dev` | Local Vite playground |
| `npm run lint` | Lint with oxlint |

## Structure

```
.storybook/              Storybook config; theme switcher lives in preview.tsx
scripts/build-tokens.mjs Figma variables JSON -> CSS custom properties
scripts/figma/           Read-only script run inside Figma to export variables
.claude/skills/          /sync-tokens: pull Figma variables and update everything
src/
  tokens/
    figma/variables.json Snapshot of the Figma variables (source of truth in code)
    generated/           Generated CSS + tokens.ts manifest. Do not edit.
    index.css            Token entry point + base body styles
  components/            One folder per component, with its stories
  docs/                  Introduction + Foundations stories (colors, spacing, border, type)
  index.ts               Public exports
```

Themes are the modes of the Figma **Theme** collection (`Default`, `Indigo`), applied with
`data-theme="default|indigo"`. See the **Introduction** page in Storybook for details.

## Keeping tokens in sync with Figma

After changing variables in Figma, run `/sync-tokens` in Claude Code. It regenerates the tokens and runs
`npm run tokens:check`, which fails if the snapshot is stale or a token is missing from Storybook.
There is no automatic check yet, so run the sync whenever Figma variables change.
