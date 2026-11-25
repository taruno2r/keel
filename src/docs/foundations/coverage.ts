// Which tokens each Foundations page shows, as [Figma collection, Figma name prefix].
// The pages read their tokens from here, and `npm run tokens:check` fails if any
// token in the snapshot isn't matched by an entry, so new Figma variables can't
// silently miss Storybook. When it fails: add an entry (and render it on a page).
// Keep this file free of imports: scripts/check-tokens.mjs loads it directly.

export type CoverageEntry = readonly [collection: string, prefix: string]

export const coverage = {
  primitives: {
    color: ['Primitives', 'Color/'],
    scale: ['Primitives', 'Scale/'],
    fontFamily: ['Primitives', 'Font/Font Family/'],
    fontWeight: ['Primitives', 'Font/Font Weight/'],
  },
  theme: {
    all: ['Accent', ''],
  },
  spacing: {
    spacing: ['Spacing and Radius', 'Spacing/'],
  },
  border: {
    radius: ['Spacing and Radius', 'Border Radius/'],
    width: ['Spacing and Radius', 'Border Width/'],
  },
} as const satisfies Record<string, Record<string, CoverageEntry>>
