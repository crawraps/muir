import fs from 'node:fs/promises'
import path from 'node:path'

async function replaceReactCalls() {
  const files = []
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== 'dist-app') {
        await walk(path.join(dir, entry.name))
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        files.push(path.join(dir, entry.name))
      }
    }
  }
  await walk(path.join(process.cwd(), 'lib'))
  await walk(path.join(process.cwd(), 'src'))

  for (const file of files) {
    let content = await fs.readFile(file, 'utf8')
    const original = content

    content = content.replace(/\bReact\.createElement\b/g, 'createElement')
    content = content.replace(/\bReact\.cloneElement\b/g, 'cloneElement')
    content = content.replace(/\bReact\.Children\b/g, 'Children')
    content = content.replace(/\bReact\.Fragment\b/g, 'Fragment')

    // Also remove import type React from 'react' if it is only used for those value functions
    // but wait, if it's used for React.HTMLAttributes, we still need it.
    // It's safer to keep `import type React from 'react'` because type checks use it.

    if (content !== original) {
      await fs.writeFile(file, content, 'utf8')
      console.log('Removed React prefix', file)
    }
  }
}

replaceReactCalls().catch(console.error)
