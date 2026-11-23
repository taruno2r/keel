import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import './Button.css'

/** A pixel value (`240` or `'240px'`) or a percentage of the container (`'50%'`). */
export type ButtonFillWidth = number | `${number}px` | `${number}%`

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Same as Figma `variant` (Primary, Secondary). Primary for the main action, Secondary for supporting actions. */
  variant?: 'primary' | 'secondary'
  /** Same as Figma `width` (Auto, Fill). `fill` stretches to the container; long labels truncate. */
  width?: 'auto' | 'fill'
  /**
   * Code only (not in Figma, where the width is set on the instance). Used when `width` is `fill`:
   * a pixel value (`240` or `'240px'`) or a percentage of the container (`'50%'`). Defaults to `100%`.
   * Ignored when `width` is `auto`.
   */
  fillWidth?: ButtonFillWidth
  /** Figma `Label`. A concise, action-oriented label. */
  children: ReactNode
}

// Numbers, and numeric strings without a unit (e.g. from a text input), are pixels.
const toCssWidth = (value: ButtonFillWidth | string) =>
  typeof value === 'number' || /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value

/**
 * Use a button to trigger an action, like submitting a form, saving changes,
 * or confirming a choice. Use Primary for the main action in a page or dialog,
 * and Secondary for supporting actions next to it. To take people to another
 * page, use a link instead.
 *
 * Hover and focus are real browser states (`:hover`, `:focus-visible`),
 * matching Figma's `State` = Hover / Focus variants.
 */
export function Button({
  variant = 'primary',
  width = 'auto',
  fillWidth,
  type = 'button',
  className,
  style,
  children,
  ...rest
}: ButtonProps) {
  const fill = width === 'fill'
  const classes = ['ds-button', `ds-button--${variant}`, fill && 'ds-button--fill', className].filter(Boolean).join(' ')
  // Treat an empty string (e.g. a cleared text input) like no value.
  const rawWidth: ButtonFillWidth | string | undefined = fillWidth
  const fillStyle =
    fill && rawWidth !== undefined && rawWidth !== ''
      ? ({ '--ds-button-fill-width': toCssWidth(rawWidth) } as CSSProperties)
      : undefined
  return (
    <button type={type} className={classes} style={fillStyle ? { ...fillStyle, ...style } : style} {...rest}>
      <span className="ds-button__label">{children}</span>
    </button>
  )
}
