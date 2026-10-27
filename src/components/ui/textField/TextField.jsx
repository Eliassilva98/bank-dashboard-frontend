import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Field, Label, Input, ErrorText, InputWrapper, ToggleButton } from './styles'

const TextField = ({ id, label, type = 'text', placeholder, autoComplete, error, registerProps }) => {
  const [showValue, setShowValue] = useState(false)

  const isPassword = type === 'password'
  const inputType = isPassword && showValue ? 'text' : type
  return (
    <Field>
      {label && <Label htmlFor={id}>{label}</Label>}
      <InputWrapper>
        <Input
          id={id}
          type={inputType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          {...registerProps}
        />
        {isPassword && (
          <ToggleButton
            type='button'
            onClick={() => setShowValue(prev => !prev)}
            aria-label={showValue ? 'Esconder senha' : 'Mostrar senha'}
            aria-pressed={showValue}
          >
            {showValue ? <EyeOff size={20} aria-hidden='true' /> : <Eye size={20} aria-hidden='true' />}
          </ToggleButton>
        )}
      </InputWrapper>
      {error && <ErrorText role='alert'>{error}</ErrorText>}
    </Field>
  )
}

export default TextField