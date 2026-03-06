import { yupResolver } from '@hookform/resolvers/yup'
import { useImperativeHandle } from 'react'
import { FormProvider, type SubmitErrorHandler, type SubmitHandler, useForm } from 'react-hook-form'
import type { InferType } from 'yup'
import { createSmartClsx } from '../../../shared'
import type { FormMethods, FormProps } from '../model/types'
import style from './style.module.css'

const clsx = createSmartClsx(style)

function Form<FormValues extends Record<string, unknown>>({ schema, ref, ...props }: FormProps<FormValues>) {
  type Schema = InferType<typeof schema>

  const methods = useForm({
    ...props,
    // biome-ignore lint/suspicious/noExplicitAny: yupResolver types are incompatible with generic form values
    resolver: yupResolver(schema) as any,
  })

  // biome-ignore lint/suspicious/noExplicitAny: FormMethods generic incompatibility
  useImperativeHandle<FormMethods<FormValues>, FormMethods<FormValues>>(ref, () => methods as any, [methods])

  const successSubmitHandler: SubmitHandler<Schema> = data => {
    // biome-ignore lint/suspicious/noExplicitAny: generic incompatibility
    return props.onSubmit?.(data as any)
  }

  const errorSubmitHandler: SubmitErrorHandler<FormValues> = errors => {
    return props.onSubmit?.(null, errors)
  }

  const handleClick: React.FormEventHandler<HTMLFormElement> = ev => {
    ev.preventDefault()
    try {
      // biome-ignore lint/suspicious/noExplicitAny: generic incompatibility
      methods.handleSubmit(successSubmitHandler as any, errorSubmitHandler)(ev)
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('formContext is null')) {
        throw new Error('SubmitButton must be used within a Form or FormProvider component')
      } else {
        throw error
      }
    }
  }

  return (
    <FormProvider {...methods}>
      <form {...props} className={clsx('form', props.className)} onSubmit={handleClick} />
    </FormProvider>
  )
}

export default Form
