import type { ButtonHTMLAttributes } from 'react'
import './Chip.css'

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Same as Figma `label`. One or two words; the chip never wraps. */
  label: string
  /**
   * Same as Figma `selected` (`true`, `false`). The chip doesn't toggle itself: flip this in
   * `onClick`. Screen readers announce it as a pressed or unpressed toggle.
   */
  selected?: boolean
}

/**
 * Use chips to let people filter content or pick options, like categories or
 * tags. People can select one or more chips in a group; selected chips are
 * filled. Keep labels short, and use a button for actions instead.
 *
 * Hover and focus are real browser states (`:hover`, `:focus-visible`),
 * matching Figma's `State` = `hover` / `focused` variants, selected or not.
 */
export function Chip({ label, selected = false, type = 'button', className, ...rest }: ChipProps) {
  const classes = ['keel-chip', selected && 'keel-chip--selected', className].filter(Boolean).join(' ')
  return (
    <button type={type} className={classes} aria-pressed={selected} {...rest}>
      {label}
    </button>
  )
}
