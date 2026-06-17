import type React from 'react'

type HeadingProps = Omit<React.HTMLAttributes<HTMLHeadingElement>, 'children'> & { ref?: React.Ref<HTMLHeadingElement>; children?: React.ReactNode }
type ParagraphProps = Omit<React.HTMLAttributes<HTMLParagraphElement>, 'children'> & { ref?: React.Ref<HTMLParagraphElement>; children?: React.ReactNode }
type SpanProps = Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> & { ref?: React.Ref<HTMLSpanElement>; children?: React.ReactNode }
type LabelProps = Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'children'> & { ref?: React.Ref<HTMLLabelElement>; children?: React.ReactNode }
type AnchorProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & { ref?: React.Ref<HTMLAnchorElement>; children?: React.ReactNode }

type Size = 'small' | 'medium' | 'large'

interface BaseTextProps {
  /**
   * The typographic size within the chosen scale.
   * @default 'medium'
   */
  size?: Size
}

/**
 * @docs
 * Properties for the Text component.
 * The available HTML attributes depend on the `type` prop.
 */
export type TextProps =
  | (BaseTextProps & { type: 'h1' } & HeadingProps)
  | (BaseTextProps & { type: 'h2' } & HeadingProps)
  | (BaseTextProps & { type: 'h3' } & HeadingProps)
  | (BaseTextProps & { type: 'h4' } & HeadingProps)
  | (BaseTextProps & { type: 'h5' } & HeadingProps)
  | (BaseTextProps & { type: 'h6' } & HeadingProps)
  | (BaseTextProps & { type: 'body' } & ParagraphProps)
  | (BaseTextProps & { type: 'label' } & LabelProps)
  | (BaseTextProps & { type: 'title' } & SpanProps)
  | (BaseTextProps & { type: 'display' } & SpanProps)
  | (BaseTextProps & { type: 'anchor' } & AnchorProps)
