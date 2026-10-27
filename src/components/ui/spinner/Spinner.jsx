import { SpinnerWrapper } from './styles'

const Spinner = ({
  size = 'md',
  color = 'text.primary',
  ariaLabel = 'Carregando' }) => {
  return (
    <SpinnerWrapper
      $size={size}
      $color={color}
      $ariaLabel={ariaLabel}
      aria-live='polite'
    />
  )
}

export default Spinner