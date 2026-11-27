import type { HTMLAttributes } from 'react'
import './Badge.css'

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Same as Figma `label`. One or two words; the badge never wraps. */
  label: string
  /**
   * Same as Figma `variant`. `default` for neutral labels, `accent` to follow the theme's accent,
   * and `success`, `warning` or `danger` for status.
   */
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger'
}

/**
 * Use a badge to label an item with a short status or category, like “New”,
 * “Beta” or “Draft”. Badges are for reading only: people can’t click them.
 * Keep the label to one or two words.
 */
export function Badge({ label, variant = 'default', className, ...rest }: BadgeProps) {
  return (
    <span className={['keel-badge', `keel-badge--${variant}`, className].filter(Boolean).join(' ')} {...rest}>
      {label}
    </span>
  )
}
