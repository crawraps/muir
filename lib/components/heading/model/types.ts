export interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> {
  /**
   * The heading level. Number from 1 to 6, corresponding to HTML heading tags h1 to h6.
   *
   * @default 1
   */
  level?: number | string

  /**
   * Alternative styling variants for the heading.
   *
   * @default false
   */
  variant?: boolean
}
