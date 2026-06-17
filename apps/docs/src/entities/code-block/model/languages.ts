import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown'
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup'
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx'
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'

SyntaxHighlighter.registerLanguage('html', markup)
SyntaxHighlighter.registerLanguage('js', javascript)
SyntaxHighlighter.registerLanguage('jsx', jsx)
SyntaxHighlighter.registerLanguage('ts', typescript)
SyntaxHighlighter.registerLanguage('tsx', tsx)
SyntaxHighlighter.registerLanguage('css', css)
SyntaxHighlighter.registerLanguage('md', markdown)

const aliases: Record<string, string> = {
  javascript: 'js',
  typescript: 'ts',
  xml: 'html',
  markdown: 'md',
}

export function normalizeLanguage(lang: string): string {
  return aliases[lang.toLowerCase()] || lang.toLowerCase()
}

export { SyntaxHighlighter }
