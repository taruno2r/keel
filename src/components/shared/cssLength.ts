/** A pixel value (`240` or `'240px'`) or a percentage of the container (`'50%'`). */
export type CssLength = number | `${number}px` | `${number}%`

/**
 * Converts a CssLength to a CSS value. Numbers, and numeric strings without a
 * unit (e.g. from a text input), are pixels. Returns undefined for no value or
 * an empty string (e.g. a cleared text input).
 */
export function toCssLength(value: CssLength | string | undefined): string | undefined {
  if (value === undefined || value === '') return undefined
  return typeof value === 'number' || /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value
}
