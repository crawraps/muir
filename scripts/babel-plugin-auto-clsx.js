import path from 'node:path'

export default function autoClsxPlugin({ types: t }) {
  return {
    name: 'auto-clsx',
    visitor: {
      Program(programPath, state) {
        let needsClsx = false

        // First pass: see if `cx` is used but not declared
        programPath.traverse({
          Identifier(idPath) {
            if (idPath.node.name === 'cx' && !idPath.scope.hasBinding('cx') && idPath.isReferencedIdentifier()) {
              needsClsx = true
              idPath.stop() // found one, we can stop the inner traversal
            }
          },
        })

        if (needsClsx) {
          // If the file is in lib/components, find relative path to shared/smart-clsx
          const filename = state.filename
          if (!filename) return

          // We'll just assume we're somewhere in lib/components or similar,
          // but we can compute the relative path dynamically or just use an absolute alias like 'cuil/lib/shared' if we set it up.
          // Wait, 'cuil' is the package name. So we can just import from 'cuil/lib/shared' if 'tsconfig.json' paths allow it, but for Babel it needs to match rspack alias or relative path.
          // Let's compute relative path to 'lib/shared/smart-clsx' based on process.cwd()
          const cwd = process.cwd()
          const sharedPath = path.join(cwd, 'lib/shared/smart-clsx')
          const fileDir = path.dirname(filename)
          let relativeSharedPath = path.relative(fileDir, sharedPath)
          if (!relativeSharedPath.startsWith('.')) {
            relativeSharedPath = `./${relativeSharedPath}`
          }
          // ensure posix separators
          relativeSharedPath = relativeSharedPath.split(path.sep).join(path.posix.sep)

          // Add: import style from './style.module.css';
          // Add: import { createSmartClsx as _createSmartClsx } from '<relativeSharedPath>';
          // Add: const cx = _createSmartClsx(style);

          const styleImport = t.importDeclaration([t.importDefaultSpecifier(t.identifier('_auto_style'))], t.stringLiteral('./style.module.css'))

          const smartClsxImport = t.importDeclaration([t.importSpecifier(t.identifier('_createSmartClsx'), t.identifier('createSmartClsx'))], t.stringLiteral(relativeSharedPath))

          const clsxDecl = t.variableDeclaration('const', [
            t.variableDeclarator(t.identifier('cx'), t.callExpression(t.identifier('_createSmartClsx'), [t.identifier('_auto_style')])),
          ])

          programPath.unshiftContainer('body', clsxDecl)
          programPath.unshiftContainer('body', smartClsxImport)
          programPath.unshiftContainer('body', styleImport)
        }
      },
    },
  }
}
