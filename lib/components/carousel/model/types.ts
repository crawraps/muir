import type { ReactNode } from 'react'

export interface CarouselProps {
  currentSlide?: number
  onSlideChange?(index: number): void
  /**
   * Weather to change slides automatically based on `autoPlayInterval`
   */
  autoPlay?: boolean
  /**
   * Interval in milliseconds to change slides
   *
   * @default 1000
   */
  autoPlayInterval?: number
  loop?: boolean
  /**
   * Direction of carousel
   */
  direction: 'horizontal' | 'vertical'
  /**
   * Size of a currently displayed slide, relative to the container direction dimension
   *
   * @default 100%
   */
  frontSize?: `${number}%`
  className?: string
  children?: ReactNode
}
