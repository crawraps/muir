import { atr } from 'src/shared/attributify'
import type { RadioButtonProps } from '../model/properties'
import styling from './public.module.css'

/**
 * A Material Design 3 Radio Button built on a visually hidden native
 * `<input type="radio">` for accessibility and SEO.
 *
 * Compose it with `<Text type="label">` to provide a visible label:
 *
 * ```tsx
 * <Text type="label"><RadioButton name="size" value="s" /> Small</Text>
 * ```
 */
function RadioButton({ error, showError = false, className, ref, ...props }: RadioButtonProps) {
  const hasError = error !== undefined && error !== null && error !== false

  return (
    <span className={cx('root', styling.root, className)} is-disabled={atr(props.disabled)} is-error={atr(hasError)}>
      <span className={cx('control')}>
        <input {...props} aria-invalid={hasError || undefined} className={cx('input')} ref={ref} type='radio' />
        <span aria-hidden='true' className={cx('box')}>
          <span className={cx('dot')} />
        </span>
      </span>
      {showError && hasError && <span className={cx('error-text')}>{error}</span>}
    </span>
  )
}

export default RadioButton
