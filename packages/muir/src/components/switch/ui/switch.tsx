import { atr } from '../../../shared/attributify'
import type { SwitchProps } from '../model/properties'
import { Animated } from './animation'
import styling from './public.module.css'

/**
 * A Material Design 3 Switch built on a visually hidden native
 * `<input type="checkbox">` for accessibility and SEO.
 *
 * Compose it with `<Text type="label">` to provide a visible label:
 *
 * ```tsx
 * <Text type="label"><Switch /> Notifications</Text>
 * ```
 */
function Switch({ error, className, ref, showIcon = true, ...props }: SwitchProps) {
  const hasError = error !== undefined && error !== null && error !== false

  // todo: change surface container colors
  return (
    <Animated checked={props.checked} showIcon={showIcon ?? false}>
      <span className={cx('root', styling.root, className)} is-disabled={atr(props.disabled)} is-error={atr(hasError)}>
        <span className={cx('control')}>
          <input {...props} aria-invalid={hasError || undefined} className={cx('input')} ref={ref} type='checkbox' />
          <span aria-hidden='true' className={cx('track')}>
            <span className={cx('thumb')}>
              {showIcon && (
                // biome-ignore lint/a11y/noSvgWithoutTitle: decorative check icon
                <svg className={cx('check')} viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                  <path d='m6 12l4.243 4.243l8.484-8.486' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.25' />
                </svg>
              )}
            </span>
          </span>
        </span>
      </span>
    </Animated>
  )
}

export default Switch
