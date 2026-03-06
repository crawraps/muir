import '@material/web/textfield/filled-text-field.js'
import '@material/web/textfield/outlined-text-field.js'

import { useController } from 'react-hook-form'
import type { TextFieldProps } from '../model/types'

function TextField<FormValues extends Record<string, unknown>>({
  variant = 'filled',
  size = 'medium',
  trailingIcon,
  leadingIcon,
  children,
  onChange,
  ...props
}: TextFieldProps<FormValues>): import('react').ReactElement {
  const controller =
    props.name &&
    // biome-ignore lint/correctness/useHookAtTopLevel: The name prop doesn't change during the component lifecycle
    useController<FormValues>({
      disabled: props.disabled,
      name: props.name,
    })

  const childs = useMemo(() => {
    const childs = Children.toArray(children)

    if (trailingIcon) {
      if (typeof trailingIcon === 'string') {
        childs.unshift(
          <svg key='trailing-icon' slot='trailing-icon'>
            <title>Trailing icon</title>
            <use href={trailingIcon} />
          </svg>,
        )
      } else {
        childs.unshift(cloneElement(trailingIcon, { key: 'trailing-icon', slot: 'trailing-icon' }))
      }
    }

    if (leadingIcon) {
      if (typeof leadingIcon === 'string') {
        childs.unshift(
          <svg key='leading-icon' slot='leading-icon'>
            <title>Leading icon</title>
            <use href={leadingIcon} />
          </svg>,
        )
      } else {
        childs.unshift(cloneElement(leadingIcon, { key: 'leading-icon', slot: 'leading-icon' }))
      }
    }

    return childs
  }, [children, trailingIcon, leadingIcon])

  return createElement(
    `md-${variant}-text-field`,
    Object.assign(
      {
        ...props,
        className: clsx(['button', size, variant, { 'read-only': props.readOnly }], props.className),
      },
      controller && {
        ...controller.field,
        error: controller.fieldState.error,
        errorText: controller.fieldState.error?.message,
        value: controller.field.value ?? '',
      },
      {
        // biome-ignore lint/suspicious/noExplicitAny: Custom element event
        onInput(ev: any) {
          onChange?.(ev)
          if (controller) controller.field.onChange(ev)
        },
      },
    ),
    childs,
  )
}

export default TextField
