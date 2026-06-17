import { MDXProvider } from '@mdx-js/react'
import type React from 'react'
import { customRenderersMappings } from '../model/renderers-mapping'

/**
 * Wraps an MDX content tree so that markdown elements are rendered with
 * the project's custom components (see `customRenderersMappings`).
 *
 * Relies on `@rsbuild/plugin-mdx` being configured with
 * `mdxLoaderOptions.providerImportSource: '@mdx-js/react'` so the compiled
 * MDX output calls `useMDXComponents` from this package.
 */
export function DocsMDXProvider({ children }: { children: React.ReactNode }) {
  return <MDXProvider components={customRenderersMappings}>{children}</MDXProvider>
}
