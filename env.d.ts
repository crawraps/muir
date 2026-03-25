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
declare namespace JSX {
  interface IntrinsicElements {
    // biome-ignore lint/suspicious/noExplicitAny: Custom element types are not available
    'dotlottie-player': any
  }
}

import type { ClassValue } from 'clsx'
declare global {
  const cx: (moduleClassNames: ClassValue, ...args: ClassValue[]) => string
}
