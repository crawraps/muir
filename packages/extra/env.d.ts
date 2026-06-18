/// <reference types="@rslib/core/types" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}

import type { ClassValue } from 'clsx'
import type { BaseAnimatedProps } from '@muir/base'
declare global {
  const cx: (moduleClassNames: ClassValue, ...args: ClassValue[]) => string
  const Animated: (props: BaseAnimatedProps) => JSX.Element | null
}
