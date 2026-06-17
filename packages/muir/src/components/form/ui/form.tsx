import { yupResolver } from '@hookform/resolvers/yup'
import { useImperativeHandle } from 'react'
import type { FieldValues } from 'react-hook-form'
import { FormProvider, useForm } from 'react-hook-form'
import type { FormHandle, FormProps } from '../model/properties'
import styling from './public.module.css'

/**
 * A Material Design 3 Form component.
 * Wraps an HTML `<form>` with react-hook-form internally, exposing a clean API
 * so end users never interact with react-hook-form directly.
 */
function Form<T extends FieldValues = FieldValues>({ ref, schema, validateOn = 'onSubmit', revalidateOn = 'onChange', onSubmit, onError, defaultValues, ...props }: FormProps<T>) {
  const form = useForm<T>({
    defaultValues,
    mode: validateOn,
    reValidateMode: revalidateOn,
    ...(schema ? { resolver: yupResolver(schema) as never } : {}),
  })

  useImperativeHandle(
    ref,
    (): FormHandle<T> => ({
      submit: form.handleSubmit(
        (data, event) => onSubmit?.(data, event),
        (errors, event) => onError?.(errors, event),
      ),
      reset: values => form.reset(values),
      getValues: () => form.getValues(),
      setValue: (name, value, options) => form.setValue(name, value as never, options),
      validate: name => form.trigger(name),
      clearErrors: name => form.clearErrors(name),
      setFocus: name => form.setFocus(name),
    }),
    [form, onSubmit, onError],
  )

  const handleSubmit = form.handleSubmit(
    (data, event) => onSubmit?.(data, event),
    (errors, event) => onError?.(errors, event),
  )

  return (
    <FormProvider {...form}>
      <form className={cx('form', styling.form, props.className)} noValidate onSubmit={handleSubmit} {...props}>
        {props.children}
      </form>
    </FormProvider>
  )
}

export default Form
