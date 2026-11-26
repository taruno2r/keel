import type { CSSProperties, SVGAttributes } from 'react'
import { icons, type IconName } from '../../icons/generated/icons'
import './Icon.css'

/** Icons are never drawn smaller than this, in pixels. */
export const ICON_MIN_SIZE = 12

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children' | 'color'> {
  /** Figma `Icon/<name>` on the "Icons (core)" page, e.g. `check` for `Icon/check`. */
  name: IconName
  /**
   * Width and height in pixels; icons are always square. Any size from 12 up; smaller
   * values are drawn at 12. Defaults to 24, the size the icons are drawn at in Figma.
   */
  size?: number
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
 * dropdown or a check in a confirmation. Icons come from the Figma "Icons (core)" page.
 * When an icon is the only content of a control, give it a `label`.
 */
export function Icon({ name, size = 24, color, label, className, style, ...rest }: IconProps) {
  const { viewBox, paths } = icons[name]
  const px = Math.max(ICON_MIN_SIZE, size)
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
