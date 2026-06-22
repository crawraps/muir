import { resolve } from 'node:path'
import { pluginBabel } from '@rsbuild/plugin-babel'
import { pluginReact } from '@rsbuild/plugin-react'
import { defineConfig } from '@rslib/core'
import AutoImport from 'unplugin-auto-import/rspack'
import autoClsxPlugin from '../../scripts/babel-plugin-auto-clsx.js'

export default defineConfig({
  resolve: {
    alias: {
      '#shared': resolve(__dirname, './src/shared'),
      src: resolve(__dirname, './src'),
    },
  },
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
        plugins: [autoClsxPlugin],
      },
    }),
  ],
  tools: {
    rspack: {
      plugins: [
        AutoImport({
          imports: [
            'react',
            {
              react: ['Children', 'cloneElement', 'createElement'],
            },
          ],
          dts: './auto-imports.d.ts',
        }),
      ],
    },
  },
})
