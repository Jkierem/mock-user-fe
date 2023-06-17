import React, { Reducer, useContext, useEffect, useReducer } from 'react'
import * as T from "jazzi/dist/Either"
import { DeepPartial, MapValues } from '../../support/types'
import { Lens } from '../../support/optics/lens'
import { ErrorsOf, Schema } from '../../support/schema'

const identity = <T,>(x: T) => x

type FormCtx = {
  loading: boolean
  error: boolean
  submit: () => void
  reset: () => void
  setValue: (key: string, val: unknown) => void
  getValue: (key: string) => unknown
  setError: (key: string, value: boolean | string) => void
  getError: (key: string) => boolean | string
}

const FormContext = React.createContext<FormCtx | null>(null)

export const useFormState = () => useContext(FormContext)

type FormAction =
  | {
      type: 'set'
      key: string
      value: unknown
    }
  | {
      type: 'set_error'
      key: string
      value: string | boolean
    }
  | {
      type: 'clean_error'
    }
  | {
      type: 'reset'
    }
  | {
      type: 'batch_errors'
      errors: Record<any, any>
    }

type FormState<T> = {
  values: T
  errors: DeepPartial<MapValues<T, string | boolean>>
}

const formReducer =
  <T extends Record<string, unknown>>(initial: T) =>
  (state: FormState<T>, action: FormAction): FormState<T> => {
    switch (action.type) {
      case 'reset':
        return {
          errors: {} as DeepPartial<MapValues<T, string | boolean>>,
          values: { ...initial },
        }
      case 'clean_error':
        return {
          errors: {} as DeepPartial<MapValues<T, string | boolean>>,
          values: state.values,
        }
      case 'set':
        return Lens.fromDotNotation<any>(`values.${action.key}`).toConstant(action.value)(state)
      case 'set_error':
        return Lens.fromDotNotation<any>(`errors.${action.key}`).toConstant(action.value)(state)
      case 'batch_errors':
        return Lens.fromDotNotation<any>('errors').toConstant(action.errors)(state)
    }
  }

type FormProps<T> = {
  initialState: T
  onChange?: (data: T) => void
  onSubmit?: (data: T) => void
  onError?: (erors: ErrorsOf<T>) => void
  schema?: Schema<T>
  cleanOnChange?: boolean
  children: React.ReactNode
}

const deepIsEmpty = <T,>(data: T): boolean =>
  Object.entries(data as any).every(([, val]) => {
    if (typeof val === 'object') {
      return deepIsEmpty(val)
    }
    return !Boolean(val)
  })

const Form = <T extends Record<string, unknown>>({
  children,
  initialState,
  onSubmit,
  onChange,
  onError,
  schema,
  cleanOnChange,
}: FormProps<T>) => {
  const [state, dispatch] = useReducer<Reducer<FormState<T>, FormAction>>(formReducer(initialState), {
    values: initialState,
    errors: {},
  } as FormState<T>)

  const hasErrors = !deepIsEmpty(state.errors)

  const setError = (key: string, value: boolean | string) =>
    dispatch({
      type: 'set_error',
      key,
      value,
    })

  const batchSetError = (errors: ErrorsOf<T>) => {
    dispatch({
      type: 'batch_errors',
      errors,
    })
  }

  useEffect(() => {
    onChange?.(state.values)
  }, [state, onChange])

  const submit = () => {
    if ( schema ){
      schema
      .validate(state.values)
      ['|>'](T.map(x => x.result))
      ['|>'](T.fold(
        (e) => {
          batchSetError(e.reason);
          onError?.(e.reason)
        },
        (data) => {
          onSubmit?.(data)
        }
      ))
    } else {
      onSubmit?.(state.values)
    }
  }
  const reset = () => dispatch({ type: 'reset' })
  const getValue = (key: string) => Lens.fromDotNotation(key as never).read(state.values)
  const setValue = (key: string, value: unknown) => {
    cleanOnChange && dispatch({ type: 'clean_error' })
    dispatch({
      type: 'set',
      key,
      value,
    })

  }
  const getError = (key: string) => Lens.fromDotNotation(key as never).read(state.errors) ?? (false as string | boolean)

  return (
    <FormContext.Provider
      value={{
        loading: false,
        error: hasErrors,
        submit,
        reset,
        getValue,
        setValue,
        getError,
        setError,
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        {children}
      </form>
    </FormContext.Provider>
  )
}

type ChildrenProps = {
  value: unknown
  error: boolean | string
  loading: boolean
  setValue: (val: unknown) => void
  setError: (val: boolean | string) => void
}

type FieldProps = {
  name: string
  children: (props: ChildrenProps) => JSX.Element
}

export const Field = ({ name, children }: FieldProps) => {
  const ctx = useFormState()

  const value = ctx?.getValue(name)
  const error = ctx?.getError(name) ?? false
  const setValue = (val: unknown) => ctx?.setValue(name, val)
  const setError = (val: boolean | string) => ctx?.setError(name, val)

  return children({
    value,
    error,
    loading: Boolean(ctx?.loading),
    setValue,
    setError,
  })
}

type ConnectProps = {
  children: (props: Pick<FormCtx, 'submit' | 'reset' | 'loading' | 'error'>) => JSX.Element
}

const Connect = ({ children }: ConnectProps) => {
  const ctx = useFormState()

  return children({
    loading: Boolean(ctx?.loading),
    error: ctx?.error ?? false,
    submit: ctx?.submit ?? identity<void>,
    reset: ctx?.reset ?? identity<void>,
  })
}

Field.Connect = Connect

export default Form
