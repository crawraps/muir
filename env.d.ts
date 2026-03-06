/// <reference types="@rsbuild/core/types" />

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
