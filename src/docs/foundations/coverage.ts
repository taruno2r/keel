// Which tokens each Foundations page shows, as [Figma collection, Figma name prefix].
// The pages read their tokens from here, and `npm run tokens:check` fails if any
// token in the snapshot isn't matched by an entry, so new Figma variables can't
// silently miss Storybook. When it fails: add an entry (and render it on a page).
// Keep this file free of imports: scripts/check-tokens.mjs loads it directly.

export type CoverageEntry = readonly [collection: string, prefix: string]

export const coverage = {
  primitives: {
    color: ['Primitives', 'keel-color/'],
    scale: ['Primitives', 'keel-scale/'],
    fontFamily: ['Primitives', 'keel-font/font-family/'],
    fontWeight: ['Primitives', 'keel-font/font-weight/'],
  },
  theme: {
    all: ['Accent', ''],
  },
  spacing: {
    spacing: ['Spacing and Radius', 'keel-spacing/'],
  },
  typography: {
    fontSize: ['Typography', 'keel-typography/font-size/'],
    lineHeight: ['Typography', 'keel-typography/line-height/'],
  },
  border: {
    radius: ['Spacing and Radius', 'keel-border/radius/'],
    width: ['Spacing and Radius', 'keel-border/width/'],
  },
  interactive: {
    disabled: ['Interactive', 'keel-interactive/disabled'],
    activeScale: ['Interactive', 'keel-interactive/active/'],
    focusOffset: ['Interactive', 'keel-interactive/focus-ring/offset'],
    focusWidth: ['Interactive', 'keel-interactive/focus-ring/width'],
    focusRadius: ['Interactive', 'keel-interactive/focus-ring/radius/'],
  },
  motion: {
    duration: ['Motion', 'keel-motion/duration-'],
  },
} as const satisfies Record<string, Record<string, CoverageEntry>>
