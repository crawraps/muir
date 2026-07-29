import { createElement } from 'react'
import { Surface } from 'src/components'
import { atr } from 'src/shared'
import type { TextInputProps } from '../model/properties'
import { AnimatedErrors } from './animation'
import styling from './public.module.css'

function TextInput({ multiline = false, rows = 3, ref, label, comment, errors, className, ...props }: TextInputProps) {
  const hasError = errors !== undefined && errors !== null && errors !== false && (Array.isArray(errors) ? errors.length > 0 : true)
  const isArrayError = Array.isArray(errors) && errors.length > 0

  const inputElement = createElement(multiline ? 'textarea' : 'input', {
    className: cx('input'),
    type: multiline ? undefined : props.type,
    'aria-invalid': hasError || undefined,
    ...(multiline ? { rows } : {}),
    ...props,
    ref,
  })

  return (
    <label className={cx('root', styling.root, className)} is-disabled={atr(props.disabled)} is-error={atr(hasError)} is-multiline={atr(multiline)} muir-name='text-input'>
      <Surface className={cx('surface')}>
        {label && (
          <aside className={cx('header')}>
            <span className={cx('label-text')}>{label}</span>
          </aside>
        )}
        <div className={cx('body')}>{inputElement}</div>
        {(comment || hasError) && (
          <footer className={cx('footer')}>
            {hasError && isArrayError && (
              <AnimatedErrors>
                <div className={cx('errors-list')} role='alert'>
                  {Children.map(errors, err => (
                    <div className={cx('error-item')}>{err}</div>
                  ))}
                </div>
              </AnimatedErrors>
            )}
            {hasError && !isArrayError && (
              <span className={cx('error-item')} role='alert'>
                {errors}
              </span>
            )}
            {!hasError && comment && <span className={cx('comment')}>{comment}</span>}
          </footer>
        )}
      </Surface>
    </label>
  )
}

export default TextInput
