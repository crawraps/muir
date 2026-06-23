export default function autoClsxPlugin({ types: t }) {
  return {
    name: 'auto-clsx',
    visitor: {
      Program(programPath, _state) {
        let needsClsx = false

        programPath.traverse({
          Identifier(idPath) {
            if (idPath.node.name === 'cx' && !idPath.scope.hasBinding('cx') && idPath.isReferencedIdentifier()) {
              needsClsx = true
              idPath.stop()
            }
          },
        })

        if (needsClsx) {
          const styleImport = t.importDeclaration([t.importDefaultSpecifier(t.identifier('_auto_style'))], t.stringLiteral('./style.module.css'))

          const smartClsxImport = t.importDeclaration([t.importSpecifier(t.identifier('_createSmartClsx'), t.identifier('createSmartClsx'))], t.stringLiteral('#shared/smart-clsx'))

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
