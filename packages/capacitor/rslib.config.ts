import { pluginBabel } from '@rsbuild/plugin-babel'
import { pluginReact } from '@rsbuild/plugin-react'
import { defineConfig } from '@rslib/core'
import autoAnimatedPlugin from '../../scripts/babel-plugin-auto-animated.js'
import autoClsxPlugin from '../../scripts/babel-plugin-auto-clsx.js'

export default defineConfig({
  lib: [
    {
      id: 'library',
      format: 'esm',
      bundle: false,
      dts: true,
      source: {
        entry: {
          index: ['./src/**'],
        },
      },
      output: {
        distPath: {
          root: './dist',
        },
        target: 'web',
      },
    },
  ],
  plugins: [
    pluginReact(),
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
      babelLoaderOptions: {
        plugins: [autoClsxPlugin, autoAnimatedPlugin],
      },
    }),
  ],
})
