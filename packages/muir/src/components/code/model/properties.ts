import type React from 'react'

export type CodeTheme = 'light' | 'dark' | 'auto'

export interface CodeStyleContextType {
  theme: CodeTheme
  setTheme: (theme: CodeTheme) => void
  resolvedTheme: 'light' | 'dark'
  cycle: () => void
}

export interface CodeStyleProviderProps {
  children: React.ReactNode
  defaultTheme?: CodeTheme
}

export interface CodeProps extends Pick<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  language: string
  icons?: Record<string, string | React.ReactNode>
  onThemeChange?: (mode: 'light' | 'dark' | 'auto', resolved: 'dark' | 'light') => void
  children: React.ReactNode
  copyIcon?: React.ReactNode
  themeIcon?: React.ReactNode
  parseFirstCommentAsFilename?: boolean
  commentLineSignatures?: string[]
  filename?: string
}
