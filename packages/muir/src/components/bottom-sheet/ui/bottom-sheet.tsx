import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { atr } from '../../../shared/attributify'
import type { BottomSheetProps } from '../model/properties'
import { Animated } from './animation'
import styling from './public.module.css'

function BottomSheet({ isOpen = false, onOpenChange, children, className, title, closeOnBackdropClick = true, duration, ref, ...props }: BottomSheetProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange?.(false)
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onOpenChange])

  if (!isMounted) return null

  return createPortal(
    <Animated isOpen={isOpen}>
      <div {...props} className={cx('root', styling.root, className)} is-open={atr(isOpen)} ref={ref}>
        <button className={cx('backdrop')} onClick={() => closeOnBackdropClick && onOpenChange?.(false)} type='button' />
        <div aria-labelledby={title ? 'bs-title' : undefined} aria-modal='true' className={cx('sheet')} role='dialog'>
          <div className={cx('handle')} />
          <div className={cx('content')}>
            {title && (
              <div className={cx('title')} id='bs-title'>
                {title}
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </Animated>,
    document.body,
  )
}

export default BottomSheet
