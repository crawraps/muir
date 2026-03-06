import { useAnimatedRoot } from '../model/animated-root'
import { useAnimatedText } from '../model/animated-text'
import type { RevealerProps } from '../model/types'

function TextRevealer({ tagName = 'span', isRevealed, className, hiddenVector = '-150%', ...props }: RevealerProps) {
  const root = useRef<HTMLElement>(null)
  useAnimatedText(root, { hiddenVector, isRevealed })
  return createElement(tagName, {
    ref: root,
    style: { overflow: props.autoHideOverflow ? 'hidden' : 'visible' },
    ...props,
    className: clsx(['revealer', { 'animate-text': true, revealed: true }], className),
  })
}

function RootRevealer({ tagName = 'span', isRevealed, className, hiddenVector = '-150%', ...props }: RevealerProps) {
  const root = useRef<HTMLElement>(null)
  useAnimatedRoot(root, { hiddenVector, isRevealed })
  return createElement(tagName, {
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
