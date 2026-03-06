import type React from 'react'
export interface LabelProps extends React.BaseHTMLAttributes<HTMLSpanElement> {
  htmlFor?: string | boolean
  children: React.ReactNode
}
