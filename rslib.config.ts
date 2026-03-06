import { pluginBabel } from '@rsbuild/plugin-babel'
import { pluginReact } from '@rsbuild/plugin-react'
import { defineConfig } from '@rslib/core'
import AutoImport from 'unplugin-auto-import/rspack'
import autoClsxPlugin from './scripts/babel-plugin-auto-clsx.js'

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
  plugins: [
    pluginReact(),
    pluginBabel({
      babelLoaderOptions(config) {
        config.plugins ??= []
        config.plugins.push(autoClsxPlugin)
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
