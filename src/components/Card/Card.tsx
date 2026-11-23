import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { toCssLength, type CssLength } from '../shared/cssLength'
import './Card.css'

/** A pixel value (`320` or `'320px'`) or a percentage of the container (`'50%'`). */
export type CardWidth = CssLength

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Same as Figma `title`. */
  title: string
  /** Same as Figma `description`. */
  description: string
  /** The image at the top of the card, shown 160px tall and cropped to fill. Leave `alt` empty if it's decorative. */
  image: { src: string; alt: string }
  /** Buttons in the action row; they share the width equally. In Figma: a Secondary and a Primary `Button`. */
  actions: ReactNode
  /**
   * Code only (not in Figma). The HTML heading tag for the title (`h2`–`h6`), so it fits the page's
   * heading outline for screen readers. Doesn't change the look: the title always uses the H6 text style.
   * Defaults to 3.
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  /**
   * Code only (not in Figma, where the card is 320px). A pixel value (`320` or `'320px'`) or a
   * percentage of the container (`'50%'`). Defaults to filling the container.
   */
  width?: CardWidth
}

/**
 * Use a card to show a short summary of one item, like a product, an article,
 * or a place, with actions for it. Cards work well in a grid or list where
 * people browse and pick items.
 */
export function Card({ title, description, image, actions, headingLevel = 3, width, className, style, ...rest }: CardProps) {
  const Heading = `h${headingLevel}` as const
  const cssWidth = toCssLength(width)
  const widthStyle = cssWidth ? ({ '--ds-card-width': cssWidth } as CSSProperties) : undefined
  return (
    <article
      className={['ds-card', className].filter(Boolean).join(' ')}
      style={widthStyle ? { ...widthStyle, ...style } : style}
      {...rest}
    >
      <img className="ds-card__image" src={image.src} alt={image.alt} />
      <div className="ds-card__body">
        <div className="ds-card__text">
          <Heading className="ds-card__title">{title}</Heading>
          <p className="ds-card__description">{description}</p>
        </div>
        <div className="ds-card__actions">{actions}</div>
      </div>
    </article>
  )
}
