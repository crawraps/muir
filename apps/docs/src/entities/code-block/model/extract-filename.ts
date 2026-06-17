const DEFAULT_SIGNATURES = ['//', '#', '/*', '<!--', '--', ';', '%', '/**']

export function extractFilename(code: string, signatures: string[] = DEFAULT_SIGNATURES): { filename: string | null; strippedCode: string } {
  const trimmed = code.trimStart()
  const firstLineEnd = trimmed.indexOf('\n')
  const firstLine = firstLineEnd === -1 ? trimmed : trimmed.slice(0, firstLineEnd)

  for (const sig of signatures) {
    const trimmedFirstLine = firstLine.trimStart()
    if (trimmedFirstLine.startsWith(sig)) {
      const afterSig = trimmedFirstLine.slice(sig.length).trimStart()
      if (afterSig.length > 0) {
        const rest = firstLineEnd === -1 ? '' : trimmed.slice(firstLineEnd + 1).replace(/^\n+/, '')
        return { filename: afterSig, strippedCode: rest }
      }
      return { filename: null, strippedCode: code }
    }
  }

  return { filename: null, strippedCode: code }
}