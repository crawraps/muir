import { atr } from 'src/shared/attributify'
import type { CheckboxProps } from '../model/properties'
import { Animated } from './animation'
import styling from './public.module.css'

/**
 * A Material Design 3 Checkbox built on a visually hidden native
 * `<input type="checkbox">` for accessibility and SEO.
 *
 * Compose it with `<Text type="label">` to provide a visible label:
 *
 * ```tsx
 * <Text type="label"><Checkbox /> Accept terms</Text>
 * ```
 */
function Checkbox({ error, showError = false, className, ref, ...props }: CheckboxProps) {
  const hasError = error !== undefined && error !== null && error !== false

  return (
    <Animated checked={props.checked}>
      <span className={cx('root', styling.root, className)} is-disabled={atr(props.disabled)} is-error={atr(hasError)}>
        <span className={cx('control')}>
          <input {...props} aria-invalid={hasError || undefined} className={cx('input')} ref={ref} type='checkbox' />
          <span aria-hidden='true' className={cx('box')}>
            {/* biome-ignore lint/a11y/noSvgWithoutTitle: decorative check icon */}
            <svg className={cx('check')} viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
              <path d='m6 12l4.243 4.243l8.484-8.486' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.25' />
            </svg>
            <div className={cx('background')} />
          </span>
        </span>
        {showError && hasError && <span className={cx('error-text')}>{error}</span>}
      </span>
    </Animated>
  )
}

export default Checkbox
