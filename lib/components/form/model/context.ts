import { createContext, useContext } from 'react'
import type { FieldValues } from 'react-hook-form'
import type { FormContextValue } from './types'

const FormContext = createContext<FormContextValue | null>(null)

/**
 * Access the form context from a child component.
 * Must be used within a `<Form>` component.
 */
export function useFormContext<T extends FieldValues = FieldValues>(): FormContextValue<T> {
  const ctx = useContext(FormContext)

  if (!ctx) {
    throw new Error('useFormContext must be used within a <Form> component.')
  }

  return ctx as FormContextValue<T>
}

export default FormContext
