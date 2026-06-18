import { Children, useEffect, useRef, useState } from 'react'
import type { ErrorMessageProps } from '../model/properties'
import { Animated } from './animation'
import styling from './public.module.css'

function ErrorMessage({ children, className }: ErrorMessageProps) {
  const items = Children.toArray(children)
  const hasItems = items.length > 0

  type Phase = 'hidden' | 'visible' | 'hiding'

  const [phase, setPhase] = useState<Phase>(() => (hasItems ? 'visible' : 'hidden'))
  const [displayedItems, setDisplayedItems] = useState<React.ReactNode[]>(() => (hasItems ? items : []))
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)
  const prevItemsRef = useRef<React.ReactNode[]>(hasItems ? items : [])

  useEffect(() => {
    const prevItems = prevItemsRef.current
    const hadItems = prevItems.length > 0
    prevItemsRef.current = items

    if (hasItems && !hadItems) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      setDisplayedItems(items)
      setPhase('visible')
    } else if (!hasItems && hadItems) {
      setPhase('hiding')
      timeoutRef.current = setTimeout(() => {
        setPhase('hidden')
        setDisplayedItems([])
        timeoutRef.current = null
      }, 800)
    } else if (hasItems) {
      setDisplayedItems(items)
    }
  }, [items, hasItems])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  if (phase === 'hidden') return null

  const getKey = (item: React.ReactNode, index: number): string => {
    if (typeof item === 'string') return item
    if (typeof item === 'number') return String(item)
    return `error-item-${index}`
  }

  return (
    <Animated isRevealed={phase === 'visible'}>
      <div aria-hidden={phase === 'hiding' ? 'true' : undefined} className={cx('container', styling.container, className)} role='alert'>
        {displayedItems.map((item, index) => (
          <div className={cx('item')} key={getKey(item, index)}>
            {item}
          </div>
        ))}
      </div>
    </Animated>
  )
}

export default ErrorMessage
