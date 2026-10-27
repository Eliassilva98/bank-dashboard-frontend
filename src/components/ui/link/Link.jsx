import { Link as RouterLink } from 'react-router-dom'
import { StyledLink } from './styles'

const Link = ({
  to,
  href,
  variant = 'primary',
  size = 'md',
  underline = false,
  disabled = false,
  children,
  ...props
}) => {
  const styledProps = {
    'data-variant': variant,
    'data-size': size,
    'data-underline': underline,
    'data-disabled': disabled,
    'aria-disabled': disabled || undefined,
    ...props
  }

  if (disabled) {
    return (
      <StyledLink as='span' {...styledProps}>
        {children}
      </StyledLink>
    )
  }

  if (href) {
    return (
      <StyledLink
        as='a'
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        {...styledProps}
      >
        {children}
      </StyledLink>
    )
  }

  if (!to) {
    return (
      <StyledLink as='span' {...styledProps}>
        {children}
      </StyledLink>
    )
  }

  return (
    <StyledLink as={RouterLink} to={to} {...styledProps}>
      {children}
    </StyledLink>
  )
}

export default Link