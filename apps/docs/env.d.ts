/// <reference types="@rsbuild/core/types" />
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

declare module '*.svg?url' {
  const url: string
  export default url
}

declare namespace JSX {
  interface IntrinsicElements {
    'dotlottie-player': any
  }
}

import type { ClassValue } from 'clsx'
import type { BaseAnimatedProps } from '@muir/capacitor'
declare global {
  const cx: (moduleClassNames: ClassValue, ...args: ClassValue[]) => string
  const Animated: (props: BaseAnimatedProps) => JSX.Element | null
}