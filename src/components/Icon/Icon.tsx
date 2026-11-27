import type { CSSProperties, SVGAttributes } from 'react'
import { icons, type IconName } from '../../icons/generated/icons'
import { ICON_MIN_SIZE, ICON_SIZES, type IconSize } from './sizes'
import './Icon.css'


export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children' | 'color'> {
  /** Figma `Icon/<name>` on the "Icons" page, e.g. `check` for `Icon/check`. */
  name: IconName
  /**
   * Same as Figma `size`: `xsmall` (12px), `small` (16px), `medium` (20px), `large` (24px)
   * or `custom` (uses `customSize`). Defaults to `small`, like Figma. Icons are always square.
   */
  size?: IconSize
  /**
   * Code only (Figma's `custom` variant is resized on the instance). Width and height in
   * pixels when `size` is `custom`; anything below 12 is drawn at 12. Defaults to 32, the
   * custom variant's size in Figma. Ignored for the other sizes.
   */
  customSize?: number
  /**
   * Any CSS colour, including a token like `var(--keel-text-on-accent)`. Defaults to
   * `--keel-icon-default`, the colour the Figma icons are bound to.
   */
  color?: string
  /**
   * What the icon means, for screen readers. Leave it out when the icon is decorative or sits
   * next to text that says the same thing (the icon is then hidden from screen readers).
   */
  label?: string
}

/**
 * Use an icon to support a label or action with a familiar symbol, like a chevron on a
 * dropdown or a check in a confirmation. Choose the symbol with iconName, from the Icons
 * page. The size is small (16px) by default; use xsmall (12px), medium (20px) or large
 * (24px), or custom for any size from 12px up. When an icon is the only content of a control,
 * give the control an accessible name.
 */
export function Icon({ name, size = 'small', customSize = 32, color, label, className, style, ...rest }: IconProps) {
  const { viewBox, paths } = icons[name]
  const px = size === 'custom' ? Math.max(ICON_MIN_SIZE, customSize) : ICON_SIZES[size]
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true as const }
  const colorStyle: CSSProperties | undefined = color ? { color } : undefined
  return (
    <svg
      viewBox={viewBox}
      width={px}
      height={px}
      fill="currentColor"
      focusable="false"
      className={['keel-icon', className].filter(Boolean).join(' ')}
      style={colorStyle ? { ...colorStyle, ...style } : style}
      {...a11y}
      {...rest}
    >
      {paths.map((p, i) => (
        <path key={i} d={p.d} fillRule={'fillRule' in p ? (p.fillRule as SVGAttributes<SVGPathElement>['fillRule']) : undefined} />
      ))}
    </svg>
  )
}
