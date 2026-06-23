import { atr, Button } from '@muir/base'
import type React from 'react'
import { useMemo, useState } from 'react'
import type { ToggleButtonProps } from '../model/properties'
import styling from './public.module.css'

/**
 * ToggleButton lets users switch a state on or off — like favoriting an item or
 * following a topic. When checked, a check icon appears to the left of the label.
 */
function ToggleButton({ checked, toggled, showCheckIcon = true, onToggle, onClick, children, ...props }: ToggleButtonProps) {
  // Backward compatibility: `toggled` is an alias for `checked`
  const controlledChecked = checked !== undefined ? checked : toggled
  const isControlled = controlledChecked !== undefined

  const [internalChecked, setInternalChecked] = useState(() => controlledChecked ?? false)

  const resolvedChecked = isControlled ? controlledChecked! : internalChecked

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = event => {
    if (props.disabled) return

    const next = !resolvedChecked

    if (!isControlled) {
      setInternalChecked(next)
    }

    onToggle?.(next)
    onClick?.(event)
  }

  const checkIcon = useMemo(() => {
    if (!showCheckIcon) return null
    return (
      // biome-ignore lint/a11y/noSvgWithoutTitle: decorative check icon
      <svg className={cx('check-icon')} viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
        <path d='m6 12l4.243 4.243l8.484-8.486' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.25' />
      </svg>
    )
  }, [showCheckIcon])

  return (
    <Button
      {...props}
      aria-pressed={resolvedChecked}
      className={cx('toggle-button', styling['toggle-button'], props.className)}
      is-checked={atr(resolvedChecked)}
      onClick={handleClick}
      variant={resolvedChecked ? 'filled' : 'filled-tonal'}
    >
      {resolvedChecked && checkIcon}
      <span>{children}</span>
    </Button>
  )
}

export default ToggleButton
