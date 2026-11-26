// Icon sizes, kept out of Icon.tsx so that file only exports the component (fast refresh).

/** Icons are never drawn smaller than this, in pixels (applies to `customSize`). */
export const ICON_MIN_SIZE = 12

/** Pixel size of each Figma `size` variant (except `custom`). */
export const ICON_SIZES = { xsmall: 12, small: 16, medium: 20, large: 24 } as const

export type IconSize = keyof typeof ICON_SIZES | 'custom'
