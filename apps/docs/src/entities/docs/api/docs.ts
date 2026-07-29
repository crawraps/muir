import type React from 'react'

// Using Rspack/Webpack require.context to auto-load all mdx files
// biome-ignore lint/suspicious/noExplicitAny: Needs to hold dynamically required context
let docsContext: any
try {
  docsContext = require.context('docs', true, /\.mdx$/)
} catch (e) {
  console.warn('Failed to load docs context', e)
}

export const getAvailableDocs = (): string[] => {
  if (!docsContext) return []
  return docsContext.keys().map((key: string) => key.replace('./', '').replace('.mdx', ''))
}

export const getDocCategories = (): string[] => {
  const docs = getAvailableDocs().filter(doc => doc !== 'index')
  const categories = new Set<string>()
  for (const doc of docs) {
    const parts = doc.split('/')
    if (parts.length > 1) {
      categories.add(parts[0])
    }
  }
  return Array.from(categories)
}

export const getDocsByCategory = (category: string): string[] => {
  const docs = getAvailableDocs().filter(doc => doc !== 'index')
  return docs.filter(doc => {
    const parts = doc.split('/')
    return parts.length > 1 && parts[0] === category
  })
}

export const getGroupedDocs = (): Record<string, string[]> => {
  const docs = getAvailableDocs().filter(doc => doc !== 'index')
  const grouped: Record<string, string[]> = {}
  for (const doc of docs) {
    const parts = doc.split('/')
    if (parts.length > 1) {
      const category = parts[0]
      if (!grouped[category]) grouped[category] = []
      grouped[category].push(doc)
    }
  }
  return grouped
}

export const getDocComponent = (name: string): React.ComponentType | null => {
  if (!docsContext) return null
  const key = `./${name}.mdx`
  if (docsContext.keys().includes(key)) {
    return docsContext(key).default
  }
  return null
}

export const getDocFrontmatter = (name: string): Record<string, unknown> | null => {
  if (!docsContext) return null
  const key = `./${name}.mdx`
  if (docsContext.keys().includes(key)) {
    return docsContext(key).frontmatter ?? null
  }
  return null
}

type Doc = {
  name: string
  component: React.ComponentType
  frontmatter: Record<string, unknown>
}

export function resolveDoc(name: string): Doc | null {
  if (!docsContext) return null

  const key = `./${name}.mdx`
  if (!docsContext.keys().includes(key)) return null

  return {
    name,
    component: docsContext(key).default,
    frontmatter: docsContext(key).frontmatter,
  }
}
