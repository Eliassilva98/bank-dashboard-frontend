import styled, { keyframes } from 'styled-components'
import { color } from '@/styles/themeHelpers'

const spin = keyframes`
to {
  transform: rotate(360deg);
}
`

const sizeMap = {
  sm: '0.875rem',
  md: '1.25rem',
  lg: '1.5rem'
}

const strokeMap = {
  sm: '0.125rem',
  md: '0.15rem',
  lg: '0.1875rem'
}

export const SpinnerWrapper = styled.span`
  display: inline-block;
  width: ${({ $size }) => sizeMap[$size] || sizeMap.md};
  height: ${({ $size }) => sizeMap[$size] || sizeMap.md};
  border: ${({ $size }) => strokeMap[$size] || strokeMap.md} solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.75s linear infinite;
  color: ${({ $color }) => ($color === 'currentColor' ? 'currentColor' : color($color))};
  flex-shrink: 0;
`
