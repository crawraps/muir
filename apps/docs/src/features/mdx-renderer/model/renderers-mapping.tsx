import { Text } from '@muir/capacitor'
import type React from 'react'
import { CodeBlock } from 'src/entities/code-block'
import { Table } from 'src/entities/table'

type MdxCtx<T extends keyof React.JSX.IntrinsicElements> = React.JSX.IntrinsicElements[T]

export const customRenderersMappings = {
  h1(props: MdxCtx<'h1'>) {
    return <Text {...props} type='h1' />
  },
  h2(props: MdxCtx<'h2'>) {
    return <Text {...props} type='h2' />
  },
  h3(props: MdxCtx<'h3'>) {
    return <Text {...props} type='h3' />
  },
  h4(props: MdxCtx<'h4'>) {
    return <Text {...props} type='h4' />
  },
  p(props: MdxCtx<'p'>) {
    return <Text {...props} type='body' />
  },
  table(props: MdxCtx<'table'>) {
    return <Table {...props} />
  },
  pre(props: MdxCtx<'pre'>) {
    const child = props.children
    if (child && typeof child === 'object' && !Array.isArray(child) && 'type' in child && child.type === 'code' && 'props' in child) {
      const { className, children: code } = child.props as {
        className?: string
        children?: React.ReactNode
      }
      const match = /language-(\w+)/.exec(className ?? '')
      if (match) {
        return <CodeBlock code={String(code).trimEnd()} language={match[1]} />
      }
    }
    return <pre {...props} />
  },
}
