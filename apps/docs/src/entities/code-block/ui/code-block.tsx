import { Code, useCodeStyle } from '@muir/extra'
import { ThemeIcon } from 'src/shared'
import { extractFilename } from '../model/extract-filename'
import { normalizeLanguage, SyntaxHighlighter } from '../model/languages'
import { codeThemeStyles } from '../model/themes'

const SYNTAX_STYLE_ID = 'syntax-highlighter-themes'

const iconsMapping = {
  js: 'lang-js',
  jsx: 'lang-js',
  ts: 'lang-ts',
  tsx: 'lang-ts',
  css: 'lang-css',
  html: 'lang-html',
  md: 'lang-markdown',
  xml: 'lang-xml',
}

function useInjectSyntaxStyles() {
  useEffect(() => {
    if (document.getElementById(SYNTAX_STYLE_ID)) return
    const style = document.createElement('style')
    style.id = SYNTAX_STYLE_ID
    style.textContent = codeThemeStyles
    document.head.appendChild(style)
  }, [])
}

export function CodeBlock({
  language,
  code,
  parseFirstCommentAsFilename = true,
  commentLineSignatures,
}: {
  language: string
  code: string
  parseFirstCommentAsFilename?: boolean
  commentLineSignatures?: string[]
}) {
  const { theme } = useCodeStyle()
  const normalized = normalizeLanguage(language)

  useInjectSyntaxStyles()

  let filename: string | undefined
  let displayCode = code

  if (parseFirstCommentAsFilename) {
    const result = extractFilename(code, commentLineSignatures)
    if (result.filename) {
      filename = result.filename
      displayCode = result.strippedCode
    }
  }

  return (
    <Code
      className={cx('code-block')}
      filename={filename}
      icons={iconsMapping}
      language={normalized}
      themeIcon={<ThemeIcon style={{ width: '1.375rem', height: '1.375rem' }} theme={theme} />}
    >
      <SyntaxHighlighter className={`language-${normalized}`} codeTagProps={{ style: {} }} language={normalized} useInlineStyles={false}>
        {displayCode}
      </SyntaxHighlighter>
    </Code>
  )
}
