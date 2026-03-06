import fs from 'node:fs/promises'
import path from 'node:path'

async function fixReactImports() {
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

    // If file uses React.xxx but doesn't import React
    if (/\bReact\./.test(content) || /\bReactNode\b/.test(content)) {
      if (!/import.*from ['"]react['"]/.test(content)) {
        content = `import React, { type ReactNode } from 'react';\n${content}`
      }
    }

    if (content !== original) {
      await fs.writeFile(file, content, 'utf8')
      console.log('Fixed React import', file)
    }
  }
}

fixReactImports().catch(console.error)
