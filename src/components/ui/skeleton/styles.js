import styled, { keyframes } from 'styled-components'
import { color, radius } from '@/styles/themeHelpers'

const shimmer = keyframes`
0% {
  opacity: 0.4;
}

50% {
  opacity: 0.8;
}

100% {
  opacity: 0.4;
}
`

export const Skeleton = styled.span`
  display: inline-block;
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || '1em'};
  background-color: ${color('border.default')};
  border-radius: ${({ $circle }) => ($circle ? '50%' : radius('sm'))};
  animation: ${shimmer} 1.5s ease-in-out infinite;

  &:nth-of-type(2) {
    animation-delay: 0.2s;
  }

  &:nth-of-type(3) {
    animation-delay: 0.4s;
  }
`
