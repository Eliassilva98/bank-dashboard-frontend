import { Button as StyledButton } from './styles'
import Spinner from '@/components/ui/spinner/Spinner'

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  isLoading = false,
  disabled = false,
  onClick,
  ...props
}) => {
  return (
    <StyledButton
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      data-variant={variant}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size='sm' color='currentColor' ariaLabel='Processando' />
          <span>Aguarde...</span>
        </>
      ) : (
        children
      )}
    </StyledButton>
  )
}

export default Button