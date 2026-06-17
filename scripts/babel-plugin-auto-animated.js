import fs from 'node:fs'
import path from 'node:path'

export default function autoAnimatedPlugin({ types: t }) {
  return {
    name: 'auto-animated',
    visitor: {
      Program(programPath, state) {
        const filename = state.filename
        if (!filename) return

        // Skip animation.tsx files — they define Animated, not consume it
        if (path.basename(filename) === 'animation.tsx') return

        let needsAnimated = false

        // First pass: detect if `Animated` is used but not declared
        programPath.traverse({
          Identifier(idPath) {
            if (idPath.node.name === 'Animated' && !idPath.scope.hasBinding('Animated') && idPath.isReferencedIdentifier()) {
              needsAnimated = true
              idPath.stop()
            }
          },
        })

        if (!needsAnimated) return

        // Check that ./animation.tsx exists in the same directory
        const fileDir = path.dirname(filename)
        const animationFilePath = path.join(fileDir, 'animation.tsx')

        if (!fs.existsSync(animationFilePath)) return

        // Inject: import { Animated } from './animation';
        const animatedImport = t.importDeclaration([t.importSpecifier(t.identifier('Animated'), t.identifier('Animated'))], t.stringLiteral('./animation'))

        programPath.unshiftContainer('body', animatedImport)
      },
    },
  }
}
