import { lazy } from 'react'
import { createFormHook } from '@tanstack/react-form'
import { fieldContext, formContext } from './form-context'

const TextField = lazy(() => import('../components/form/text-field.tsx'))
const NumberField = lazy(() => import('../components/form/number-field.tsx'))
const SelectField = lazy(() => import('../components/form/select-field.tsx'))
const RadioGroupField = lazy(() => import('../components/form/radio-group-field.tsx'))
const CheckboxField = lazy(() => import('../components/form/checkbox-field.tsx'))
const MultiSelectField = lazy(() => import('../components/form/multi-select-field.tsx'))
const SubmitButton = lazy(() => import('../components/form/submit-button.tsx'))

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    NumberField,
    SelectField,
    RadioGroupField,
    CheckboxField,
    MultiSelectField,
  },
  formComponents: {
    SubmitButton,
  },
})
