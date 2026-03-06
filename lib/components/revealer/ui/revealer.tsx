import React, { useRef } from 'react'
import { createSmartClsx } from '../../../shared'
import { useAnimatedRoot } from '../model/animated-root'
import { useAnimatedText } from '../model/animated-text'
import type { RevealerProps } from '../model/types'
import style from './style.module.css'

const clsx = createSmartClsx(style)

function TextRevealer({ tagName = 'span', isRevealed, className, hiddenVector = '-150%', ...props }: RevealerProps) {
  const root = useRef<HTMLElement>(null)
  useAnimatedText(root, { hiddenVector, isRevealed })
  return React.createElement(tagName, {
    ref: root,
    style: { overflow: props.autoHideOverflow ? 'hidden' : 'visible' },
    ...props,
    className: clsx(['revealer', { 'animate-text': true, revealed: true }], className),
  })
}

function RootRevealer({ tagName = 'span', isRevealed, className, hiddenVector = '-150%', ...props }: RevealerProps) {
  const root = useRef<HTMLElement>(null)
  useAnimatedRoot(root, { hiddenVector, isRevealed })
  return React.createElement(tagName, {
    ref: root,
    style: { overflow: props.autoHideOverflow ? 'hidden' : 'visible' },
    ...props,
    className: clsx(['revealer', { 'animate-text': false, revealed: true }], className),
  })
}

function Revealer({ animateText = true, ...props }: RevealerProps) {
  if (typeof props.children === 'string' && animateText) {
    return <TextRevealer animateText={animateText} {...props} />
  }
  return <RootRevealer animateText={animateText} {...props} />
}

export default Revealer
