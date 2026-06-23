import { useCallback, useRef, useState } from 'react'
import { Surface } from 'src/components/surface'
import { atr } from 'src/shared/attributify'
import type { SliderProps } from '../model/properties'
import { Animated } from './animation'
import styling from './public.module.css'
import { buildSegments, snapToStop, toPercent } from './resolve'

/**
 * A Material Design 3 Slider built on a native
 * `<input type="range">` for accessibility and drag interaction.
 *
 * The native input sits on top with opacity:0 so it receives
 * pointer/drag events. The visual track and thumb update reactively
 * from the input's current value.
 */
function Slider({ error, showError = false, orientation = 'horizontal', stops, origin, className, ref, ...props }: SliderProps) {
  const hasError = error !== undefined && error !== null && error !== false

  const min = Number(props.min ?? 0)
  const max = Number(props.max ?? 100)

  const isControlled = props.value !== undefined

  // Internal state for uncontrolled mode — syncs from native input events
  const [internalValue, setInternalValue] = useState<number>(() => (isControlled ? Number(props.value) : props.defaultValue !== undefined ? Number(props.defaultValue) : min))

  // Merge external ref with internal ref for initial value sync
  const inputRef = useRef<HTMLInputElement>(null)
  const mergedRef = useCallback(
    (el: HTMLInputElement | null) => {
      ;(inputRef as React.MutableRefObject<HTMLInputElement | null>).current = el
      // Sync initial value from DOM (e.g. react-hook-form sets value via ref)
      if (el && !isControlled) {
        const domValue = Number(el.value)
        if (domValue !== internalValue) {
          setInternalValue(domValue)
        }
      }
      // Forward to external ref
      if (typeof ref === 'function') ref(el)
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el
    },
    [isControlled, internalValue, ref],
  )

  const currentValue = isControlled ? Number(props.value) : internalValue

  const { onChange } = props
  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value)
      setInternalValue(newValue)
      onChange?.(e)
    },
    [onChange],
  )

  const originPct = toPercent(origin ?? min, min, max)
  const valuePct = snapToStop(toPercent(currentValue, min, max), stops, min, max)
  const segments = buildSegments(originPct, valuePct, stops, min, max)

  return (
    <Animated value={currentValue}>
      <span className={cx('root', styling.root, className)} data-orientation={atr(orientation)} is-disabled={atr(props.disabled)} is-error={atr(hasError)}>
        <span className={cx('control')}>
          <input {...props} aria-invalid={hasError || undefined} className={cx('input')} max={props.max} min={props.min} onChange={handleInput} ref={mergedRef} type='range' />
          <span className={cx('track')}>
            {segments.map(seg => (
              <span className={cx('segment')} data-active={atr(seg.active)} key={`segment-${seg.start}`} style={{ '--segment-length': `${seg.length}%` } as React.CSSProperties}>
                <Surface
                  className={cx('segment-fill')}
                  style={
                    seg.active ? ({ '--surface-color': 'var(--active-color)' } as React.CSSProperties) : ({ '--surface-color': 'var(--inactive-color)' } as React.CSSProperties)
                  }
                  type='plain'
                />
              </span>
            ))}
            {stops?.map(stop => {
              const pct = toPercent(stop, min, max)
              return <span className={cx('stop-mark')} key={`stop-${stop}`} style={{ '--stop-offset': `${pct}%` } as React.CSSProperties} />
            })}
            <span className={cx('thumb')} style={{ '--thumb-offset': `${valuePct}%` } as React.CSSProperties}>
              <Surface className={cx('thumb-fill')} style={{ '--surface-color': 'var(--thumb-color)' } as React.CSSProperties} type='plain' />
            </span>
          </span>
        </span>
        {showError && hasError && <span className={cx('error-text')}>{error}</span>}
      </span>
    </Animated>
  )
}

export default Slider
