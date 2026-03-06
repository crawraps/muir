import { pluginReact } from '@rsbuild/plugin-react'
import { defineConfig } from '@rslib/core'

export default defineConfig({
  lib: [
    {
      id: 'library',
      format: 'esm',
      bundle: false,
      dts: true,
      source: {
        entry: {
          index: ['./lib/**'],
        },
      },
      output: {
        distPath: {
          root: './dist',
        },
        target: 'web',
      },
    },
    {
      id: 'landing-page',
      format: 'umd',
      bundle: true,
      source: {
        entry: {
          index: './src/index.tsx',
        },
      },
      output: {
        distPath: {
          root: './dist-app',
        },
        target: 'web',
      },
      html: {
        template: './src/index.html',
      },
    },
  ],
  plugins: [pluginReact()],
})
