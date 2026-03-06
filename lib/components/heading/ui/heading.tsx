import type { Props } from '../model/types'

function Heading({ children, className, level = 1, variant = false, ...props }: Props) {
  return createElement(
    `h${level}`,
    {
      className: clsx(['heading', variant && 'variant'], className),
      ...props,
    },
    children,
  )
}

export default Heading
