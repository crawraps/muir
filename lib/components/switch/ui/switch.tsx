import '@material/web/switch/switch.js'
import { useController } from 'react-hook-form'

import type { SwitchProps } from '../model/types'

function ControlledSwitch<FormValues extends Record<string, unknown>>({ className, showOnlySelectedIcon, onChange, ...props }: SwitchProps<FormValues> & { name: string }) {
  const controller = useController<FormValues>({
    disabled: props.disabled,
    // biome-ignore lint/suspicious/noExplicitAny: Required for hook form generic
    name: props.name as any,
  })

  return createElement(
    'md-switch',
    Object.assign(
      {
        className: clsx(['switch'], className),
        'show-only-selected-icon': showOnlySelectedIcon ?? !props.icons,
        ...props,
      },
      {
        disabled: controller.field.disabled,
        name: controller.field.name,
        onBlur: controller.field.onBlur,
        ref: controller.field.ref,
        selected: controller.field.value,
      },
      {
        // biome-ignore lint/suspicious/noExplicitAny: Custom element event
        onInput(ev: any) {
          onChange?.(ev)
          controller.field.onChange(ev.currentTarget.selected)
        },
      },
    ),
  )
}

function UncontrolledSwitch<FormValues extends Record<string, unknown>>({ className, showOnlySelectedIcon, onChange, ...props }: SwitchProps<FormValues>) {
  return createElement(
    'md-switch',
    Object.assign(
      {
        className: clsx(['switch'], className),
        'show-only-selected-icon': showOnlySelectedIcon ?? !props.icons,
        ...props,
      },
      {
        // biome-ignore lint/suspicious/noExplicitAny: Custom element event
        onInput(ev: any) {
          onChange?.(ev)
        },
      },
    ),
  )
}

function Switch<FormValues extends Record<string, unknown>>(props: SwitchProps<FormValues>) {
  if (props.name) {
    return <ControlledSwitch {...props} name={props.name} />
  }
  return <UncontrolledSwitch {...props} />
}

export default Switch
