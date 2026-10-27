import { Link as RouterLink } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { color, fontSize, fontWeight, transition } from '@/styles/themeHelpers'

const linkTransition = transition(['color', 'border-color'], '0.2s', 'ease')

const variantStyles = {
  primary: css`
    color: ${color('border.focus')};

    &:hover:not([data-disabled='true']) {
      color: ${color('text.secondary')};
    }

    &:active:not([data-disabled='true']) {
      color: ${color('text.primary')};
    }
  `,

  secondary: css`
    color: ${color('text.primary')};

    &:hover:not([data-disabled='true']) {
      color: ${color('text.secondary')};
    }

    &:active:not([data-disabled='true']) {
      color: ${color('border.focus')};
    }
  `,

  ghost: css`
    color: ${color('text.secondary')};

    &:hover:not([data-disabled='true']) {
      color: ${color('text.primary')};
    }

    &:active:not([data-disabled='true']) {
      color: ${color('border.focus')};
    }
  `,

  danger: css`
    color: ${color('feedback.error')};

    &:hover:not([data-disabled='true']) {
      color: ${color('feedback.errorDark')};
    }

    &:active:not([data-disabled='true']) {
      color: ${color('feedback.errorDarker')};
    }

    &:focus-visible {
      outline-color: ${color('feedback.error')};
    }
  `
}

const sizeStyles = {
  sm: fontSize('sm'),
  md: fontSize('md'),
  lg: fontSize('lg')
}

export const StyledLink = styled(RouterLink)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: ${({ 'data-size': size }) => sizeStyles[size] || sizeStyles.md};
  font-weight: ${fontWeight('medium')};
  line-height: 1.5;
  text-decoration: none;
  cursor: ${({ 'data-disabled': disabled }) =>
    disabled ? 'not-allowed' : 'pointer'};
  ${linkTransition}

  ${({ 'data-variant': variant }) =>
    variantStyles[variant] || variantStyles.primary}

&:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${color('border.focus')};
    border-radius: 2px;
  }

  &[data-disabled='true'] {
    opacity: 0.6;
    pointer-events: none;
  }
`
