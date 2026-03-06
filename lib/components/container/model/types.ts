import type React from 'react'
export interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  /**
   * The border radius and paddings size of the container
   *
   * @default 'none'
   */
  shape?: 'none' | 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large'
  /**
   * The background color of the container by the level of the emphasis
   *
   * @default 'none'
   */
  emphasis?: 'none' | 'lowest' | 'low' | 'medium' | 'high' | 'highest'
}
