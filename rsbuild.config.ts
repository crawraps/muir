import { resolve } from 'node:path'
import { defineConfig } from '@rsbuild/core'
import { pluginBabel } from '@rsbuild/plugin-babel'
import { pluginMdx } from '@rsbuild/plugin-mdx'
import { pluginReact } from '@rsbuild/plugin-react'
import remarkGfm from 'remark-gfm'
import AutoImport from 'unplugin-auto-import/rspack'
import autoClsxPlugin from './scripts/babel-plugin-auto-clsx.js'

export default defineConfig({
  source: {
    alias: {
      '@': resolve(__dirname, '.'),
    },
    entry: {
      index: './src/index.tsx',
    },
  },
  html: {
    template: './src/index.html',
  },
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
