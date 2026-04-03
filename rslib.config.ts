import { resolve } from 'node:path'
import { pluginBabel } from '@rsbuild/plugin-babel'
import { pluginMdx } from '@rsbuild/plugin-mdx'
import { pluginReact } from '@rsbuild/plugin-react'
import { defineConfig } from '@rslib/core'
import remarkGfm from 'remark-gfm'
import AutoImport from 'unplugin-auto-import/rspack'
import autoClsxPlugin from './scripts/babel-plugin-auto-clsx.js'

export default defineConfig({
  source: {
    alias: {
      '@': resolve(__dirname, '.'),
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
    pluginMdx({ mdxLoaderOptions: { remarkPlugins: [remarkGfm] } }),
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
