import styled, { css } from 'styled-components'
import { color, spacing, radius, shadow } from '@/styles/themeHelpers'

const variantStyles = {
  default: css`
    background-color: ${color('background.primary')};
    border: 1px solid ${color('border.default')};
  `,

  outlined: css`
    background-color: transparent;
    border: 1px solid ${color('border.default')};
  `,

  flat: css`
    background-color: ${color('background.secondary')};
    border: 1px solid transparent;
  `
}

export const Card = styled.div`
  display: block;
  width: 100%;
  padding: ${({ $padding }) => spacing($padding)};
  background-color: ${color('background.primary')};
  border-radius: ${({ $radius }) => radius($radius)};
  box-shadow: ${({ $shadow }) => shadow($shadow)};
  ${({ $variant }) => variantStyles[$variant] || variantStyles.default};

  ${({ $hover }) =>
    $hover &&
    css`
      cursor: pointer;
      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
      }
    `}
`
