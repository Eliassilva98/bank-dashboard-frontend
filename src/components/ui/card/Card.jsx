import { Card as StyledCard } from './styles'

const Card = ({
  children,
  padding = 'md',
  shadow = 'sm',
  radius = 'md',
  hover = false,
  variant = 'default',
  as,
  onClick,
  ...props
}) => {
  return (
    <StyledCard
      as={as}
      $padding={padding}
      $shadow={shadow}
      $radius={radius}
      $hover={hover}
      $variant={variant}
      onClick={onClick}
      {...props}
    >
      {children}
    </StyledCard>
  )
}

export default Card