import { resolve } from 'node:path'
import { defineConfig } from '@rsbuild/core'
import { pluginBabel } from '@rsbuild/plugin-babel'
import { pluginMdx } from '@rsbuild/plugin-mdx'
import { pluginReact } from '@rsbuild/plugin-react'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import AutoImport from 'unplugin-auto-import/rspack'
import autoAnimatedPlugin from '../../scripts/babel-plugin-auto-animated.js'
import autoClsxPlugin from '../../scripts/babel-plugin-auto-clsx.js'

const ReactCompilerConfig = {}

export default defineConfig({
  output: {
    distPath: {
      root: 'dist',
    },
  },
  source: {
    entry: {
      index: './src/index.tsx',
    },
  },
  resolve: {
    alias: {
      src: resolve(__dirname, './src'),
      docs: resolve(__dirname, './docs'),
      '#shared': resolve(__dirname, '../../packages/base/src/shared'),
    },
  },
  html: {
    template: './src/index.html',
  },
  plugins: [
    pluginReact(),
    pluginMdx({
      mdxLoaderOptions: {
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter],
      },
    }),
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
      babelLoaderOptions: {
        plugins: ['babel-plugin-react-compiler', ReactCompilerConfig, autoClsxPlugin, autoAnimatedPlugin],
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
