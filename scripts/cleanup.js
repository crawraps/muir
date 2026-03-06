import fs from 'node:fs/promises'
import path from 'node:path'

async function cleanup() {
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

    // Remove `import React from 'react'` or `import React, { ... } from 'react'`
    // Be careful to keep other imports if it's `import React, { useState } from 'react'`
    // Since we'll use unplugin-auto-import, we can remove `useState`, `useEffect`, etc. from 'react'
    // Actually, `unplugin-auto-import` will only auto-import if they are unbound.
    // It's safe to just remove the entire `import ... from 'react'` line?
    // Let's just remove `import React from 'react'` and `import React, { ... } from 'react'`
    // Wait, unplugin-auto-import covers React, hooks, etc.
    // Let's just remove `import React from 'react'\n` for now.
    content = content.replace(/^import React from ['"]react['"];?\n?/gm, '')

    // Also `import React, { useMemo } from 'react'` -> `import { useMemo } from 'react'`
    content = content.replace(/^import React, \{(.+?)\} from ['"]react['"];?\n?/gm, "import {$1} from 'react';\n")

    const hasClsxCreate = /const\s+clsx\s*=\s*createSmartClsx\((style|styles)\)/.test(content)
    if (hasClsxCreate) {
      // remove const clsx = createSmartClsx(style)
      content = content.replace(/^const\s+clsx\s*=\s*createSmartClsx\((style|styles)\);?\n?/gm, '')

      // remove import style from './style.module.css'
      content = content.replace(/^import\s+(style|styles)\s+from\s+['"]\.\/style\.module\.css['"];?\n?/gm, '')
    }

    // Remove `createSmartClsx` from shared import
    content = content.replace(/createSmartClsx,\s*/g, '')
    content = content.replace(/,\s*createSmartClsx/g, '')
    content = content.replace(/{\s*createSmartClsx\s*}/g, '{}')
    // Remove empty import {} from '../../../shared'
    content = content.replace(/^import\s*\{\s*\}\s*from\s*['"]\.\.\/\.\.\/\.\.\/shared['"];?\n?/gm, '')

    // Cleanup React imports if unplugin-auto-import is going to handle it, we can remove `import { ... } from 'react'` completely!
    // AutoImport({ imports: ['react'] }) handles all React exports
    content = content.replace(/^import\s+\{([^}]+)\}\s+from\s+['"]react['"];?\n?/gm, '')

    if (content !== original) {
      await fs.writeFile(file, content, 'utf8')
      console.log('Cleaned', file)
    }
  }
}

cleanup().catch(console.error)
