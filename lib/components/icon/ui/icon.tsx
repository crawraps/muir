import type { IconProps } from '../model/types'

function Icon({ name, ...props }: IconProps) {
  return (
    <svg {...props} xmlns='http://www.w3.org/2000/svg'>
      <title>{name}</title>
      <use href={`#${name}`} />
    </svg>
  )
}

export default Icon
