import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import { toCssLength, type CssLength } from '../shared/cssLength'
import './Button.css'

/** A pixel value (`240` or `'240px'`) or a percentage of the container (`'50%'`). */
export type ButtonFillWidth = CssLength

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Same as Figma `variant`. `primary` for the main action, `secondary` for supporting actions,
   * `ghost` for low-emphasis actions, `danger` for destructive actions like deleting.
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  /** Same as Figma `size`: `small` (32px tall), `medium` (40px) or `large` (48px). */
  size?: 'small' | 'medium' | 'large'
  /** Same as Figma `width` (`auto`, `fill`). `fill` stretches to the container; long labels truncate. */
  width?: 'auto' | 'fill'
  /**
   * Code only (not in Figma, where the width is set on the instance). Used when `width` is `fill`:
   * a pixel value (`240` or `'240px'`) or a percentage of the container (`'50%'`). Defaults to `100%`.
   * Ignored when `width` is `auto`.
   */
  fillWidth?: ButtonFillWidth
  /** Figma `label`. A concise, action-oriented label. */
  children: ReactNode
}

/**
 * Use a button to trigger an action, like submitting a form, saving changes,
 * or confirming a choice. Use Primary for the main action in a page or dialog,
 * and Secondary for supporting actions next to it. Use Ghost for low-emphasis
 * actions, and Danger for destructive actions like deleting. To take people to
 * another page, use a link instead.
 *
 * Hover and focus are real browser states (`:hover`, `:focus-visible`),
 * matching Figma's `State` = `hover` / `focused` variants.
 */
export function Button({
  variant = 'primary',
  size = 'small',
  width = 'auto',
  fillWidth,
  type = 'button',
  className,
  style,
  children,
  ...rest
}: ButtonProps) {
  const fill = width === 'fill'
  const classes = ['keel-button', `keel-button--${variant}`, `keel-button--${size}`, fill && 'keel-button--fill', className]
    .filter(Boolean)
    .join(' ')
  const cssFillWidth = fill ? toCssLength(fillWidth) : undefined
  const fillStyle = cssFillWidth ? ({ '--keel-button-fill-width': cssFillWidth } as CSSProperties) : undefined
  return (
    <button type={type} className={classes} style={fillStyle ? { ...fillStyle, ...style } : style} {...rest}>
      <span className="keel-button__label">{children}</span>
    </button>
  )
}
