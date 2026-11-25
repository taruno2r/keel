import type { HTMLAttributes } from 'react'
import './Badge.css'

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Same as Figma `label`. One or two words; the badge never wraps. */
  label: string
}

/**
 * Use a badge to label an item with a short status or category, like “New”,
 * “Beta” or “Draft”. Badges are for reading only: people can’t click them.
 * Keep the label to one or two words.
 */
export function Badge({ label, className, ...rest }: BadgeProps) {
  return (
    <span className={['keel-badge', className].filter(Boolean).join(' ')} {...rest}>
      {label}
    </span>
  )
}
