import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { IconName } from '../../icons/generated/icons'
import { Icon, type IconSize } from '../Icon'
import './Button.css'

/** Figma: the icon slots use the Icon component one size below the button. */
const ICON_SIZE: Record<NonNullable<ButtonProps['size']>, IconSize> = { small: 'xsmall', medium: 'small', large: 'medium' }

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Same as Figma `variant`. `primary` for the main action, `secondary` for supporting actions,
   * `ghost` for low-emphasis actions, `danger` for destructive actions like deleting.
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  /** Same as Figma `size`: `small` (32px tall), `medium` (40px) or `large` (48px). */
  size?: 'small' | 'medium' | 'large'
  /**
   * Figma `iconLeft`: an icon before the label. Pass an icon name (Figma's default is `search`);
   * leave it out for no icon. Sized to the button (12 / 16 / 20px) and coloured per variant.
   */
  iconLeft?: IconName
  /**
   * Figma `iconRight`: an icon after the label. Pass an icon name (Figma's default is
   * `chevron-down`); leave it out for no icon.
   */
  iconRight?: IconName
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
  iconLeft,
  iconRight,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = ['keel-button', `keel-button--${variant}`, `keel-button--${size}`, className].filter(Boolean).join(' ')
  return (
    <button type={type} className={classes} {...rest}>
      {iconLeft && <Icon name={iconLeft} size={ICON_SIZE[size]} className="keel-button__icon" />}
      <span className="keel-button__label">{children}</span>
      {iconRight && <Icon name={iconRight} size={ICON_SIZE[size]} className="keel-button__icon" />}
    </button>
  )
}
